import os
import streamlit as st
from dotenv import load_dotenv

from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_mistralai import ChatMistralAI

from unstructured.partition.pdf import partition_pdf


load_dotenv()


def extract_text(files):
    text = ""

    for file in files:
        elements = partition_pdf(
            file=file,
            extract_images_in_pdf=True,
            infer_table_structure=True,
            strategy="hi_res"
        )

        for el in elements:
            if hasattr(el, "text") and el.text:
                text += el.text + "\n"

    return text


def split_text(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200
    )
    return splitter.split_text(text)


def create_vector_store(chunks):
    if not chunks or len(chunks) == 0:
        raise ValueError("No text chunks provided. Ensure PDFs contain extractable text.")
    
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_texts(chunks, embeddings)
    vectorstore.save_local("faiss_index")


def get_chain():
    prompt = PromptTemplate(
        template="""
Answer the question using only the context below.
If the answer is not in the documents, say:
"Answer is not available in the provided documents."

Context:
{context}

Question:
{question}

Answer:
""",
        input_variables=["context", "question"]
    )

    llm = ChatMistralAI(
        model_name="mistral-small-latest",
        temperature=0.3,
    )

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    try:
        vectorstore = FAISS.load_local(
            "faiss_index",
            embeddings,
            allow_dangerous_deserialization=True
        )
    except Exception as e:
        raise RuntimeError("No documents have been processed yet. Please upload and process PDFs first.")

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain


def main():
    st.set_page_config(page_title="Chat with PDFs", layout="wide")
    st.title("Chat with PDFs using Mistral")

    question = st.text_input("Ask something from the documents")

    if question:
        try:
            chain = get_chain()
            response = chain.invoke(question)

            st.markdown("### Answer")
            st.write(response)
        except RuntimeError as e:
            st.error(str(e))

    with st.sidebar:
        st.header("Upload PDFs")

        files = st.file_uploader(
            "Upload files",
            type="pdf",
            accept_multiple_files=True
        )

        if st.button("Process"):
            if not files:
                st.warning("Upload at least one PDF")
                return

            with st.spinner("Processing..."):
                try:
                    text = extract_text(files)
                    if not text or text.strip() == "":
                        st.error("No text could be extracted from the PDFs. Try different files.")
                        return
                    
                    chunks = split_text(text)
                    create_vector_store(chunks)
                    st.success("Documents processed")
                except Exception as e:
                    st.error(f"Error processing documents: {str(e)}")


if __name__ == "__main__":
    main()