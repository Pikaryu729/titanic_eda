# Use Python 3.12 slim as base image
FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
RUN pip install uv

# Copy dependency files first (for better caching)
COPY pyproject.toml uv.lock ./

# Install Python dependencies using uv
RUN uv sync --frozen --no-dev

# Copy all application files
COPY . .

# Create SSL directory and generate self-signed certificates
RUN mkdir -p /app/ssl && \
    openssl req -x509 -newkey rsa:4096 -keyout /app/ssl/key.pem -out /app/ssl/cert.pem -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=150.136.59.32"

# Expose ports 80 and 443
EXPOSE 80 443

# Run the FastAPI application with SSL
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "443", "--ssl-keyfile", "/app/ssl/key.pem", "--ssl-certfile", "/app/ssl/cert.pem"]
