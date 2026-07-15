FROM python:3.12-slim
WORKDIR /app
COPY apps/compliance-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/compliance-service/ .
EXPOSE 3010
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3010"]