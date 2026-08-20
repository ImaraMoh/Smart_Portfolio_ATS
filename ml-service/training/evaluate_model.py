"""
Quick sanity check after training: runs a handful of hand-picked resume/job
pairs (deliberately good, mediocre, and bad matches) through the active
model and prints the ATS score for each, so you can eyeball whether the
fine-tuned model is behaving sensibly before wiring it into the full app.

Usage:
    python training/evaluate_model.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from utils.scoring import compute_ats_score  # noqa: E402
from utils.embedding import get_active_model_name  # noqa: E402

CASES = [
    {
        "label": "Strong match (Python backend dev)",
        "resume": (
            "Software Engineer with 5 years of experience building backend "
            "services in Python and Django. Strong background in REST API "
            "design, PostgreSQL, Docker, and AWS. Led a team migrating a "
            "monolith to microservices."
        ),
        "job": (
            "We are hiring a Backend Software Engineer with strong Python "
            "experience, familiarity with Django or Flask, REST API design, "
            "relational databases, and containerized deployments on AWS."
        )
    },
    {
        "label": "Partial match (frontend dev applying to backend role)",
        "resume": (
            "Frontend Developer with 3 years building React applications, "
            "TypeScript, and Tailwind CSS. Some exposure to Node.js for "
            "small internal tools."
        ),
        "job": (
            "We are hiring a Backend Software Engineer with strong Python "
            "experience, familiarity with Django or Flask, REST API design, "
            "relational databases, and containerized deployments on AWS."
        )
    },
    {
        "label": "Poor match (nurse applying to software role)",
        "resume": (
            "Registered Nurse with 8 years of ICU patient care experience, "
            "certified in advanced cardiac life support, skilled in patient "
            "assessment and care coordination."
        ),
        "job": (
            "We are hiring a Backend Software Engineer with strong Python "
            "experience, familiarity with Django or Flask, REST API design, "
            "relational databases, and containerized deployments on AWS."
        )
    }
]


def main():
    print(f"Active model: {get_active_model_name()}\n")
    for case in CASES:
        result = compute_ats_score(case["resume"], case["job"])
        print(f"— {case['label']}")
        print(f"  Score: {result['score']}/100  (raw cosine similarity: {result['raw_cosine_similarity']})")
        print()


if __name__ == "__main__":
    main()
