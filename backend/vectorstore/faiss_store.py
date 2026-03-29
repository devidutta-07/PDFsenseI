import os

from langchain_community.vectorstores import FAISS
from vectorstore.embeddings import get_embeddings

BASE_PATH = "backend/data/embeddings"


def create_index(chunks, chat_id):

    embeddings = get_embeddings()

    vectorstore = FAISS.from_texts(chunks, embeddings)

    path = os.path.join(BASE_PATH, chat_id)

    vectorstore.save_local(path)


def load_index(chat_id):

    embeddings = get_embeddings()

    path = os.path.join(BASE_PATH, chat_id)

    return FAISS.load_local(
        path,
        embeddings,
        allow_dangerous_deserialization=True
    )
