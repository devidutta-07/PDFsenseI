# Base image
FROM python:3.10-slim

# Install ALL required system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy project
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 10000

# Start app
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:10000"]