from flask import Blueprint, request, jsonify

from services.rag_pipeline import ask_question

qa_bp = Blueprint("qa", __name__)


@qa_bp.route("/ask", methods=["POST"])
def ask():

    data = request.json

    chat_id = data["chat_id"]
    question = data["question"]

    answer, sources = ask_question(chat_id, question)

    return jsonify({
        "status": "ok",
        "answer": answer,
        "sources": sources
    })
