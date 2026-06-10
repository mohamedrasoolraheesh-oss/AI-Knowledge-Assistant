from pdf_reader import extract_text_from_pdf
from rag_engine import create_vector_store, ask_question
from summarizer import summarize_text
from quiz_generator import generate_quiz

pdf_path = "data/documents/sample.pdf"

text = extract_text_from_pdf(pdf_path)

create_vector_store(text)

print("PDF processed successfully!")

while True:

    print("\n1. Ask Question")
    print("2. Summarize")
    print("3. Generate Quiz")
    print("4. Exit")

    choice = input("Enter choice: ")

    if choice == "1":

        question = input("Ask your question: ")

        answer = ask_question(question)

        print("\nAnswer:")
        print(answer)

    elif choice == "2":

        summary = summarize_text(text)

        print("\nSummary:")
        print(summary)

    elif choice == "3":

        quiz = generate_quiz(text)

        print("\nQuiz:")
        print(quiz)

    elif choice == "4":
        break
