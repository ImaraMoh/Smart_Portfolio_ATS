"""
Loads the embedding model once (module-level singleton) and exposes a
helper to embed text into a dense vector. Kept isolated from app.py so the
model warms up exactly once per process, not per-request.

Model resolution order:
  1. A fine-tuned model at ml-service/models/ats-semantic-v1 (produced by
     training/train_model.py on the resume-ats-score-v1-en dataset), if it
     exists on disk.
  2. The stock MODEL_NAME env var / default (all-MiniLM-L6-v2) otherwise.

This means the service works out of the box with the general-purpose model,
and automatically upgrades to the fine-tuned one the moment you run the
training script -- no code or config changes needed, just a restart.
"""
import os
import logging

logger = logging.getLogger(__name__)

DEFAULT_MODEL_NAME = os.environ.get("MODEL_NAME", "all-MiniLM-L6-v2")
FINE_TUNED_MODEL_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "ats-semantic-v1"
)

_model = None
_active_model_name = None


def get_model():
    global _model, _active_model_name
    if _model is None:
        if os.path.isdir(FINE_TUNED_MODEL_DIR) and os.listdir(FINE_TUNED_MODEL_DIR):
            logger.info(f"Loading fine-tuned ATS model from: {FINE_TUNED_MODEL_DIR}")
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer(FINE_TUNED_MODEL_DIR)
            _active_model_name = "ats-semantic-v1 (fine-tuned)"
        else:
            logger.info(
                f"No fine-tuned model found at {FINE_TUNED_MODEL_DIR}. "
                f"Loading base model: {DEFAULT_MODEL_NAME} "
                f"(run training/train_model.py to fine-tune on real resume/job data)"
            )
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer(DEFAULT_MODEL_NAME)
            _active_model_name = DEFAULT_MODEL_NAME
    return _model


def get_active_model_name():
    # Ensures the model is loaded so this always reflects the truth
    get_model()
    return _active_model_name


def embed(texts):
    """texts: str or list[str] -> numpy array of embeddings"""
    model = get_model()
    return model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
