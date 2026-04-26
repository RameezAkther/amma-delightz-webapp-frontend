import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about recipes" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to use the chatbot");
      return;
    }

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/chat",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error(err);
      toast.error("Chatbot failed to respond");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown -> HTML converter (small, dependency-free)
  const escapeHtml = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const markdownToHtml = (md) => {
    if (!md) return "";
    // Handle code fences first
    let out = md;

    // Escape HTML to avoid XSS
    out = escapeHtml(out);

    // Code blocks ```code```
    out = out.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre class="bg-gray-800 text-white p-3 rounded-md overflow-auto"><code>${code.replace(/</g, "&lt;")}</code></pre>`;
    });

    // Inline code `code`
    out = out.replace(/`([^`]+)`/g, (_, code) => `<code class="bg-gray-100 px-1 rounded">${code}</code>`);

    // Links [text](url)
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 underline">${text}</a>`);

    // Headings # .. ######
    out = out.replace(/^###### (.*$)/gim, '<h6 class="text-sm font-semibold">$1</h6>');
    out = out.replace(/^##### (.*$)/gim, '<h5 class="text-sm font-semibold">$1</h5>');
    out = out.replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold">$1</h4>');
    out = out.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold">$1</h3>');
    out = out.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold">$1</h2>');
    out = out.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold">$1</h1>');

    // Bold **text**
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Lists - item or * item
    // Convert lines to list blocks
    out = out.replace(/^(?:[-*] .+(?:\n|$))+/gm, (block) => {
      const items = block.trim().split(/\n+/).map((line) => line.replace(/^[-*]\s+/, ""));
      return `<ul class="pl-5 list-disc">${items.map((it) => `<li>${it}</li>`).join("")}</ul>`;
    });

    // Paragraphs: double newlines -> paragraphs
    out = out.replace(/\n{2,}/g, "</p><p>");
    // Single newline -> <br>
    out = out.replace(/\n/g, "<br>");

    // Wrap in paragraph if not already
    if (!out.startsWith("<h") && !out.startsWith("<pre") && !out.startsWith("<ul") && !out.startsWith("<p>")) {
      out = `<p>${out}</p>`;
    }

    return out;
  };

  // Remove common emoji characters from a string (best-effort)
  const stripEmojis = (s) => {
    if (!s) return s;
    return s.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uFE00-\uFE0F])/g, "");
  };
  return (
    <>
      {/* Closed round button */}
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center z-50 transition-transform transform hover:scale-105"
        >
        <img
        src="/chat_1.svg"
        alt="Chat"
        className="w-9 h-9"
        />

        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden z-50 transition-all duration-300">

          {/* HEADER */}
          <div className="bg-emerald-600 text-white py-2 px-3 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Amma Delightz Bot</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setOpen(false); }} aria-label="Close chat" className="text-white/90 hover:text-white text-sm px-2">✕</button>
            </div>
          </div>

          {/* CHAT BODY */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm max-h-72">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  m.sender === "user"
                    ? "ml-auto bg-emerald-600 text-white whitespace-pre-wrap"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.sender === "bot" ? (
                  <div dangerouslySetInnerHTML={{ __html: markdownToHtml(stripEmojis(m.text)) }} />
                ) : (
                  <div className="whitespace-pre-wrap">{stripEmojis(m.text)}</div>
                )}
              </div>
            ))}
            {loading && <p className="text-gray-400 text-xs">Bot is typing...</p>}
          </div>

          {/* INPUT */}
          <div className="flex border-t p-2 gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about recipes... (Enter to send)"
              className="flex-1 px-3 py-2 text-sm outline-none resize-none h-10"
            />
            <button
              onClick={sendMessage}
              className="px-4 bg-emerald-600 text-white rounded-md flex items-center justify-center"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
