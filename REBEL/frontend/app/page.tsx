"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      user: "What is Retrieval-Augmented Generation (RAG)?",
      ai: "RAG combines information retrieval with large language models to generate accurate, context-aware responses grounded in uploaded documents.",
    },
  ]);

  const askQuestion = () => {
    if (!question.trim()) return;

    setMessages([
      ...messages,
      {
        user: question,
        ai: `AI response for: ${question}`,
      },
    ]);

    setQuestion("");
  };

  const suggestedQuestion = (text: string) => {
    setQuestion(text);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r shadow-sm p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white">
            🧠
          </div>

          <div>
            <h1 className="font-bold text-lg">
              AI Knowledge Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Intelligent document companion
            </p>
          </div>
        </div>

        <nav className="space-y-3">
          <button className="w-full text-left p-3 rounded-xl bg-violet-100 text-violet-700 font-medium">
            💬 Chat
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100">
            📄 Sources
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100">
            📊 Analytics
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100">
            ⚙️ Settings
          </button>
        </nav>

        <div className="mt-10">
          <h2 className="font-semibold mb-3">
            Upload Documents
          </h2>

          <div className="border-2 border-dashed border-violet-200 rounded-2xl p-8 text-center bg-violet-50">
            <div className="text-5xl mb-3">☁️</div>

            <p className="text-gray-600 mb-3">
              Upload PDF
            </p>

            <input
              type="file"
              accept=".pdf"
              className="w-full"
            />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold">
              Hello! I'm your AI Knowledge Assistant
            </h2>

            <p className="text-violet-100">
              Ask anything about your uploaded documents.
            </p>
          </div>

          {messages.map((msg, index) => (
            <div key={index}>
              <div className="flex justify-end mb-4">
                <div className="bg-violet-100 px-5 py-3 rounded-2xl">
                  {msg.user}
                </div>
              </div>

              <div className="bg-slate-50 border rounded-2xl p-6 mb-6">
                {msg.ai}
              </div>
            </div>
          ))}

          <h3 className="font-semibold mb-4">
            Suggested Questions
          </h3>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() =>
                suggestedQuestion("Benefits of RAG?")
              }
              className="bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-xl"
            >
              Benefits of RAG?
            </button>

            <button
              onClick={() =>
                suggestedQuestion("Semantic Search?")
              }
              className="bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-xl"
            >
              Semantic Search?
            </button>

            <button
              onClick={() =>
                suggestedQuestion("Embeddings?")
              }
              className="bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-xl"
            >
              Embeddings?
            </button>
          </div>

          <div className="mt-10 flex gap-3">
            <input
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              type="text"
              placeholder="Ask a question..."
              className="flex-1 border rounded-2xl px-5 py-4"
            />

            <button
              onClick={askQuestion}
              className="bg-violet-600 text-white px-8 rounded-2xl"
            >
              Send
            </button>
          </div>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-80 bg-white border-l shadow-sm p-6">
        <h2 className="font-bold text-lg mb-5">
          Chat History
        </h2>

        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="border rounded-xl p-4"
            >
              {msg.user}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}