# syntax=docker/dockerfile:1

FROM python:3.12-slim

# Python runtime settings
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# System dependencies required at runtime / build
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy only the backend app code
COPY backend/ /app

# Prepare folders used by Django
RUN mkdir -p /app/staticfiles /app/media /app/static

EXPOSE 8000

# Add entrypoint to wait for DB, migrate and run Gunicorn
COPY docker/backend/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
