# REBEL

A new AI security assistant project scaffold with a Next.js frontend and FastAPI backend.

## Project structure

- `frontend/` - Next.js app with a component, pages, hooks, services, and context folders
- `backend/` - FastAPI backend with modular app structure
- `ai_models/` - model directories for cybersecurity AI solutions
- `datasets/` - dataset storage
- `docker/` - Docker assets and compose support
- `kubernetes/` - deployment manifests
- `docs/` - documentation
- `tests/` - automated tests

## Getting started

1. Install frontend dependencies:
   ```bash
   cd REBEL/frontend
   npm install
   ```
2. Install backend dependencies:
   ```bash
   cd REBEL/backend
   python -m pip install -r requirements.txt
   ```
3. Run backend:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
