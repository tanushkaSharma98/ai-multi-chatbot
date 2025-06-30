# Dockerfile for FastAPI backend
FROM python:3.11-slim as base

WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy only necessary files
COPY ./main.py ./
COPY ./services ./services

# Expose port
EXPOSE 8000

# Run the app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 