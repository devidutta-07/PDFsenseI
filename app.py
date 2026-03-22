import streamlit as st
from dotenv import load_dotenv

from core.rag_chain import get_chain
from ui.sidebar import sidebar


load_dotenv()


def main():

    st.set_page_config(
        page_title="PDFsenseI",
        layout="wide"
    )

    st.title("📄 PDFsenseI - Chat with PDFs")

    sidebar()

    question = st.text_input(
        "Ask something from the documents"
    )

    if question:

        try:
            chain = get_chain()

            response = chain.invoke(question)

            st.markdown("### Answer")

            st.write(response)

        except Exception:

            st.error(
                "Documents not processed yet. Upload PDFs first."
            )


if __name__ == "__main__":
    main()