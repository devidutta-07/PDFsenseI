from flask import Blueprint, jsonify
from backend.services.chat_manager import create_chat, delete_chat, list_chats

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat/create", methods=["POST"])
def create():

    chat_id = create_chat()

    return jsonify({"chat_id": chat_id})


@chat_bp.route("/chat/list")
def list_all():

    return jsonify({"chats": list_chats()})


@chat_bp.route("/chat/delete/<chat_id>", methods=["DELETE"])
def delete(chat_id):

    delete_chat(chat_id)

    return jsonify({"status": "deleted"})
