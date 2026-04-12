from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

from routes.chat_routes import chat_bp
from routes.document_routes import doc_bp
from routes.qa_routes import qa_bp

app.register_blueprint(chat_bp, url_prefix="/api/chat")
app.register_blueprint(doc_bp, url_prefix="/api/doc")
app.register_blueprint(qa_bp, url_prefix="/api/qa")


# Health check route (important for Render)
@app.route("/health", methods=["GET"])
def health():
    return {
        "status": "ok",
        "service": "PDFSensei"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  
    app.run(host="0.0.0.0", port=port)