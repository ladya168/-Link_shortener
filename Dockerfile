FROM cr.yandex/mirror/library/python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/
COPY --from=ghcr.io/astral-sh/uv:latest /uvx /bin/



ENV UV_SYSTEM_PYTHON=1

WORKDIR /app


COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache
#RUN uv pip install --no-cache -r pyproject.toml


COPY . .


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
