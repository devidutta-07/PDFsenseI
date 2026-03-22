import os
from langchain_community.vectorstores import FAISS
from core.embeddings import get_embeddings


BASE_INDEX_PATH = "data/indexes"


def create_vector_store(chunks, chat_id):

    if not chunks:
        raise ValueError("No chunks provided")

    embeddings = get_embeddings()

    vectorstore = FAISS.from_texts(chunks, embeddings)

    path = os.path.join(BASE_INDEX_PATH, chat_id)

    os.makedirs(path, exist_ok=True)

    vectorstore.save_local(path)


def load_vector_store(chat_id):

    embeddings = get_embeddings()

    path = os.path.join(BASE_INDEX_PATH, chat_id)

    vectorstore = FAISS.load_local(
        path,
        embeddings,
        allow_dangerous_deserialization=True
    )

    return vectorstore