from flask import Blueprint, request, jsonify
import tempfile

from services.pdf_service import extract_text
from utils.text_splitter import split_text
from vectorstore.faiss_store import create_index

doc_bp = Blueprint("docs", __name__)


@doc_bp.route("/process", methods=["POST"])
def process():

    chat_id = request.form.get("chat_id")

    files = request.files.getlist("files")

    paths = []

    for f in files:
        tmp = tempfile.NamedTemporaryFile(delete=False)
        f.save(tmp.name)
        paths.append(tmp.name)

    text = extract_text(paths)

    chunks = split_text(text)

    create_index(chunks, chat_id)

    return jsonify({
        "status": "ok",
        "message": f"Indexed {len(paths)} document(s) into {len(chunks)} chunks.",
        "doc_count": len(paths),
        "chunk_count": len(chunks),
    })
