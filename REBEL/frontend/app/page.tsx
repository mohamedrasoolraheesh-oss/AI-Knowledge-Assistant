export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r shadow-sm p-6">

        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl">
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

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition">
            📄 Sources
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition">
            📊 Analytics
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100 transition">
            ⚙️ Settings
          </button>

        </nav>

        <div className="mt-10">

          <h2 className="font-semibold mb-3">
            Upload Documents
          </h2>

          <div className="border-2 border-dashed border-violet-200 rounded-2xl p-8 text-center bg-violet-50">

            <div className="text-5xl mb-3">
              ☁️
            </div>

            <p className="text-gray-600">
              Drag & Drop PDF Files
            </p>

            <button className="mt-4 px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition">
              Browse Files
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white mb-8">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                🤖
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  Hello! I'm your AI Knowledge Assistant
                </h2>

                <p className="text-violet-100">
                  Ask anything about your uploaded documents.
                </p>
              </div>

            </div>

          </div>

          {/* USER MESSAGE */}
          <div className="flex justify-end mb-6">

            <div className="bg-violet-100 text-violet-700 px-5 py-3 rounded-2xl shadow-sm">
              What is Retrieval-Augmented Generation (RAG)?
            </div>

          </div>

          {/* AI RESPONSE */}
          <div className="bg-slate-50 border rounded-2xl p-6 shadow-sm">

            <h3 className="font-bold text-lg mb-3">
              Retrieval-Augmented Generation (RAG)
            </h3>

            <p className="text-gray-700 leading-8">
              RAG combines information retrieval with large language models
              to generate accurate, context-aware responses grounded in
              uploaded documents.
            </p>

          </div>

          {/* QUESTIONS */}
          <div className="mt-8">

            <h3 className="font-semibold mb-4">
              Suggested Questions
            </h3>

            <div className="flex gap-3 flex-wrap">

              <button className="bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-xl transition">
                Benefits of RAG?
              </button>

              <button className="bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-xl transition">
                Semantic Search?
              </button>

              <button className="bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-xl transition">
                Embeddings?
              </button>

            </div>

          </div>

          {/* INPUT */}
          <div className="mt-10 flex gap-3">

            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 rounded-2xl transition">
              Send
            </button>

          </div>

        </div>

      </main>

      {/* RIGHT PANEL */}
      <aside className="w-80 bg-white border-l shadow-sm p-6">

        <h2 className="font-bold text-lg mb-5">
          📂 Your Documents
        </h2>

        <div className="space-y-4">

          <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
            📄 AI_Notes.pdf
          </div>

          <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
            📄 MachineLearning.pdf
          </div>

          <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
            📄 RAG_Overview.pdf
          </div>

        </div>

        <h2 className="font-bold text-lg mt-10 mb-5">
          🕒 Chat History
        </h2>

        <div className="space-y-3">

          <div className="border rounded-xl p-4 hover:bg-slate-50 cursor-pointer">
            What is RAG?
          </div>

          <div className="border rounded-xl p-4 hover:bg-slate-50 cursor-pointer">
            Explain embeddings
          </div>

          <div className="border rounded-xl p-4 hover:bg-slate-50 cursor-pointer">
            Semantic search
          </div>

        </div>

      </aside>

    </div>
  );
}