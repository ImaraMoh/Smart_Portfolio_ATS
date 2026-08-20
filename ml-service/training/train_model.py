"""
Fine-tunes a Sentence Transformer on the resume-ats-score-v1-en dataset
(https://huggingface.co/datasets/0xnbk/resume-ats-score-v1-en) so the ATS
scoring service uses a model actually trained on resume/job-description
pairs, instead of relying on a general-purpose embedding model.

Base model:   sentence-transformers/all-MiniLM-L6-v2  (same one app.py uses
              by default, so this is a drop-in upgrade -- same vector size,
              same speed, just fine-tuned for this specific task)
Loss:         CosineSimilarityLoss, trained to regress the normalized (0-1)
              ATS score between a resume and a job description.
Dataset:      6,374 resume/job pairs with continuous ATS scores (18.3-90.7)
              and a No Fit / Potential Fit / Good Fit label, split 80/20
              train/validation.

Usage:
    cd ml-service
    source venv/bin/activate          # Windows: venv/Scripts/Activate.ps1
    pip install -r requirements.txt
    pip install -r training/requirements-train.txt
    python training/train_model.py

Output:
    ml-service/models/ats-semantic-v1/   <- the fine-tuned model directory

app.py automatically looks for this directory first (see utils/embedding.py)
and falls back to the stock all-MiniLM-L6-v2 model if it doesn't exist, so
training is optional -- the service works out of the box either way, this
just makes scoring meaningfully more accurate.
"""
import os
import logging
import math

from datasets import load_dataset
from sentence_transformers import SentenceTransformer, losses, InputExample
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator
from torch.utils.data import DataLoader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("train-ats-model")

BASE_MODEL = os.environ.get("BASE_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
DATASET_NAME = "0xnbk/resume-ats-score-v1-en"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "models", "ats-semantic-v1")

EPOCHS = int(os.environ.get("EPOCHS", 4))
BATCH_SIZE = int(os.environ.get("BATCH_SIZE", 16))
LEARNING_RATE = float(os.environ.get("LEARNING_RATE", 2e-5))
WARMUP_STEPS = int(os.environ.get("WARMUP_STEPS", 100))


def split_resume_job(text: str):
    """
    Rows store the pair as 'resume [SEP] job_description'. Splits on the
    literal separator with a couple of fallback delimiters in case of
    formatting variance across dataset versions.
    """
    for sep in [" [SEP] ", " SEP ", "[SEP]"]:
        if sep in text:
            parts = text.split(sep, 1)
            if len(parts) == 2:
                return parts[0].strip(), parts[1].strip()
    # Fallback: split the text roughly in half (shouldn't normally trigger)
    midpoint = len(text) // 2
    return text[:midpoint].strip(), text[midpoint:].strip()


def build_examples(split_df):
    examples = []
    for _, row in split_df.iterrows():
        resume, job = split_resume_job(row["text"])
        if not resume or not job:
            continue
        normalized_score = max(0.0, min(1.0, row["ats_score"] / 100.0))
        examples.append(InputExample(texts=[resume, job], label=normalized_score))
    return examples


def main():
    logger.info(f"Loading dataset: {DATASET_NAME}")
    dataset = load_dataset(DATASET_NAME)

    import pandas as pd
    train_df = pd.DataFrame(dataset["train"])
    val_df = pd.DataFrame(dataset["validation"])
    logger.info(f"Train examples: {len(train_df)} | Validation examples: {len(val_df)}")

    train_examples = build_examples(train_df)
    val_examples = build_examples(val_df)

    logger.info(f"Loading base model: {BASE_MODEL}")
    model = SentenceTransformer(BASE_MODEL)

    train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=BATCH_SIZE)
    train_loss = losses.CosineSimilarityLoss(model=model)

    val_sentences1 = [ex.texts[0] for ex in val_examples]
    val_sentences2 = [ex.texts[1] for ex in val_examples]
    val_scores = [ex.label for ex in val_examples]
    evaluator = EmbeddingSimilarityEvaluator(
        val_sentences1, val_sentences2, val_scores, name="ats-validation"
    )

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    warmup_steps = math.ceil(len(train_dataloader) * EPOCHS * 0.1) if WARMUP_STEPS == 100 else WARMUP_STEPS
    logger.info(
        f"Training: epochs={EPOCHS} batch_size={BATCH_SIZE} lr={LEARNING_RATE} "
        f"warmup_steps={warmup_steps} steps_per_epoch={len(train_dataloader)}"
    )

    model.fit(
        train_objectives=[(train_dataloader, train_loss)],
        evaluator=evaluator,
        epochs=EPOCHS,
        warmup_steps=warmup_steps,
        optimizer_params={"lr": LEARNING_RATE},
        output_path=OUTPUT_DIR,
        evaluation_steps=len(train_dataloader),  # evaluate once per epoch
        save_best_model=True,
        show_progress_bar=True,
    )

    logger.info(f"Training complete. Model saved to: {OUTPUT_DIR}")
    logger.info("Restart app.py (or the ml-service container) to pick up the fine-tuned model.")


if __name__ == "__main__":
    main()
