# Multi-stage build
FROM python:3.12-slim as python-builder

WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
RUN pip install uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .

# Final stage with Caddy
FROM caddy:2-alpine

# Install Python
RUN apk add --no-cache python3 py3-pip

# Copy Python app and dependencies from builder
COPY --from=python-builder /app /app
COPY --from=python-builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=python-builder /usr/local/bin/uv /usr/local/bin/uv

# Create Caddyfile for automatic HTTPS
RUN echo "api.ryushinwells.com {\n    reverse_proxy localhost:8000\n}" > /etc/caddy/Caddyfile

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cd /app && uv run uvicorn main:app --host 127.0.0.1 --port 8000 &' >> /start.sh && \
    echo 'caddy run --config /etc/caddy/Caddyfile --adapter caddyfile' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80 443

CMD ["/start.sh"]
