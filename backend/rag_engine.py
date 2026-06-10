from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.llms import Ollama

embedding = SentenceTransformerEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

llm = Ollama(model="llama3")

CHROMA_PATH = "backend/data/chroma_db"

def create_vector_store(text):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    docs = splitter.create_documents([text])

    db = Chroma.from_documents(
        docs,
        embedding,
        persist_directory=CHROMA_PATH
    )

    db.persist()

    return db


def ask_question(question):

    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding
    )

    docs = db.similarity_search(question, k=3)

    context = "\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
    Answer the question using the context below.

    Context:
    {context}

    Question:
    {question}
    """

    response = llm.invoke(prompt)

    return response