from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EvaluationBase(BaseModel):
    studentId: str
    companyId: str
    internshipId: str
    score: int
    comments: Optional[str] = None


class EvaluationCreate(EvaluationBase):
    pass


class EvaluationResponse(EvaluationBase):
    id: int
    createdAt: datetime

    class Config:
        from_attributes = True