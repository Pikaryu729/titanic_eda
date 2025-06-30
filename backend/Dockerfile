<<<<<<< HEAD
# Use Python 3.12 slim as base image
=======
# Use Python 4.12 slim as base image
>>>>>>> 247f79a0553ffae80c419cd23045ebdde7024ded
FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Install uv package manager
<<<<<<< HEAD
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
=======
RUN pip install uv
>>>>>>> 247f79a0553ffae80c419cd23045ebdde7024ded

# Copy dependency files first (for better caching)
COPY pyproject.toml uv.lock ./

# Install Python dependencies using uv
RUN uv sync --frozen --no-dev

# Copy all application files
COPY . .

# Expose port 8000 for FastAPI
EXPOSE 8000

# Run the FastAPI application
<<<<<<< HEAD
CMD ["uv", "run", "fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
=======
CMD ["uv", "run", "fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
>>>>>>> 247f79a0553ffae80c419cd23045ebdde7024ded
