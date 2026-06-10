from langchain_community.llms import Ollama

llm = Ollama(model="llama3")

class QuizGenerator:
    def generate(self, text: str, num_questions: int = 5):
        return generate_quiz(text)

def generate_quiz(text):
    prompt = f'''
    Generate 5 multiple choice questions from this text.

    Text:
    {text}
    '''

    response = llm.invoke(prompt)

    return response
