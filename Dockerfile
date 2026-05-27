FROM python:3.14.4

COPY pyproject.toml uv.lock ./

ENV PATH="/app/.venv/bin:$PATH"

RUN pip install uv
RUN uv sync --frozen --no-install-project --no-dev

COPY . .

RUN uv pip install --system .

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]