FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY aiService/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY aiService/ .

EXPOSE 5000
ENV FLASK_APP=__init__.py
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]