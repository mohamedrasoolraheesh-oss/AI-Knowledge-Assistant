import streamlit as st
import os
import sys

sys.path.append("backend")

from pdf_reader import extract_text_from_pdf
from rag_engine import create_vector_store, ask_question
from summarizer import summarize_text
from quiz_generator import generate_quiz

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="AI Knowledge Assistant",
    page_icon="🤖",
    layout="wide"
)

# ---------------- CUSTOM CSS ----------------
st.markdown("""
<style>

.main {
    background: linear-gradient(
        135deg,
        #0f172a 0%,
        #111827 50%,
        #020617 100%
    );
}

.block-container {
    padding-top: 2rem;
}

.hero {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 25px;
    padding: 30px;
    margin-bottom: 25px;
}

.big-title {
    font-size: 3rem;
    font-weight: 800;
    color: white;
}

.subtitle {
    color: #94a3b8;
    font-size: 1.1rem;
}

.metric-card {
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
}

.answer-box {
    background: rgba(59,130,246,0.12);
    padding: 20px;
    border-radius: 15px;
    border-left: 5px solid #3b82f6;
}

.stButton > button {
    width: 100%;
    border-radius: 12px;
    height: 3em;
    background: linear-gradient(
        90deg,
        #2563eb,
        #06b6d4
    );
    color: white;
    border: none;
    font-weight: bold;
}

.stTextInput input {
    border-radius: 12px;
}

</style>
""", unsafe_allow_html=True)

# ---------------- HERO SECTION ----------------
st.markdown("""
<div class="hero">
<div class="big-title">
🤖 AI Knowledge Assistant
</div>

<div class="subtitle">
Upload PDFs • Ask Questions • Generate Summaries • Create Quizzes
</div>
</div>
""", unsafe_allow_html=True)

# ---------------- METRICS ----------------
c1, c2, c3 = st.columns(3)

with c1:
    st.markdown("""
    <div class="metric-card">
    <h2>📚</h2>
    <h3>Knowledge Base</h3>
    </div>
    """, unsafe_allow_html=True)

with c2:
    st.markdown("""
    <div class="metric-card">
    <h2>⚡</h2>
    <h3>AI Powered</h3>
    </div>
    """, unsafe_allow_html=True)

with c3:
    st.markdown("""
    <div class="metric-card">
    <h2>🧠</h2>
    <h3>Smart Learning</h3>
    </div>
    """, unsafe_allow_html=True)

st.divider()

# ---------------- PDF UPLOAD ----------------
uploaded_file = st.file_uploader(
    "📄 Upload PDF Document",
    type=["pdf"]
)

if uploaded_file:

    os.makedirs("data/documents", exist_ok=True)

    file_path = f"data/documents/{uploaded_file.name}"

    with open(file_path, "wb") as f:
        f.write(uploaded_file.read())

    with st.spinner("Processing PDF..."):
        text = extract_text_from_pdf(file_path)
        create_vector_store(text)

    st.success("✅ PDF Uploaded Successfully")

    option = st.radio(
        "Choose Feature",
        [
            "💬 Ask Questions",
            "📝 Summarize",
            "🎯 Generate Quiz"
        ],
        horizontal=True
    )

    # ---------------- Q&A ----------------
    if option == "💬 Ask Questions":

        question = st.text_input(
            "Ask anything from your document"
        )

        if st.button("🚀 Get Answer"):

            with st.spinner("Thinking..."):

                answer = ask_question(question)

            st.markdown(
                f"""
                <div class="answer-box">
                {answer}
                </div>
                """,
                unsafe_allow_html=True
            )

    # ---------------- SUMMARY ----------------
    elif option == "📝 Summarize":

        if st.button("📋 Generate Summary"):

            with st.spinner("Creating summary..."):

                summary = summarize_text(text)

            st.markdown("### Summary")
            st.info(summary)

    # ---------------- QUIZ ----------------
    elif option == "🎯 Generate Quiz":

        if st.button("🧠 Generate Quiz"):

            with st.spinner("Generating quiz..."):

                quiz = generate_quiz(text)

            st.markdown("### Quiz")
            st.success(quiz)

# ---------------- FOOTER ----------------
st.markdown("---")
st.markdown(
    "<center>Built with ❤️ using Streamlit, RAG, LLMs and AI</center>",
    unsafe_allow_html=True
)