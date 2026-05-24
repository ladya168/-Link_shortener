FROM python:3.14.4
FROM ghcr.io/astral-sh/uv:latest AS uv-image

COPY --from=uv-image /uv /usr/local/bin/uv
COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-install-project --no-dev --system

COPY . .

RUN uv pip install --system .

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "80:80"]