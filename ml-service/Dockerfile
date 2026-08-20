FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the sentence-transformer model at build time so the first
# request in production doesn't pay the download cost.
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

COPY . .

EXPOSE 8001
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8001", "--timeout", "60", "app:app"]
