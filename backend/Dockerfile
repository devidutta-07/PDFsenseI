# Base image
FROM python:3.10-slim

# Install system dependencies (VERY IMPORTANT)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    gcc \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 10000

# Run app
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:10000"]