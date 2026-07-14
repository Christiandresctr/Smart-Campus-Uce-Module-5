from sqlalchemy import Column, Integer, String, Text, DateTime, func
from .database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    studentId = Column(String, nullable=False, index=True)
    companyId = Column(String, nullable=False)
    internshipId = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    comments = Column(Text, nullable=True)
    createdAt = Column(DateTime, server_default=func.now())