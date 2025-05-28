FROM python:3.11-slim

RUN pip install poetry

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi --no-root

# Copy the rest of your application code
COPY . .

# Expose the port your Flask app runs on
EXPOSE 5000

ENV FLASK_APP=src
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]