"""
Smart Portfolio & ATS - ML Scoring Microservice
------------------------------------------------
A small Flask API that the Node.js backend calls to compute a semantic
ATS-compatibility score between a user's resume text and a job description,
using Sentence Transformer embeddings + cosine similarity, plus a keyword
gap analysis for human-readable suggestions.

Run directly for development:
    python app.py

Run in production behind gunicorn (see Dockerfile):
    gunicorn -w 2 -b 0.0.0.0:8001 app:app
"""
import os
import logging
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from utils.scoring import compute_ats_score  # noqa: E402
from utils.embedding import get_model  # noqa: E402

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ats-service")

app = Flask(__name__)
CORS(app)

MAX_TEXT_LENGTH = 20000


@app.route("/api/health", methods=["GET"])
def health():
    from utils.embedding import get_active_model_name
    return jsonify({
        "success": True,
        "message": "ATS ML microservice is healthy",
        "active_model": get_active_model_name()
    })


@app.route("/api/score", methods=["POST"])
def score():
    """
    Request body:
      { "resume_text": "...", "job_description": "..." }

    Response body:
      {
        "score": 0-100,
        "raw_cosine_similarity": float,
        "matched_keywords": [...],
        "missing_keywords": [...],
        "suggestions": [...]
      }
    """
    payload = request.get_json(silent=True) or {}
    resume_text = (payload.get("resume_text") or "").strip()
    job_description = (payload.get("job_description") or "").strip()

    if not resume_text or not job_description:
        return jsonify({
            "success": False,
            "message": "Both 'resume_text' and 'job_description' are required"
        }), 400

    if len(resume_text) > MAX_TEXT_LENGTH or len(job_description) > MAX_TEXT_LENGTH:
        return jsonify({
            "success": False,
            "message": f"Text exceeds maximum length of {MAX_TEXT_LENGTH} characters"
        }), 413

    try:
        result = compute_ats_score(resume_text, job_description)
        return jsonify({"success": True, **result})
    except Exception as exc:  # pragma: no cover
        logger.error("Scoring failed: %s\n%s", exc, traceback.format_exc())
        return jsonify({
            "success": False,
            "message": "Failed to compute ATS score. Please try again."
        }), 500


@app.errorhandler(404)
def not_found(_e):
    return jsonify({"success": False, "message": "Route not found"}), 404


if __name__ == "__main__":
    # Warm the model on boot in dev mode too, so the first real request isn't slow.
    logger.info("Warming up Sentence Transformer model...")
    get_model()
    port = int(os.environ.get("PORT", 8001))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_ENV") == "development")
