from flask import Flask, request, jsonify
from rag_engine import RAGEngine

app = Flask(__name__)
rag = RAGEngine()

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get('question', '')
    answer = rag.answer(question)
    return jsonify({'question': question, 'answer': answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
