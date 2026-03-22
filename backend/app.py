from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from routes.chat_routes import chat_bp
from routes.document_routes import doc_bp
from routes.qa_routes import qa_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp)
app.register_blueprint(doc_bp)
app.register_blueprint(qa_bp)


@app.route("/health")
def health():
    return {"status": "ok", "service": "PDFSensei"}


if __name__ == "__main__":
    app.run(debug=True)
