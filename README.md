# AI Knowledge Assistant

A simple project scaffold for an AI-powered document assistant using a backend and Streamlit frontend.

## Structure

- `backend/` - Flask API, RAG engine, PDF reader, quiz generator, summarizer
- `frontend/` - Streamlit app for user interaction
- `data/` - Documents and Chroma DB storage
- `models/` - Model artifacts or saved weights

## Setup

1. Create a virtual environment
2. Install dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Run the backend:

```bash
python backend/app.py
```

4. Run the frontend:

```bash
streamlit run frontend/streamlit_app.py
```
