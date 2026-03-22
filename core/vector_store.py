from langchain_community.vectorstores import FAISS
from core.embeddings import get_embeddings


def create_vector_store(chunks):

    if not chunks:
        raise ValueError("No text chunks provided.")

    embeddings = get_embeddings()

    vectorstore = FAISS.from_texts(chunks, embeddings)

    vectorstore.save_local("data/faiss_index")


def load_vector_store():

    embeddings = get_embeddings()

    vectorstore = FAISS.load_local(
        "data/faiss_index",
        embeddings,
        allow_dangerous_deserialization=True
    )

    return vectorstore