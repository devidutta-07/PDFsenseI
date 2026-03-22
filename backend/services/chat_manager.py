import os
import uuid
import shutil

BASE_PATH = "backend/data/chats"


def create_chat():

    chat_id = str(uuid.uuid4())

    path = os.path.join(BASE_PATH, chat_id)

    os.makedirs(path, exist_ok=True)

    return chat_id


def delete_chat(chat_id):

    path = os.path.join(BASE_PATH, chat_id)

    if os.path.exists(path):
        shutil.rmtree(path)


def list_chats():

    if not os.path.exists(BASE_PATH):
        return []

    return os.listdir(BASE_PATH)
