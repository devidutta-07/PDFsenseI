import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from unstructured.partition.pdf import partition_pdf
import tempfile

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
FAISS_INDEX_PATH = "faiss_index"


def extract_text_with_layout(file_paths: list[str]) -> str:
    """Extract text from PDFs using OCR + layout awareness."""
    full_text = ""
    for path in file_paths:
        elements = partition_pdf(
            filename=path,
            extract_images_in_pdf=True,
            infer_table_structure=True,
            strategy="hi_res",
        )
        for el in elements:
            if hasattr(el, "text") and el.text:
                full_text += el.text + "\n"
    return full_text


def split_text(text: str) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
    )
    return splitter.split_text(text)


def create_vector_store(chunks: list[str]):
    embeddings = GoogleGenerativeAIEmbeddings(model="text-embedding-004")
    vectorstore = FAISS.from_texts(texts=chunks, embedding=embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)


def get_retrieval_chain():
    prompt = PromptTemplate(
        template="""
You are PDFSensei — an intelligent document assistant.
Answer strictly using the provided context.
If the answer is not present, say:
"The answer is not available in the provided documents."

Context:
{context}

Question:
{question}

Answer:
""",
        input_variables=["context", "question"],
    )

    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash",
        temperature=0.3,
    )

    embeddings = GoogleGenerativeAIEmbeddings(model="text-embedding-004")

    vectorstore = FAISS.load_local(
        FAISS_INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True,
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain


# ── Routes ──────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "PDFSensei Backend"})


@app.route("/process", methods=["POST"])
def process_documents():
    """Receive uploaded PDFs, extract text, and index into FAISS."""
    if "files" not in request.files:
        return jsonify({"status": "error", "message": "No files provided"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"status": "error", "message": "Empty file list"}), 400

    tmp_paths = []
    try:
        # Save uploaded files to temp directory
        for file in files:
            if not file.filename.endswith(".pdf"):
                continue
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                file.save(tmp.name)
                tmp_paths.append(tmp.name)

        if not tmp_paths:
            return jsonify({"status": "error", "message": "No valid PDF files"}), 400

        # Extract, split, index
        text   = extract_text_with_layout(tmp_paths)
        chunks = split_text(text)
        create_vector_store(chunks)

        return jsonify({
            "status": "ok",
            "message": f"Indexed {len(tmp_paths)} document(s) into {len(chunks)} chunks.",
            "doc_count": len(tmp_paths),
            "chunk_count": len(chunks),
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        # Clean up temp files
        for path in tmp_paths:
            try:
                os.unlink(path)
            except OSError:
                pass


@app.route("/ask", methods=["POST"])
def ask_question():
    """Answer a question using the indexed documents."""
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"status": "error", "message": "No question provided"}), 400

    question = data["question"].strip()
    if not question:
        return jsonify({"status": "error", "message": "Empty question"}), 400

    if not os.path.exists(FAISS_INDEX_PATH):
        return jsonify({
            "status": "error",
            "message": "No documents have been indexed yet. Please upload and process PDFs first.",
        }), 400

    try:
        chain  = get_retrieval_chain()
        answer = chain.invoke(question)
        return jsonify({"status": "ok", "answer": answer})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
