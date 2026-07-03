from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class StudentCreate(BaseModel):
    student_id: str      # cédula
    full_name: str
    email: Optional[str] = None
    career: Optional[str] = None

class HourLogCreate(BaseModel):
    student_id: str
    hours: float
    description: Optional[str] = None
    log_date: date


class HourSummary(BaseModel):
    student_id: str
    full_name: str
    total_hours: float
    min_required: float = 320.0
    meets_requirement: bool
    hours_remaining: float

    class Config:
        from_attributes = True


class CertificateRequest(BaseModel):
    student_id: str


class CertificateResponse(BaseModel):
    student_id: str
    total_hours: float
    status: str
    pdf_url: Optional[str] = None
    generated_at: datetime

    class Config:
        from_attributes = True

