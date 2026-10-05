import { useState, useEffect, useRef } from "react";
import senang from "./assets/senang-removebg-preview.png";
import sedih from "./assets/sedih-removebg-preview.png";
import ngiler from "./assets/ngiiler-removebg-preview.png";

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl;
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return `http://${window.location.hostname}:8000/api`;
  }
  return "http://localhost:8000/api";
};

const API_BASE = getApiBase();
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
    if (window.innerWidth < 768) return;
    const p = panelPos ?? { x: window.innerWidth - 780, y: window.innerHeight - 630 };
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;
    drag.current = { active: true, dx: clientX - p.x, dy: clientY - p.y };
  }
  useEffect(() => {
    const geser = (e) => {
      if (!drag.current.active) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!clientX || !clientY) return;
      setPanelPos({ x: clientX - drag.current.dx, y: clientY - drag.current.dy });
    };
    const lepas = () => (drag.current.active = false);
    
    window.addEventListener("mousemove", geser);
    window.addEventListener("mouseup", lepas);
    window.addEventListener("touchmove", geser);
    window.addEventListener("touchend", lepas);
    return () => {
      window.removeEventListener("mousemove", geser);
      window.removeEventListener("mouseup", lepas);
      window.removeEventListener("touchmove", geser);
      window.removeEventListener("touchend", lepas);
    };
  }, []);

  // Bikin sesi baru
  const createNewChat = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setMessages([]);
    setInput("");
    setSidebarOpen(false);

    try {
      const res = await fetch(API_SESSIONS, { method: "POST" });
      if (res.ok) {
        const newSession = await res.json();
        setChatSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        return;
      }
    } catch (error) {
      console.error("Gagal bikin sesi di DB", error);
    }

    // Fallback
    const localId = Date.now();
    const localSession = { id: localId, title: "New Chat" };
    setChatSessions(prev => [localSession, ...prev]);
    setActiveSessionId(localId);
  };

  const pilihSesi = async (id) => {
    setActiveSessionId(id);
    setSidebarOpen(false);
    try {
      const res = await fetch(`${API_SESSIONS}/${id}`);
      if (res.ok) {
        const data = await res.json();  
        setMessages(data.messages || []); 
        return;
      }
    } catch (error) {
      console.error("Gagal buka sesi", error);
    }
  };

  // Muat daftar sesi
  const initDone = useRef(false);
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const loadInitialSessions = async () => {
      try {
        const res = await fetch(API_SESSIONS);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setChatSessions(data);
            pilihSesi(data[0].id);
            return;
          }
        }
      } catch (error) {
        console.error("Gagal load sesi dari DB", error);
      }
      createNewChat();
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
  async function kirimPesan(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const teks = input.trim();
    if (!teks || loading) return;

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = Date.now();
      setActiveSessionId(currentSessionId);
    }

    const isFirstMessage = messages.length === 0;
    const userMsg = { role: "user", text: teks };
    const tempBotMsg = { role: "chatbot", text: "" };
    const historyForApi = [...messages]; // Simpan history
    setMessages(prev => [...prev, userMsg, tempBotMsg]);
    setInput("");
    setLoading(true);
    setFace(2);

    // Update judul
    if (isFirstMessage) {
      const newTitle = teks.length > 20 ? teks.substring(0, 20) + "..." : teks;
      setChatSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, title: newTitle } : s
      ));
    }

    const controller = new AbortController();
    const timutId = setTimeout(() => { controller.abort(); }, 45000);
    
    try {
      const res = await fetch(API_CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: teks, 
          history: historyForApi.slice(-10),
          session_id: currentSessionId
        }),
        signal: controller.signal
      });

      clearTimeout(timutId);

      if (!res.ok) throw new Error("Server Error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        const teksSaatIni = fullText;
        setMessages(prev =>
          prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: teksSaatIni } : m))
        );
      }

      setMessages(prev =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: bersih(fullText) } : m))
      );

      setFace(0);

    } catch (error) {
      if(error.name === "AbortError") {
        setMessages(prev => {
          const msgs = [...prev];
          if (msgs.length > 0) msgs[msgs.length - 1].text = "Maaf, Server sedang sibuk.";
          return msgs;
        });
      } else {
        setMessages(prev => {
          const msgs = [...prev];
          if (msgs.length > 0) msgs[msgs.length - 1].text = "Terjadi kesalahan. Koneksi terputus.";
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
          className="fixed z-[100] w-36 h-36 transition-[left,top] duration-[2500ms] ease-in-out hover:scale-110 touch-none"
          style={{ left: pos.x, top: pos.y }}>
          <img src={WAJAH[face]} alt="Twinkle" className="w-full h-full object-contain drop-shadow-lg animate-float-bob animate-face-pop"/>
        </button>
      )}

      {/* panel */}
      {open && (
        <div
          className="fixed right-3 bottom-3 left-3 h-[85vh] ml-auto md:left-auto md:w-[48rem] md:h-[38rem] bg-white rounded-2xl shadow-2xl border border-gray-300 flex overflow-hidden z-[100] font-['poppins']"
          style={
            panelPos && window.innerWidth >= 768
              ? { left: panelPos.x, top: panelPos.y, right: "auto", bottom: "auto" }
              : undefined
          }>
          
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col w-4/5 md:w-1/3 bg-[#1e1f22] text-white border-r border-gray-800 absolute md:relative z-30 h-full transition-transform duration-300 ease-in-out`}>
            <div className="p-4 flex items-center justify-between">
              <button 
                type="button"
                onClick={createNewChat} 
                onTouchEnd={createNewChat}
                className="flex items-center justify-center gap-2 w-full bg-[#2b2d31] hover:bg-[#383a40] active:bg-[#404249] text-sm py-2.5 px-4 rounded-xl transition-colors cursor-pointer touch-manipulation">
                <span className="text-xl leading-none mb-0.5">+</span> New chat
              </button>
              <button type="button" onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 p-2 ml-1">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 py-2">
              <p className="text-xs text-gray-400 font-semibold px-2 mb-2">Terbaru</p>
              {chatSessions.map(session => (
                <button 
                  key={session.id}
                  type="button"
                  onClick={() => pilihSesi(session.id)}
                  className={`w-full text-left text-sm py-2.5 px-3 rounded-lg truncate transition-colors my-0.5 cursor-pointer ${activeSessionId === session.id ? 'bg-[#3f4147] text-white font-medium' : 'text-gray-300 hover:bg-[#2b2d31]'}`}>
                  {session.title || "New Chat"}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chat */}
          <div className="flex-1 flex flex-col w-full relative z-10 bg-gray-50 h-full">
            {sidebarOpen && <div className="absolute inset-0 bg-black/50 md:hidden z-20" onClick={() => setSidebarOpen(false)}></div>}

            {/* header */}
            <div onMouseDown={mulaiDrag} className="bg-black text-white px-4 py-3.5 flex items-center justify-between cursor-move select-none shrink-0 z-10">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden bg-white/10 px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1.5">
                  <span>☰</span>
                  <span>Histori</span>
                </button>
                <div>
                  <p className="font-bold leading-tight">Twinkle</p>
                  <p className="text-white/50 text-[10px] md:text-xs">Asisten Leo</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white p-1" aria-label="Tutup">✕</button>
            </div>

            {/* isi chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70 text-center px-4">
                   <p className="text-sm">Tanya apa aja tentang Leo 👋</p>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${m.role === "user" ? "bg-black text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}>
                    {m.text === "" && loading ? <span className="animate-pulse">Mengetik...</span> : m.text}
                  </div>
                </div>
              ))}
              <div ref={bawahRef} />
            </div>

            {/* input form */}
            <form onSubmit={kirimPesan} className="p-3 bg-white border-t border-gray-200 flex gap-2 shrink-0 z-10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan..."
                className="flex-1 min-w-0 border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"/>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                onClick={kirimPesan}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  kirimPesan(e);
                }}
                className="bg-black text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-300 transition-colors shrink-0 cursor-pointer touch-manipulation">
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}