"""
Core ATS scoring logic:
1. Embed resume text and job description (using the fine-tuned ATS model if
   training/train_model.py has been run, otherwise the stock model).
2. Compute cosine similarity between the two embeddings -> base score.
3. Extract keyword sets from both texts to report matched/missing keywords
   and generate specific, actionable optimization suggestions.
"""
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from .embedding import embed, get_active_model_name
from .preprocessing import clean_text, extract_keywords


def compute_ats_score(resume_text: str, job_description: str):
    resume_text = clean_text(resume_text)
    job_description = clean_text(job_description)

    embeddings = embed([resume_text, job_description])
    resume_vec = embeddings[0].reshape(1, -1)
    jd_vec = embeddings[1].reshape(1, -1)

    similarity = float(cosine_similarity(resume_vec, jd_vec)[0][0])
    score = _rescale_similarity(similarity)

    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(job_description)

    matched = sorted(resume_keywords & jd_keywords)
    missing = sorted(jd_keywords - resume_keywords)

    # Rank missing keywords by frequency in the JD so the most important gaps
    # surface first, and cap the list to keep suggestions actionable.
    jd_tokens = job_description.lower().split()
    missing_ranked = sorted(
        missing,
        key=lambda kw: -sum(1 for t in jd_tokens if kw in t)
    )[:15]

    suggestions = _build_suggestions(score, missing_ranked, matched)

    return {
        "score": round(score, 1),
        "raw_cosine_similarity": round(similarity, 4),
        "model_used": get_active_model_name(),
        "matched_keywords": matched[:30],
        "missing_keywords": missing_ranked,
        "suggestions": suggestions
    }


def _rescale_similarity(sim: float) -> float:
    """
    Maps cosine similarity to a 0-100 ATS score.

    The fine-tuned model (training/train_model.py) is trained via
    CosineSimilarityLoss to directly regress the normalized 0-1 ATS score,
    so its cosine similarity IS the score -- just multiply by 100.

    The stock general-purpose model was never trained for this and its
    cosine similarities cluster in a much narrower, higher band (~0.15-0.85
    for basically any two related texts), so we rescale that range onto
    0-100 to keep scores meaningfully spread out.
    """
    if "fine-tuned" in (get_active_model_name() or ""):
        return float(np.clip(sim * 100, 0, 100))

    lo, hi = 0.15, 0.85
    pct = (sim - lo) / (hi - lo) * 100
    return float(np.clip(pct, 0, 100))


def _build_suggestions(score, missing_keywords, matched_keywords):
    suggestions = []

    if missing_keywords:
        top = ", ".join(missing_keywords[:8])
        suggestions.append(
            f"Add these job-description terms where genuinely applicable: {top}."
        )

    if score < 40:
        suggestions.append(
            "Overall semantic overlap with this job description is low -- consider "
            "rewriting your summary and experience bullets to mirror the role's core "
            "responsibilities more closely, not just the title."
        )
    elif score < 70:
        suggestions.append(
            "You're a partial match. Strengthen bullet points for your most relevant "
            "experience and projects with outcomes and tools mentioned in the posting."
        )
    else:
        suggestions.append(
            "Strong semantic match. Focus remaining edits on quantifying achievements "
            "(numbers, percentages, scale) rather than adding more keywords."
        )

    if len(matched_keywords) < 5:
        suggestions.append(
            "Very few overlapping terms were found -- double check your resume actually "
            "covers the core skills this job asks for, not only adjacent ones."
        )

    suggestions.append(
        "Avoid keyword stuffing: only add terms that accurately reflect your real experience."
    )

    return suggestions
