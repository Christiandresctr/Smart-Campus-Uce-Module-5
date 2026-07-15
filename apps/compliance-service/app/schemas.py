from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ComplianceBase(BaseModel):
    studentId: str
    type: str
    status: str = "pending"
    notes: Optional[str] = None


class ComplianceCreate(ComplianceBase):
    pass


class ComplianceUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class ComplianceResponse(ComplianceBase):
    id: str
    createdAt: datetime

    class Config:
        from_attributes = True