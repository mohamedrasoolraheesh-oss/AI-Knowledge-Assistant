from langchain_community.llms import Ollama

llm = Ollama(model="llama3")

class Summarizer:
    def summarize(self, text: str, max_length: int = 150) -> str:
        return summarize_text(text)

def summarize_text(text):
    prompt = f'''
    Summarize the following text into short notes:

    {text}
    '''

    response = llm.invoke(prompt)

    return response
