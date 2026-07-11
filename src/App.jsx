import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ── API ───────────────────────────────────────────────────────────────────────

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const SYSTEM_PROMPT = `You are an AI Knowledge Assistant — a helpful, precise document companion.

When documents are provided, you:
- Answer questions specifically from those documents
- Quote relevant passages when helpful
- Clearly note when something is NOT in the documents
- Summarize, compare, explain, and extract information on demand

Without documents, you act as a general-purpose AI assistant.

Be concise, accurate, and helpful. Format responses with markdown when it aids clarity.`;

async function callClaude(messages) {
  if (!GROQ_API_KEY) {
    throw new Error("No API key found. Set VITE_GROQ_API_KEY in your .env file.");
  }

  // Groq uses OpenAI-style chat format: messages need role + content as plain strings
  const groqMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role,
      content: Array.isArray(m.content)
        ? m.content.map((c) => c.text || "").join("\n")
        : m.content,
    })),
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      max_tokens: 1500,
      messages: groqMessages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

// ── File helpers ──────────────────────────────────────────────────────────────

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }
  return fullText.trim();
}

async function processFile(file) {
  const doc = { name: file.name, type: file.type, size: file.size, text: null, base64: null };
  if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".csv")) {
    doc.text = await new Promise((res) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target.result);
      r.readAsText(file);
    });
  } else if (file.type === "application/pdf") {
    try {
      doc.text = await extractPdfText(file);
      if (!doc.text) {
        doc.text = "[This PDF appears to have no extractable text — it may be a scanned image. Text-only models can't read scanned PDFs.]";
      }
    } catch (err) {
      doc.text = `[Could not extract text from this PDF: ${err.message}]`;
    }
  } else if (file.type.startsWith("image/")) {
    doc.base64 = await fileToBase64(file);
    doc.text = "[Image uploaded — this model reads text only, so image content isn't available.]";
  } else {
    doc.text = await new Promise((res) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target.result);
      r.onerror = () => res(null);
      r.readAsText(file);
    });
  }
  return doc;
}

function buildApiMessages(docs, history, userText) {
  const apiMessages = [];
  if (docs.length > 0) {
    const blocks = [];
    for (const doc of docs) {
      if (doc.text) {
        blocks.push({ type: "text", text: `--- Document: ${doc.name} ---\n${doc.text.slice(0, 50000)}\n---` });
      }
    }
    blocks.push({ type: "text", text: "Documents loaded. Please acknowledge." });
    apiMessages.push({ role: "user", content: blocks });
    apiMessages.push({ role: "assistant", content: `I've reviewed ${docs.length} document(s). Ready to help!` });
  }
  for (const m of history.slice(-20)) {
    apiMessages.push({ role: m.role, content: m.content });
  }
  apiMessages.push({ role: "user", content: userText });
  return apiMessages;
}

// ── Markdown renderer ─────────────────────────────────────────────────────────

function Markdown({ text }) {
  const html = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/\n/g, "<br>");
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: `<p class="md-p">${html}</p>` }} />;
}

// ── Views ─────────────────────────────────────────────────────────────────────

function SourcesView({ docs, onRemove }) {
  if (!docs.length) return (
    <div className="empty-panel">
      <div className="empty-icon">📂</div>
      <h3>No documents yet</h3>
      <p>Upload files from the Chat tab to get started.</p>
    </div>
  );
  return (
    <div className="panel-content">
      <h2 className="panel-title">Sources ({docs.length})</h2>
      {docs.map((d, i) => (
        <div key={i} className="doc-item">
          <span className="doc-icon">{d.type?.startsWith("image/") ? "🖼️" : d.type === "application/pdf" ? "📕" : "📄"}</span>
          <div className="doc-info">
            <div className="doc-name">{d.name}</div>
            <div className="doc-meta">{d.type || "unknown"} · {(d.size / 1024).toFixed(1)} KB{d.text ? ` · ${d.text.length.toLocaleString()} chars` : ""}</div>
          </div>
          <button className="doc-remove" onClick={() => onRemove(i)} title="Remove">✕</button>
        </div>
      ))}
    </div>
  );
}

function AnalyticsView({ docs, messages }) {
  const stats = [
    { icon: "📄", val: docs.length, label: "Documents Loaded" },
    { icon: "💬", val: messages.filter(m => m.role === "user").length, label: "Questions Asked" },
    { icon: "🤖", val: messages.filter(m => m.role === "assistant").length, label: "AI Responses" },
    { icon: "🔤", val: docs.reduce((s, d) => s + (d.text?.length || 0), 0).toLocaleString(), label: "Chars Indexed" },
  ];
  return (
    <div className="panel-content">
      <h2 className="panel-title">Analytics</h2>
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      {docs.length > 0 && (
        <>
          <h3 className="section-label">Loaded Documents</h3>
          {docs.map((d, i) => (
            <div key={i} className="doc-item">
              <span className="doc-icon">{d.type?.startsWith("image/") ? "🖼️" : d.type === "application/pdf" ? "📕" : "📄"}</span>
              <div className="doc-info">
                <div className="doc-name">{d.name}</div>
                <div className="doc-meta">{(d.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function SettingsView({ dark, setDark, docs, setDocs, setMessages }) {
  return (
    <div className="panel-content">
      <h2 className="panel-title">Settings</h2>

      <div className="settings-section">
        <div className="section-label">Appearance</div>
        <div className="setting-row">
          <span>Dark Mode</span>
          <button className={`toggle ${dark ? "on" : ""}`} onClick={() => setDark(!dark)}>
            <div className="toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <div className="section-label">API Configuration</div>
        <div className="setting-info">
          {GROQ_API_KEY
            ? <span className="api-ok">✅ API key loaded from environment</span>
            : <span className="api-warn">⚠️ Set VITE_GROQ_API_KEY in .env file</span>}
        </div>
      </div>

      <div className="settings-section">
        <div className="section-label">Data Management</div>
        <button className="danger-btn" onClick={() => { if (confirm("Clear all documents?")) setDocs([]); }}>
          🗑️ Clear All Documents ({docs.length})
        </button>
        <button className="danger-btn" onClick={() => { if (confirm("Clear chat history?")) setMessages([]); }}>
          💬 Clear Chat History
        </button>
      </div>

      <div className="settings-section">
        <div className="setting-info">
          <strong>AI Knowledge Assistant v1.0</strong><br />
          Powered by Groq (Llama 3.3 70B) · Supports PDF and text documents<br />
          Built with React + Vite · Deploy on Vercel
        </div>
      </div>
    </div>
  );
}

function ChatView({ docs, setDocs, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const handleFiles = useCallback(async (files) => {
    const processed = await Promise.all([...files].map(processFile));
    setDocs(prev => [...prev, ...processed]);
  }, [setDocs]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }

    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const apiMessages = buildApiMessages(docs, messages, text);
      const reply = await callClaude(apiMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply, id: Date.now() + 1 }]);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const CHIPS = ["Summarize this document", "What are the key points?", "Explain this simply", "Extract all dates and numbers"];

  return (
    <div className="chat-view">
      <div className="messages" id="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-big-icon">🧠</div>
            <h2>What would you like to know?</h2>
            <p>{docs.length > 0
              ? `${docs.length} document${docs.length > 1 ? "s" : ""} loaded. Ask me anything about them.`
              : "Upload a document below, or just ask me anything — I'm powered by Groq!"
            }</p>
            <div className="chips">
              {CHIPS.map(c => (
                <button key={c} className="chip" onClick={() => { setInput(c); textareaRef.current?.focus(); }}>{c}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="msg-avatar">{msg.role === "user" ? "👤" : "🤖"}</div>
              <div className="bubble">
                {msg.role === "assistant" ? <Markdown text={msg.content} /> : msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant">
            <div className="msg-avatar">🤖</div>
            <div className="bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        {error && <div className="error-msg">⚠️ {error}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div
          className={`drop-zone ${dragging ? "drag" : ""} ${docs.length ? "has-docs" : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        >
          {docs.length > 0
            ? `📎 ${docs.length} doc${docs.length > 1 ? "s" : ""} loaded · click or drop to add more`
            : "📂 Drop files here or click to upload  (PDF · text · markdown)"}
          <input
            ref={fileRef} type="file" multiple
            accept=".pdf,.txt,.md,.csv,.png,.jpg,.jpeg,.gif,.webp"
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: "none" }}
          />
        </div>
        <div className="input-row">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onInput={autoResize}
            placeholder={docs.length > 0 ? "Ask about your documents…" : "Ask me anything…"}
            rows={1}
          />
          <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "chat", icon: "💬", label: "Chat" },
  { id: "sources", icon: "📄", label: "Sources" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function App() {
  const [tab, setTab] = useState("chat");
  const [dark, setDark] = useState(false);
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">🧠</div>
          <div>
            <div className="logo-name">AI Knowledge</div>
            <div className="logo-sub">Assistant</div>
          </div>
        </div>
        <nav>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
              {t.id === "sources" && docs.length > 0 && <span className="badge">{docs.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="dark-toggle" onClick={() => setDark(!dark)}>
            {dark ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <div className="header-title">{TABS.find(t => t.id === tab)?.label}</div>
            {tab === "chat" && docs.length > 0 && (
              <div className="header-sub">{docs.length} document{docs.length > 1 ? "s" : ""} in context</div>
            )}
          </div>
          {tab === "chat" && messages.length > 0 && (
            <button className="new-chat-btn" onClick={() => setMessages([])}>+ New Chat</button>
          )}
        </header>

        <div className="content">
          {tab === "chat" && <ChatView docs={docs} setDocs={setDocs} messages={messages} setMessages={setMessages} />}
          {tab === "sources" && <SourcesView docs={docs} onRemove={(i) => setDocs(d => d.filter((_, idx) => idx !== i))} />}
          {tab === "analytics" && <AnalyticsView docs={docs} messages={messages} />}
          {tab === "settings" && <SettingsView dark={dark} setDark={setDark} docs={docs} setDocs={setDocs} setMessages={setMessages} />}
        </div>
      </main>
    </div>
  );
}