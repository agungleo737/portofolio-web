import { useState, useEffect, useRef } from "react";
import senang from "./assets/senang-removebg-preview.png";
import sedih from "./assets/sedih-removebg-preview.png";
import ngiler from "./assets/ngiiler-removebg-preview.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const API_CHAT = `${API_BASE}/chat`;
const API_SESSIONS = `${API_BASE}/sessions`;

const WAJAH = [senang, sedih, ngiler];

function bersih(teks = "") {
  return teks
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/`(.*?)`/g, "$1")
    .trim();
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [face, setFace] = useState(0);
  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const bawahRef = useRef(null);

  // auto scroll ke bawah
  useEffect(() => {
    bawahRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // posisi panel
  const [panelPos, setPanelPos] = useState(null);
  const drag = useRef({ active: false, dx: 0, dy: 0 });

  function mulaiDrag(e) {
    const p = panelPos ?? { x: window.innerWidth - 780, y: window.innerHeight - 630 };
    drag.current = { active: true, dx: e.clientX - p.x, dy: e.clientY - p.y };
  }

  useEffect(() => {
    const geser = (e) => {
      if (!drag.current.active) return;
      setPanelPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
    };
    const lepas = () => (drag.current.active = false);
    window.addEventListener("mousemove", geser);
    window.addEventListener("mouseup", lepas);
    return () => {
      window.removeEventListener("mousemove", geser);
      window.removeEventListener("mouseup", lepas);
    };
  }, []);

  // bikin sesi baru
  const createNewChat = async () => {
    try {
      const res = await fetch(API_SESSIONS, { method: "POST" });
      const newSession = await res.json();
      setChatSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setMessages([]);
      
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (error) {
      console.error("Gagal bikin sesi baru", error);
    }
  };

  const pilihSesi = async (id) => {
    try {
      const res = await fetch(`${API_SESSIONS}/${id}`);
      const data = await res.json();  
      setActiveSessionId(data.id);
      setMessages(data.messages || []); 
      
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (error) {
      console.error("Gagal buka sesi", error);
    }
  };

  // muat daftar sesi
  const initDone = useRef(false);
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const loadInitialSessions = async () => {
      try {
        const res = await fetch(API_SESSIONS);
        const data = await res.json();
        
        if (data.length > 0) {
          setChatSessions(data);
          pilihSesi(data[0].id);
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error("Gagal load sesi dari DB", error);
      }
    };
    loadInitialSessions();
  }, []);

  // Gerak random kucing
  useEffect(() => {
    if (open) return;
    const pindah = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const kucing = 144;
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

  // Kirim Pesan
  async function kirimPesan() {
    const teks = input.trim();
    if (!teks || loading || !activeSessionId) return;

    // tampilkan di layar
    const userMsg = { role: "user", text: teks };
    const tempBotMsg = { role: "chatbot", text: "" };

    setMessages([...messages, userMsg, tempBotMsg]);
    setInput("");
    setLoading(true);
    setFace(2);

    const historyText = messages.slice(-10);
    const controller = new AbortController();
    const timutId = setTimeout(() => { controller.abort(); }, 45000);
    
    try {
      const res = await fetch(API_CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: teks, 
          history: historyText,
          session_id: activeSessionId
        }),
        signal: controller.signal
      });

      clearTimeout(timutId);

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // update teks
        const teksSaatIni = fullText;
        setMessages(prev =>
          prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: teksSaatIni } : m))
        );
      }

      // rapikan
      setMessages(prev =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: bersih(fullText) } : m))
      );

      // Ganti judul sesi
      if (messages.length === 0) {
        const newTitle = teks.length > 20 ? teks.substring(0, 20) + "..." : teks;
        setChatSessions(prev => prev.map(s => 
          s.id === activeSessionId ? { ...s, title: newTitle } : s
        ));
      }
      setFace(0);

    } catch (error) {
      if(error.name === "AbortError") {
        setMessages(prev => {
          const msgs = [...prev];
          msgs[msgs.length - 1].text = "Maaf, Server sedang sibuk.";
          return msgs;
        });
      } else {
        setMessages(prev => {
          const msgs = [...prev];
          msgs[msgs.length - 1].text = "Terjadi kesalahan. Koneksi terputus.";
          return msgs;
        });
      } 
      setFace(1);

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Kucing */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-[100] w-36 h-36 transition-[left,top] duration-[2500ms] ease-in-out hover:scale-110"
          style={{ left: pos.x, top: pos.y }}>
          <img src={WAJAH[face]} alt="Twinkle" className="w-full h-full object-contain drop-shadow-lg animate-float-bob animate-face-pop"/>
        </button>
      )}

      {/* panel */}
      {open && (
        <div
          className="fixed right-3 bottom-3 left-3 h-[80vh] ml-auto md:left-auto md:w-[48rem] md:h-[38rem] bg-white rounded-2xl shadow-2xl border border-gray-300 flex overflow-hidden z-[100] font-['poppins']"
          style={
            panelPos
              ? { left: panelPos.x, top: panelPos.y, right: "auto", bottom: "auto" }
              : { right: "1.5rem", bottom: "1.5rem" }
          }>
          
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col w-3/4 md:w-1/3 bg-[#1e1f22] text-white border-r border-gray-800 absolute md:relative z-20 h-full transition-all`}>
            <div className="p-4">
              <button onClick={createNewChat} className="flex items-center gap-2 w-full bg-[#2b2d31] hover:bg-[#383a40] text-sm py-2.5 px-4 rounded-xl transition-colors">
                <span className="text-xl leading-none mb-0.5">+</span> New chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 py-2">
              <p className="text-xs text-gray-400 font-semibold px-2 mb-2">Terbaru</p>
              {chatSessions.map(session => (
                <button 
                  key={session.id}
                  onClick={() => pilihSesi(session.id)}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg truncate transition-colors ${activeSessionId === session.id ? 'bg-[#3f4147] text-white' : 'text-gray-300 hover:bg-[#2b2d31]'}`}>
                  {session.title}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chat */}
          <div className="flex-1 flex flex-col w-full relative z-10 bg-gray-50">
            {sidebarOpen && <div className="absolute inset-0 bg-black/50 md:hidden z-10" onClick={() => setSidebarOpen(false)}></div>}

            {/* header, tarik untuk pindah */}
            <div onMouseDown={mulaiDrag} className="bg-black text-white px-4 py-4 flex items-center justify-between cursor-move select-none">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-white mr-2">☰</button>
                <div>
                  <p className="font-bold leading-tight">Twinkle</p>
                  <p className="text-white/50 text-xs">Asisten Leo</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white" aria-label="Tutup">✕</button>
            </div>

            {/* isi chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
                   <p className="text-sm">Tanya apa aja tentang Leo 👋</p>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-black text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}>
                    {/* indikator ngetik */}
                    {m.text === "" && loading ? <span className="animate-pulse">Mengetik...</span> : m.text}
                  </div>
                </div>
              ))}
              <div ref={bawahRef} />
            </div>

            {/* input */}
            <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && kirimPesan()}
                placeholder="Ketik pertanyaan..."
                className="flex-1 min-w-0 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-black transition-colors"/>
              <button
                onClick={kirimPesan}
                disabled={loading}
                className="bg-black text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors shrink-0">
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}