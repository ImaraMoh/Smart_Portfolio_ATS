"""
Text preprocessing utilities shared by the embedding and keyword-extraction
steps of the ATS scoring pipeline: lowercasing, tokenization, stop-word
removal, and basic cleanup of resume/job-description text.
"""
import re
import string

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize

    for pkg in ["punkt", "punkt_tab", "stopwords"]:
        try:
            nltk.data.find(f"tokenizers/{pkg}" if "punkt" in pkg else f"corpora/{pkg}")
        except LookupError:
            nltk.download(pkg, quiet=True)

    STOPWORDS = set(stopwords.words("english"))
    NLTK_AVAILABLE = True
except Exception:  # pragma: no cover - fallback if NLTK data can't be fetched
    NLTK_AVAILABLE = False
    STOPWORDS = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
        "this", "that", "these", "those", "it", "its", "as", "from", "into",
        "we", "you", "they", "he", "she", "will", "would", "can", "could",
        "should", "may", "might", "must", "shall", "our", "your", "their"
    }

# Generic resume/job-posting boilerplate that is not useful signal for a
# keyword-gap suggestion (kept separate from stopwords for clarity).
BOILERPLATE = {
    "experience", "years", "work", "working", "team", "role", "job",
    "company", "candidate", "responsibilities", "requirements", "ability",
    "strong", "excellent", "including", "etc", "using", "use", "used",
    "skills", "skill", "knowledge", "understanding", "familiarity"
}


def clean_text(text: str) -> str:
    """Normalize whitespace and strip control characters, preserving words."""
    text = text.replace("\r", " ").replace("\n", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def tokenize(text: str):
    text = text.lower()
    text = text.translate(str.maketrans("", "", string.punctuation.replace("-", "").replace("+", "").replace("#", "")))
    if NLTK_AVAILABLE:
        try:
            tokens = word_tokenize(text)
        except Exception:
            tokens = text.split()
    else:
        tokens = text.split()
    return tokens


def extract_keywords(text: str, min_len: int = 3):
    """
    Extracts a de-duplicated set of meaningful lowercase tokens/phrases from
    text, filtering stopwords, boilerplate, and very short tokens. This is
    intentionally simple (frequency + filtering) rather than full NLP parsing
    -- it powers the human-readable "matched/missing keywords" list shown to
    the user, while the actual score comes from dense semantic embeddings.
    """
    tokens = tokenize(text)
    keywords = set()
    for tok in tokens:
        if len(tok) < min_len:
            continue
        if tok in STOPWORDS or tok in BOILERPLATE:
            continue
        if tok.isdigit():
            continue
        keywords.add(tok)
    return keywords
