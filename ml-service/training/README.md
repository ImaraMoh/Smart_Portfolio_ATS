# Fine-tuning the ATS scoring model

By default, the ML service uses a general-purpose sentence embedding model
(`all-MiniLM-L6-v2`) that was never specifically trained to understand
resume-vs-job-description matching. This directory fine-tunes it on a
purpose-built dataset so scores are calibrated against real resume/job pairs
instead of general text similarity.

## Dataset

**[0xnbk/resume-ats-score-v1-en](https://huggingface.co/datasets/0xnbk/resume-ats-score-v1-en)**
(Hugging Face, Apache 2.0 license)

- 6,374 resume/job-description pairs (5,099 train / 1,275 validation)
- Each pair has a continuous ATS score (18.3–90.7) and a fit label (`No Fit`
  / `Potential Fit` / `Good Fit`)
- Derived from the [cnamuangtoun/resume-job-description-fit](https://huggingface.co/datasets/cnamuangtoun/resume-job-description-fit)
  dataset

You don't need to download anything manually — `train_model.py` pulls it
automatically via the `datasets` library on first run (downloads to your
local HF cache, ~51MB).

## Setup

From the `ml-service` folder, with your virtual environment already active
(same one you used to run `app.py`):

```bash
pip install -r training/requirements-train.txt
```

This adds `datasets`, `pandas`, and `torch` on top of what `app.py` already
needs — kept in a separate file so the production API image doesn't have to
carry training-only dependencies.

## Run training

```bash
python training/train_model.py
```

What happens:
1. Downloads the dataset (first run only)
2. Loads `all-MiniLM-L6-v2` as the base model
3. Fine-tunes it with `CosineSimilarityLoss`, regressing each pair's
   normalized (0–1) ATS score
4. Evaluates on the validation split once per epoch
5. Saves the best-performing checkpoint to `ml-service/models/ats-semantic-v1/`

**Expect this to take a while on CPU** — likely 30–90+ minutes depending on
your machine, since it's ~5,100 training pairs over 4 epochs. If you have an
NVIDIA GPU with CUDA set up, PyTorch will use it automatically and this drops
to well under 10 minutes. To shorten a CPU run for testing purposes, you can
override the defaults:

```bash
# fewer epochs / smaller batches, faster but lower quality
EPOCHS=2 BATCH_SIZE=8 python training/train_model.py
```

## Using the fine-tuned model

Nothing else to configure. `utils/embedding.py` checks for
`ml-service/models/ats-semantic-v1/` on startup and automatically loads it
instead of the stock model if it exists. Just restart `app.py` (or the
Docker container) after training finishes.

You can confirm which model is active by hitting the health endpoint:

```bash
curl http://localhost:8001/api/health
```

```json
{
  "success": true,
  "message": "ATS ML microservice is healthy",
  "active_model": "ats-semantic-v1 (fine-tuned)"
}
```

If it still says `all-MiniLM-L6-v2`, training either hasn't been run yet or
didn't complete — check that `ml-service/models/ats-semantic-v1/` contains
files (it should have `config.json`, `model.safetensors` or `pytorch_model.bin`,
and a few tokenizer files).

## Expected quality

Per the dataset's published benchmarks, fine-tuning `all-MiniLM-L6-v2` on this
data typically achieves:

| Metric | Expected value |
|---|---|
| RMSE | < 8.0 |
| R² | > 0.85 |
| MAE | < 6.0 |
| Pearson correlation | > 0.9 |

## Reverting to the stock model

Delete (or rename) the `ml-service/models/ats-semantic-v1/` folder and
restart the service — it'll fall back to `all-MiniLM-L6-v2` automatically.
