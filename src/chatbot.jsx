import { useState, useEffect } from "react";
import senang from "./assets/senang-removebg-preview.png";
import sedih from "./assets/sedih-removebg-preview.png";
import ngiler from "./assets/ngiiler-removebg-preview.png";

const API_URL = "http://localhost:8000/api/chat";
const WAJAH = [senang, sedih, ngiler];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [face, setFace] = useState(0);
  const [pos, setPos] = useState({ x: 40, y: 40 });

  // gerak random
  useEffect(() => {
    if (open) return;
    const pindah = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const kucing = 144;
      // konten di tengah
      const kiri = W * 0.1 - kucing;
      const kanan = W * 0.9;
      const diKanan = Math.random() < 0.5;
      const x = diKanan
        ? kanan + Math.random() * (W - kanan - kucing)
        : Math.max(10, Math.random() * kiri);
      const y = 20 + Math.random() * (H - kucing - 40);
      setPos({ x, y });
      setFace(Math.floor(Math.random() * WAJAH.length));
    };
    pindah();
    const timer = setInterval(pindah, 7000);
    return () => clearInterval(timer);
  }, [open]);

  // kirim
  async function kirimPesan() {
    const teks = input.trim();
    if (!teks || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: teks }]);
    setInput("");
    setLoading(true);
    setFace(2);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: teks }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      setFace(0);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Maaf, koneksi bermasalah." },
      ]);
      setFace(1);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([]);
  }

  return (
    <>
      {/* kucing */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka chat"
          className="fixed z-[100] w-36 h-36 transition-all duration-[2500ms] ease-in-out hover:scale-110"
          style={{ left: pos.x, top: pos.y }}>
          <img
            key={face}
            src={WAJAH[face]}
            alt="Twinkle"
            className="w-full h-full object-contain drop-shadow-lg animate-float-bob animate-face-pop"/>
        </button>
      )}

      {/* panel */}
      {open && (
        <div className="fixed right-3 bottom-3 left-3 h-[75vh] max-w-sm ml-auto md:left-auto md:inset-auto md:right-6 md:bottom-6 md:w-96 md:h-[34rem] bg-white rounded-2xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-[100] font-['poppins']">
          {/* header */}
          <div className="bg-black text-white px-4 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={WAJAH[face]} alt="" className="w-10 h-10 object-contain" />
              <div>
                <p className="font-bold leading-tight">Twinkle</p>
                <p className="text-white/50 text-xs">Asisten Leo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button onClick={newChat} className="hover:underline">New</button>
              <button onClick={() => setOpen(false)} aria-label="Tutup">✕</button>
            </div>
          </div>

          {/* isi */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
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
                    ? "ml-auto max-w-[80%] bg-black text-white rounded-2xl px-3 py-2 text-sm"
                    : "mr-auto max-w-[80%] bg-white border border-gray-200 text-gray-800 rounded-2xl px-3 py-2 text-sm"
                }>
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="mr-auto bg-white border border-gray-200 text-gray-400 rounded-2xl px-3 py-2 text-sm">
                Twinkle sedang mengetik...
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
              className="flex-1 border border-gray-200 rounded-full px-3 py-2 text-sm outline-none focus:border-black"/>
            <button
              onClick={kirimPesan}
              className="bg-black text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-gray-800 shrink-0">
              Kirim
            </button>
          </div>
        </div>
      )}
    </>
  );
}
