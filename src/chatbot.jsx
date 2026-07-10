import { useState } from "react";
// import aiIcon from "./assets/aiIcon.png";

const API_URL = "http://localhost:8000/api/chat";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // kirim
  async function kirimPesan() {
    const teks = input.trim();
    if (!teks || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: teks }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: teks }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Maaf, koneksi bermasalah." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // reset
  function newChat() {
    setMessages([]);
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-100 font-['poppins']">
      {/* tombol */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-red-600 text-white text-2xl shadow-lg hover:scale-110 transition-transform"
          aria-label="Buka chat"
        >
          💬
        </button>
      )}

      {/* panel */}
      {open && (
        <div className="fixed inset-x-3 bottom-3 top-16 md:static md:inset-auto md:w-80 md:h-11 bg-white rounded-2xl shadow-2xl border border-red-200 flex flex-col overflow-hidden">
          {/* header */}
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-bold">Twinkle</span>
            <div className="flex items-center gap-3 text-sm">
              <button onClick={newChat} className="hover:underline">New</button>
              <button onClick={() => setOpen(false)} aria-label="Tutup">✕</button>
            </div>
          </div>

          {/* isi */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-red-50/30">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-4">
                Tanya apa aja tentang Leo 👋
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] bg-red-600 text-white rounded-2xl px-3 py-2 text-sm"
                    : "mr-auto max-w-[80%] bg-white border border-gray-200 text-gray-800 rounded-2xl px-3 py-2 text-sm"
                }
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="mr-auto bg-white border border-gray-200 text-gray-400 rounded-2xl px-3 py-2 text-sm">
                Twinkle lagi mengetik...
              </div>
            )}
          </div>

          {/* input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && kirimPesan()}
              placeholder="Ketik pertanyaan…"
              className="flex-1 border border-gray-200 rounded-full px-3 py-2 text-sm outline-none focus:border-red-400"
            />
            <button
              onClick={kirimPesan}
              className="bg-red-600 text-white rounded-full px-4 text-sm font-semibold hover:bg-red-700"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
