import streamlit as st
import uuid


def init_session():

    if "chats" not in st.session_state:
        st.session_state.chats = {}

    if "current_chat" not in st.session_state:
        st.session_state.current_chat = None


def create_new_chat():

    chat_id = str(uuid.uuid4())

    st.session_state.chats[chat_id] = {
        "history": [],
        "processed": False
    }

    st.session_state.current_chat = chat_id

    return chat_id


def get_current_chat():

    return st.session_state.current_chat


def add_message(role, content):

    chat_id = get_current_chat()

    st.session_state.chats[chat_id]["history"].append({
        "role": role,
        "content": content
    })


def get_history():

    chat_id = get_current_chat()

    return st.session_state.chats[chat_id]["history"]


def mark_processed():

    chat_id = get_current_chat()

    st.session_state.chats[chat_id]["processed"] = True


def is_processed():

    chat_id = get_current_chat()

    return st.session_state.chats[chat_id]["processed"]