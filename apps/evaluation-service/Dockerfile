FROM python:3.12-slim
WORKDIR /app
COPY apps/evaluation-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/evaluation-service/ .
EXPOSE 3009
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3009"]