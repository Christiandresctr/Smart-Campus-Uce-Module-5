from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text
from datetime import datetime

from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(10), unique=True, nullable=False)  # cédula
    full_name = Column(String(200), nullable=False)
    email = Column(String(200))
    career = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    
class HourLog(Base):
    __tablename__ = "hour_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(10), nullable=False)
    hours = Column(Float, nullable=False)
    description = Column(Text)
    log_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(10), nullable=False)
    total_hours = Column(Float, nullable=False)
    status = Column(String(20), default="generated")
    pdf_path = Column(String(500))
    generated_at = Column(DateTime, default=datetime.utcnow)