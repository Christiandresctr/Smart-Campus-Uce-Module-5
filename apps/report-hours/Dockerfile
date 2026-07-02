FROM python:3.12-slim
WORKDIR /app
COPY apps/report-hours/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/report-hours/ .
RUN mkdir -p /certificates
EXPOSE 3004
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3004"]