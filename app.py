import os
import streamlit as st
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
)
from unstructured.partition.pdf import partition_pdf


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def extract_text_with_layout(files):
    """
    Extracts text from PDFs using OCR + layout awareness.
    Handles scanned PDFs, tables, headings, images.
    """
    full_text = ""

    for file in files:
        elements = partition_pdf(
            file=file,
            extract_images_in_pdf=True,
            infer_table_structure=True,
            strategy="hi_res",   
        )

        for el in elements:
            if hasattr(el, "text") and el.text:
                full_text += el.text + "\n"

    return full_text


def split_text(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200
    )
    return splitter.split_text(text)


def create_vector_store(chunks):
    embeddings = GoogleGenerativeAIEmbeddings(
        model="text-embedding-004"
    )

    vectorstore = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings
    )

    vectorstore.save_local("faiss_index")

def get_retrieval_chain():
    prompt = PromptTemplate(
        template="""
You are an intelligent assistant.
Answer strictly using the provided context.
If the answer is not present, say:
"Answer is not available in the provided documents."

Context:
{context}

Question:
{question}

Answer:
""",
        input_variables=["context", "question"]
    )

    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash",
        temperature=0.3
    )

    embeddings = GoogleGenerativeAIEmbeddings(
        model="text-embedding-004"
    )

    vectorstore = FAISS.load_local(
        "faiss_index",
        embeddings,
        allow_dangerous_deserialization=True
    )

    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 5}
    )

    chain = (
        {
            "context": retriever,
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain

def handle_user_query(question):
    chain = get_retrieval_chain()
    response = chain.invoke(question)

    st.markdown("### 🤖 Answer")
    st.write(response)


def main():
    st.set_page_config(
        page_title="Chat with PDFs (OCR + Layout)",
        layout="wide"
    )

    st.title("📄 Chat with Multiple PDFs using Gemini (OCR Enabled)")

    user_question = st.text_input(
        "Ask a question from the uploaded documents"
    )

    if user_question:
        handle_user_query(user_question)

    with st.sidebar:
        st.header("📂 Upload Documents")

        files = st.file_uploader(
            "Upload PDF files",
            type=["pdf"],
            accept_multiple_files=True
        )

        if st.button("Process Documents"):
            if not files:
                st.warning("Please upload at least one PDF.")
                return

            with st.spinner("Extracting text (OCR + layout)..."):
                text = extract_text_with_layout(files)
                chunks = split_text(text)
                create_vector_store(chunks)

            st.success("Documents indexed successfully!")


if __name__ == "__main__":
    main()
