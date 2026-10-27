from functools import lru_cache

from fastapi import FastAPI
from pydantic import BaseModel, Field, field_validator
from sentence_transformers import SentenceTransformer

from matching import cosine_similarity


MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
app = FastAPI(title='InternConnect AI Service')


class MatchRequest(BaseModel):
    student_skills: list[str] = Field(min_length=1)
    required_skills: list[str] = Field(min_length=1)

    @field_validator('student_skills', 'required_skills')
    @classmethod
    def trim_and_check_skills(cls, skills: list[str]) -> list[str]:
        cleaned = [skill.strip() for skill in skills if skill.strip()]
        if not cleaned:
            raise ValueError('Provide at least one non-empty skill.')
        return cleaned


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    return SentenceTransformer(MODEL_NAME)


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.post('/api/match/score')
def score_match(request: MatchRequest) -> dict[str, float | str]:
    student_text = '; '.join(request.student_skills)
    job_text = '; '.join(request.required_skills)
    vectors = get_model().encode(
        [student_text, job_text],
        normalize_embeddings=True,
        convert_to_numpy=True,
    )
    score = cosine_similarity(vectors[0], vectors[1])
    return {'model': MODEL_NAME, 'similarity': round(score, 6)}
