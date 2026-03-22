import streamlit as st

from core.pdf_loader import extract_text
from core.text_splitter import split_text
from core.vector_store import create_vector_store

from services.chat_manager import (
    create_new_chat,
    get_current_chat,
    mark_processed
)


def sidebar():

    st.sidebar.title("Chats")

    if st.sidebar.button("➕ New Chat"):

        create_new_chat()

    chat_id = get_current_chat()

    if chat_id:

        st.sidebar.write(f"Active Chat: {chat_id[:8]}")

        files = st.sidebar.file_uploader(
            "Upload PDFs",
            type="pdf",
            accept_multiple_files=True
        )

        if st.sidebar.button("Process PDFs"):

            if not files:
                st.sidebar.warning("Upload PDFs first")
                return

            with st.spinner("Processing..."):

                text = extract_text(files)

                chunks = split_text(text)

                create_vector_store(chunks, chat_id)

                mark_processed()

                st.sidebar.success("Documents processed")