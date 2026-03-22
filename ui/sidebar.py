import streamlit as st

from core.pdf_loader import extract_text
from core.text_splitter import split_text
from core.vector_store import create_vector_store


def sidebar():

    st.sidebar.header("Upload PDFs")

    files = st.sidebar.file_uploader(
        "Upload files",
        type="pdf",
        accept_multiple_files=True
    )

    if st.sidebar.button("Process"):

        if not files:
            st.sidebar.warning("Upload at least one PDF")
            return

        with st.spinner("Processing..."):

            text = extract_text(files)

            if not text.strip():
                st.error("No text extracted")
                return

            chunks = split_text(text)

            create_vector_store(chunks)

            st.sidebar.success("Documents processed")