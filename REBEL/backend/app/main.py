from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AI Knowledge Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message": "Backend Running"}

@app.post("/ask")
def ask(data: Question):

    q = data.question.strip().lower()

    if "rag" in q:
        answer = "RAG improves accuracy by retrieving relevant information before generating answers."

    elif "semantic" in q:
        answer = "Semantic search understands the meaning of text rather than matching keywords."

    elif "embedding" in q:
        answer = "Embeddings are numerical vector representations of text used for similarity search."

    else:
        answer = f"AI response for: {data.question}"

    return {"answer": answer}