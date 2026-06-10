from fastapi import FastAPI

app = FastAPI(title="REBEL Backend")

@app.get("/")
def read_root():
    return {"message": "Welcome to REBEL backend"}
