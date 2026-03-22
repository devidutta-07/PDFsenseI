import streamlit as st
from dotenv import load_dotenv

from ui.sidebar import sidebar

from services.chat_manager import (
    init_session,
    get_history,
    add_message,
    get_current_chat,
    is_processed
)

from core.rag_chain import get_chain


load_dotenv()


def main():

    st.set_page_config(page_title="PDFsenseI", layout="wide")

    st.title("📄 PDFsenseI")

    init_session()

    sidebar()

    chat_id = get_current_chat()

    if not chat_id:
        st.info("Create a new chat from sidebar")
        return

    if not is_processed():
        st.warning("Upload and process PDFs first")
        return

    history = get_history()

    for msg in history:

        with st.chat_message(msg["role"]):
            st.write(msg["content"])

    question = st.chat_input("Ask about the document")

    if question:

        add_message("user", question)

        with st.chat_message("user"):
            st.write(question)

        chain = get_chain(chat_id)

        answer = chain.invoke(question)

        add_message("assistant", answer)

        with st.chat_message("assistant"):
            st.write(answer)


if __name__ == "__main__":
    main()