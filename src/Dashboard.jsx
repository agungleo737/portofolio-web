import { useState, useEffect, useRef } from 'react'
import bgdash from './assets/bg_dash.png'
import KucingAnimasi from "./animasi/animasi"
import AnimasiKucing from "./animasi/animasikucing"
import karakter from './assets/Leo.png'
import ChatBot from './chatbot.jsx'

// icon kontak
import githubIcon from './assets/github.png'
import teleponIcon from './assets/telepon.png'
import emailIcon from './assets/email.png'
import alamatIcon from './assets/alamat.png'

// Import png skill
import htmlIcon from './assets/html.png'
import cssIcon from './assets/css.png'
import jsIcon from './assets/javascript.png'
import reactIcon from './assets/react.png'
import tailwindIcon from './assets/tailwind.png'
import androidIcon from './assets/android.png'

import phpIcon from './assets/php.png'
import laravelIcon from './assets/laravel.png'
import pythonIcon from './assets/python.png'
import golangIcon from './assets/golang.png'
import javaIcon from './assets/java.png'
import mysqlIcon from './assets/mysql.png'
import postgresIcon from './assets/postgres.png'
import chromaIcon from './assets/chromadb.png'
import fineIcon from './assets/fine.png'
import databasevectorIcon from './assets/database.png'
import ragIcon from './assets/rag.png'
import linuxIcon from './assets/linux.png'
import vscodeIcon from './assets/vscode.png'
import wiresharkIcon from './assets/wireshark.png'
import burpsuiteIcon from './assets/burpsuite.jpeg'
import pytorchIcon from './assets/pytorch.png'
import nmapIcon from './assets/nmap.png'

// data
const nama = 'Leo Agung Christian'
const tentang = 'Halo! ini adalah website yang aku bikin mengenai diriku.'
const menuItems = ['Home', 'About', 'Skills', 'Experience', 'Contact'];

// skill
const frontendSkills = [
  { nama: 'HTML', deskripsi: 'Struktur markup standar untuk halaman web.', icon: htmlIcon },
  { nama: 'CSS', deskripsi: 'Desain layout dan gaya visual antarmuka web.', icon: cssIcon },
  { nama: 'JavaScript', deskripsi: 'Logika interaktif dan manipulasi DOM client-side.', icon: jsIcon },
  { nama: 'React', deskripsi: 'Library berbasis komponen untuk SPA yang efisien.', icon: reactIcon },
  { nama: 'Tailwind CSS', deskripsi: 'Framework utility-first untuk styling super cepat.', icon: tailwindIcon },
];

const backendSkills = [
  { nama: 'PHP', deskripsi: 'Bahasa skrip server-side untuk web dinamis.', icon: phpIcon },
  { nama: 'Laravel', deskripsi: 'Framework PHP dengan arsitektur MVC yang elegan.', icon: laravelIcon },
  { nama: 'Python', deskripsi: 'Pemrograman serbaguna untuk backend dan skrip data.', icon: pythonIcon },
  { nama: 'Golang', deskripsi: 'Bahasa performa tinggi untuk sistem backend mikro.', icon: golangIcon },
  { nama: 'Java', deskripsi: 'Bahasa pemrograman tangguh berbasis OOP untuk enterprise.', icon: javaIcon },
  { nama: 'MySQL', deskripsi: 'Manajemen sistem basis data relasional (RDBMS).', icon: mysqlIcon },
  { nama: 'PostgreSQL', deskripsi: 'Database relasional tingkat lanjut open-source.', icon: postgresIcon }
];
const aiSkills = [
  { nama: 'RAG', deskripsi: 'Sistem pencarian informasi eksternal untuk LLM.', icon: ragIcon },
  { nama: 'Fine-Tuning', deskripsi: 'Melatih ulang model AI agar spesifik pada suatu domain.', icon: fineIcon },
  { nama: 'ChromaDB', deskripsi: 'Vector database open-source khusus aplikasi AI.', icon: chromaIcon },
  { nama: 'Vector Databases', deskripsi: 'Penyimpanan embedding data untuk pencarian semantik.', icon: databasevectorIcon },
];

const tambahanSkills = [
  { nama: 'Linux', icon: linuxIcon },
  { nama: 'Android Studio', icon: androidIcon },
  { nama: 'VS Code', icon: vscodeIcon },
  { nama: 'nmap', icon: nmapIcon },
  { nama: 'Wireshark', icon: wiresharkIcon },
  { nama: 'Burp Suite', icon: burpsuiteIcon },
  { nama: 'PyTorch', icon: pytorchIcon },
];

const bintangPositions = [
  // top strip
  { top: '3%', left: '14%', opacity: 20, size: 6 },
  { top: '7%', left: '23%', opacity: 30, size: 8 },
  { top: '1%', left: '32%', opacity: 25, size: 6 },
  { top: '10%', left: '41%', opacity: 40, size: 12 },
  { top: '3%', left: '55%', opacity: 35, size: 8 },
  { top: '9%', left: '62%', opacity: 50, size: 14 },
  { top: '1%', left: '70%', opacity: 45, size: 12 },
  { top: '3%', left: '80%', opacity: 30, size: 8 },

  // tengah-kiri cluster
  { top: '22%', left: '38%', opacity: 20, size: 6 },
  { top: '18%', left: '46%', opacity: 35, size: 8 },
  { top: '25%', left: '52%', opacity: 25, size: 6 },
  { top: '15%', left: '60%', opacity: 45, size: 12 },
  { top: '28%', left: '66%', opacity: 30, size: 8 },
  { top: '40%', left: '35%', opacity: 15, size: 6 },
  { top: '45%', left: '44%', opacity: 25, size: 8 },
  { top: '38%', left: '53%', opacity: 40, size: 12 },
  { top: '50%', left: '60%', opacity: 30, size: 6 },

  // pinggir kiri
  { top: '8%', left: '5%', opacity: 20, size: 6 },
  { top: '35%', left: '2%', opacity: 15, size: 6 },
  { top: '55%', left: '6%', opacity: 20, size: 8 },

  // kanan atas
  { top: '12%', left: '73%', opacity: 55, size: 14 },
  { top: '22%', left: '79%', opacity: 40, size: 12 },
  { top: '18%', left: '85%', opacity: 50, size: 16 },
  { top: '30%', left: '90%', opacity: 30, size: 8 },
  { top: '10%', left: '93%', opacity: 35, size: 6 },

  // kanan tengah
  { top: '42%', left: '68%', opacity: 50, size: 14 },
  { top: '36%', left: '82%', opacity: 55, size: 16 },
  { top: '52%', left: '88%', opacity: 25, size: 8 },
  { top: '44%', left: '94%', opacity: 45, size: 14 },

  // bottom band
  { bottom: '23%', left: '30%', opacity: 20, size: 6 },
  { bottom: '17%', left: '40%', opacity: 30, size: 8 },
  { bottom: '11%', left: '50%', opacity: 25, size: 6 },
  { bottom: '20%', left: '58%', opacity: 40, size: 12 },
  { bottom: '9%', left: '65%', opacity: 10, size: 14 },
  { bottom: '14%', left: '72%', opacity: 35, size: 8 },
  { bottom: '5%', left: '79%', opacity: 55, size: 16 },
  { bottom: '23%', left: '85%', opacity: 30, size: 6 },
  { bottom: '11%', left: '90%', opacity: 45, size: 12 },
  { bottom: '4%', left: '94%', opacity: 50, size: 14 },
];

const extraBintangPositions = [
  { top: '5%', left: '10%', opacity: 25, size: 5, delay: 0.2 },
  { top: '14%', left: '19%', opacity: 40, size: 10, delay: 1.1 },
  { top: '2%', left: '27%', opacity: 20, size: 6, delay: 0.6 },
  { top: '19%', left: '35%', opacity: 35, size: 8, delay: 1.8 },
  { top: '6%', left: '48%', opacity: 45, size: 12, delay: 0.9 },
  { top: '16%', left: '58%', opacity: 30, size: 7, delay: 1.4 },
  { top: '4%', left: '66%', opacity: 50, size: 14, delay: 0.3 },
  { top: '20%', left: '76%', opacity: 25, size: 6, delay: 2.1 },
  { top: '9%', left: '88%', opacity: 40, size: 10, delay: 0.7 },
  { top: '30%', left: '8%', opacity: 20, size: 6, delay: 1.6 },
  { top: '48%', left: '15%', opacity: 30, size: 8, delay: 0.4 },
  { top: '60%', left: '25%', opacity: 25, size: 6, delay: 2.0 },
  { top: '33%', left: '92%', opacity: 45, size: 12, delay: 1.2 },
  { top: '58%', left: '95%', opacity: 30, size: 8, delay: 0.8 },
  { bottom: '30%', left: '18%', opacity: 25, size: 6, delay: 1.5 },
  { bottom: '35%', left: '46%', opacity: 40, size: 10, delay: 0.5 },
  { bottom: '28%', left: '62%', opacity: 20, size: 6, delay: 1.9 },
  { bottom: '15%', left: '10%', opacity: 35, size: 8, delay: 1.0 },
  { bottom: '8%', left: '38%', opacity: 45, size: 12, delay: 0.2 },
  { bottom: '2%', left: '58%', opacity: 25, size: 6, delay: 1.7 },
];

// bintang di sekitar karakter
const karakterBintang = [
  { top: '4%', left: '8%', opacity: 55, size: 14, delay: 0.2 },
  { top: '10%', left: '78%', opacity: 45, size: 12, delay: 1.1 },
  { top: '2%', left: '45%', opacity: 35, size: 8, delay: 0.6 },
  { top: '20%', left: '92%', opacity: 50, size: 16, delay: 1.5 },
  { top: '30%', left: '4%', opacity: 40, size: 10, delay: 0.9 },
  { top: '48%', left: '88%', opacity: 30, size: 8, delay: 1.8 },
  { top: '55%', left: '2%', opacity: 45, size: 12, delay: 0.4 },
  { top: '68%', left: '80%', opacity: 55, size: 14, delay: 1.2 },
  { top: '75%', left: '15%', opacity: 35, size: 8, delay: 0.7 },
  { bottom: '4%', left: '55%', opacity: 50, size: 12, delay: 1.6 },
  { bottom: '8%', left: '90%', opacity: 40, size: 10, delay: 0.3 },
  { bottom: '2%', left: '30%', opacity: 45, size: 14, delay: 2.0 },
  { top: '38%', left: '50%', opacity: 25, size: 6, delay: 1.0 },
  { top: '15%', left: '25%', opacity: 30, size: 8, delay: 0.5 },
];

function Bintang({ top, bottom, left, opacity, size, delay, twinkle, desktopOnly }) {
  return (
    <div
      className={`absolute z-0 ${desktopOnly ? 'hidden md:block' : ''} ${twinkle ? 'animate-twinkle' : ''}`}
      style={{
        top,
        bottom,
        left,
        color: `rgba(255,255,255,${opacity / 100})`,
        fontSize: `${size}px`,
        lineHeight: 1,
        animationDelay: twinkle ? `${delay || 0}s` : undefined,
      }}>
      ✦
    </div>
  );
}

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % 1000);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // muncul saat discroll
  const skillsRef = useRef(null);
  const [skillsVisible, setSkillsVisible] = useState(false);
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkillsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // scroll-spy
  const [activeIdx, setActiveIdx] = useState(0);
  const linkRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const ids = menuItems.map((i) => i.toLowerCase());
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf(e.target.id);
            if (idx !== -1) setActiveIdx(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // geser garis
  useEffect(() => {
    const move = () => {
      const el = linkRefs.current[activeIdx];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [activeIdx]);
  return (
    <div className="dashboard min-h-screen overflow-x-hidden bg-white">

      {/* navbar */}
      <nav className="w-[90%] md:w-4/5 mx-auto left-1/2 -translate-x-1/2 fixed top-4 flex items-center justify-between z-50 bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-8 px-1 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-black font-['poppins'] tracking-tight">LAC</span>
          </div>
          <span className="text-black font-bold text-sm font-['poppins'] tracking-wide">Leo Agung Christian</span>
        </div>

        {/* menu desktop */}
        <ul className="hidden md:flex items-center gap-8 relative">
          {menuItems.map((item, i) => (
            <li key={item}>
              <a
                ref={(el) => (linkRefs.current[i] = el)}
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-['poppins'] font-medium tracking-wide transition-colors duration-200 ${
                  activeIdx === i ? "text-black" : "text-black/50 hover:text-black"
                }`}
              >
                {item}
              </a>
            </li>
          ))}
          {/* garis indikator */}
          <span
            className="absolute -bottom-1 h-0.5 bg-black rounded-full transition-all duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          ></span>
        </ul>
        <a href="#contact" className="hidden md:inline-block bg-black text-white text-xs font-['poppins'] font-semibold px-4 py-2 rounded-lg hover:bg-black/80 transition-colors duration-200 tracking-wide">
          Hire Me
        </a>

        {/* mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex md:hidden flex-col gap-1.5 p-2" aria-label="Toggle menu">
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>

        {/* dropdown mobile */}
        {menuOpen && (
          <ul className="md:hidden absolute top-14 right-0 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border border-black rounded-xl p-4 flex flex-col gap-3 w-48">
            {menuItems.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-black/70 hover:text-black text-sm font-['poppins'] font-medium tracking-wide">{item}</a>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <hr className="border-t-3 border-black left-1/2 -translate-x-1/2 my-20 w-4/5 md:w-4/5 absolute"/>

      {/* section */}
      <div className="dashboard-conten w-full h-90 flex flex-col pt-15 md:pt-0">
        <div className="dashboard-text absolute left-1/2 -translate-x-1/2 h-auto w-full md:w-2/3 mt-12 md:mt-25 px-2 md:px-10 text-center">
          <h1 className="bg-linear-to-r from-black to-gray-500 bg-clip-text text-transparent text-[11vw] md:text-8xl font-bold font-['poppins'] leading-none whitespace-nowrap">PORTOFOLIO</h1>
          <p className="bg-black mx-auto rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] w-fit text-white text-lg md:text-4xl font-bold mt-8 p-3 font-['poppins']">{nama}</p>
        </div>
        <hr className="border-t-3 border-black left-1/2 -translate-x-1/2 mt-55 md:mt-80 w-4/5 absolute"/>
      </div>

      {/* main content */}
      <div className="w-[90%] md:w-4/5 mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 md:p-7 flex border border-black flex-col md:flex-row items-stretch justify-between gap-8 bg-black rounded-4xl -mt-8 md:mt-0">
        
        {/* tentang saya */}
        <div id="about" className="w-full md:w-3/5 flex flex-col justify-between py-4 md:py-6 px-4 md:px-6 rounded-4xl relative overflow-hidden min-h-70">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}/>

          {/* dekorasi sudut */}
          <div className="absolute top-0 left-0 w-16 h-16 z-0">
            <div className="absolute top-4 left-0 w-8 h-px bg-white/30"></div>
            <div className="absolute top-0 left-4 w-px h-8 bg-white/30"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 z-0 hidden md:block">
            <div className="absolute bottom-4 right-0 w-8 h-px bg-white/30"></div>
            <div className="absolute bottom-0 right-4 w-px h-8 bg-white/30"></div>
          </div>

          {/* lingkaran dekoratif */}
          <div className="absolute top-6 right-24 w-24 h-24 border border-white/10 rounded-full z-0 hidden md:block"></div>
          <div className="absolute top-10 right-28 w-12 h-12 border border-white/10 rounded-full z-0 hidden md:block"></div>
          <div className="absolute bottom-6 left-1/2 w-16 h-16 border border-white/8 rounded-full z-0 hidden md:block"></div>
          <div className="absolute top-0 right-16 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent z-0 hidden md:block"></div>
          <div className="relative z-10">
            <div className="mb-4">
              <p className="text-white/50 text-xs font-mono tracking-[0.3em] uppercase mb-1">— Tentang Saya</p>
              <div className="w-32 h-px bg-linear-to-r from-white via-white/60 to-transparent shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"></div>
            </div>
            <h2 className="text-white font-black text-xl md:text-2xl font-['poppins'] leading-tight mb-1">Universitas Budi Luhur</h2>
            <p className="text-white/50 text-xs md:text-sm font-['poppins'] tracking-wide">Fakultas Teknologi Informasi</p>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start mt-4">

            {/* fokus akademik */}
            <ul className="flex-1 space-y-2 text-white/75 text-sm font-['poppins']">
              <li className="flex items-start gap-2">
                <span className="text-white/40 -mt-1 text-base">▸</span>Pengembangan aplikasi web & sistem chatbot</li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 -mt-1 text-base">▸</span>Sistem basis data & keamanan data</li>
              <li className="flex items-start gap-2">
                <span className="text-white/40 -mt-1 text-base">▸</span>Laravel · PHP · React</li>
            </ul>

            {/* nilai akademik */}
            <div className="flex flex-row md:flex-col gap-4 items-center md:items-end shrink-0 md:-mt-18 w-full md:w-auto justify-between md:justify-start pt-4 md:pt-0">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-center shadow-[0_0_16px_2px_rgba(255,255,255,0.1)]">
                <p className="text-white font-black text-xl font-mono leading-none">3.77</p>
                <p className="text-white/50 text-[10px] tracking-widest uppercase mt-1">IPS</p>
              </div>
              <span className="bg-white/10 border border-white/20 text-white text-[11px] md:text-xs px-3 py-1.5 rounded-full font-mono shadow-[0_0_12px_2px_rgba(255,255,255,0.1)]">
                ✦ Mahasiswa Aktif
              </span>
            </div>
          </div>

          {/* bintang */}
          {bintangPositions
            .filter((b) => !(b.top && parseInt(b.top) < 32 && b.left && parseInt(b.left) > 72))
            .map((b, i) => (
              <Bintang key={i} {...b} delay={(i % 6) * 0.5} desktopOnly={i % 2 === 1} twinkle />
            ))}

          {/* label kategori */}
          <div className="relative z-10 mt-4">
            <div className="w-full h-px bg-white/10 mb-3"></div>
            <p className="text-white/40 text-xs font-mono tracking-widest">INFORMATIKA · WEB · BACKEND · AI</p>
          </div>
        </div>

        {/* tentang versi desktop */}
        <div className="hidden md:flex w-full md:w-2/5 relative overflow-hidden bg-white rounded-4xl flex-row items-center justify-between p-6 gap-4 min-h-52 md:h-70">
          <p className="text-black relative z-10 text-base md:text-lg w-full md:w-4/5 -top-13 text-center md:text-left font-['poppins']">{tentang}</p>
          <div>
            <div className="absolute bottom-0 left-4">
              <KucingAnimasi/>
            </div>
            <img src={bgdash} alt="Background" className="absolute bottom-0 -right-7 h-4/6 z-0 w-auto"/>
          </div>
        </div>
      </div>

      {/* skill */}
      <div id="skills" className="w-[90%] md:w-4/5 mx-auto mt-16 md:mt-24 mb-6 md:mb-10 text-center">
        <h2 className="text-black font-black text-3xl md:text-5xl font-['poppins']">Skill Saya</h2>
      </div>
      <div ref={skillsRef} className="w-[90%] md:w-4/5 mx-auto flex flex-col md:flex-row items-stretch justify-between gap-6 mb-20">
        
        {/* frontend */}
        <div className={`hidden md:block bg-black w-full md:w-1/3 h-120 rounded-4xl relative overflow-hidden p-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] ${skillsVisible ? 'animate-card-in card-delay-1' : 'opacity-0'}`}>
          <div className="bg-white rounded-3xl h-[calc(100%-16px)] relative z-10 p-8 flex flex-col items-center justify-start text-center gap-6">
            <div>
              <h3 className="text-black font-black text-2xl font-['poppins']">Frontend Dev</h3>
              <p className="text-black/40 text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-gray-100 rounded-full inline-block mt-1">Client Side</p>
            </div>

            {/* Animasi */}
            <div key={`fe-${currentSkillIndex}`} className="flex flex-col items-center gap-4 my-auto">
              <img src={frontendSkills[currentSkillIndex % frontendSkills.length].icon} alt="Icon" className="w-20 h-20 object-contain drop-shadow-md" />
              <span className="text-black font-black text-3xl font-['poppins'] tracking-tight">{frontendSkills[currentSkillIndex % frontendSkills.length].nama}</span>
            </div>
            <p className="text-black/70 text-sm font-['poppins'] h-12 flex items-center justify-center font-medium px-2">{frontendSkills[currentSkillIndex % frontendSkills.length].deskripsi}</p>
          </div>
        </div>

        {/* backend */}
        <div className={`hidden md:block bg-black w-full md:w-1/3 h-120 rounded-4xl relative overflow-hidden p-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] ${skillsVisible ? 'animate-card-in card-delay-2' : 'opacity-0'}`}>
          <div className="bg-white rounded-3xl h-[calc(100%-16px)] relative z-10 p-8 flex flex-col items-center justify-start text-center gap-6">
            <div>
              <h3 className="text-black font-black text-2xl font-['poppins']">Backend Dev</h3>
              <p className="text-black/40 text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-gray-100 rounded-full inline-block mt-1">Server & API</p>
            </div>

            {/* Animasi */}
            <div key={`be-${currentSkillIndex}`} className="flex flex-col items-center gap-4 my-auto">
              <img src={backendSkills[currentSkillIndex % backendSkills.length].icon} alt="Icon" className="w-20 h-20 object-contain drop-shadow-md" />
              <span className="text-black font-black text-3xl font-['poppins'] tracking-tight">{backendSkills[currentSkillIndex % backendSkills.length].nama}</span>
            </div>
            <p className="text-black/70 text-sm font-['poppins'] h-12 flex items-center justify-center font-medium px-2">{backendSkills[currentSkillIndex % backendSkills.length].deskripsi}</p>
          </div>
        </div>

        {/* AI & ML */}
        <div className={`hidden md:block bg-black w-full md:w-1/3 h-120 rounded-4xl relative overflow-hidden p-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] ${skillsVisible ? 'animate-card-in card-delay-3' : 'opacity-0'}`}>
          <div className="bg-white rounded-3xl h-[calc(100%-16px)] relative z-10 p-8 flex flex-col items-center justify-start text-center gap-6">
            <div>
              <h3 className="text-black font-black text-2xl font-['poppins']">AI & ML</h3>
              <p className="text-black/40 text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-gray-100 rounded-full inline-block mt-1">Intelligent System</p>
            </div>

            {/* Animasi */}
            <div key={`ai-${currentSkillIndex}`} className="flex flex-col items-center gap-4 my-auto">
              <img src={aiSkills[currentSkillIndex % aiSkills.length].icon} alt="Icon" className="w-20 h-20 object-contain drop-shadow-md" />
              <span className="text-black font-black text-3xl font-['poppins'] tracking-tight">{aiSkills[currentSkillIndex % aiSkills.length].nama}</span>
            </div>
            <p className="text-black/70 text-sm font-['poppins'] h-12 flex items-center justify-center font-medium px-2">{aiSkills[currentSkillIndex % aiSkills.length].deskripsi}</p>
          </div>
        </div>

        {/* versi mobile */}
        <div className="block md:hidden bg-black w-full h-auto rounded-4xl p-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]">
          <div className="bg-white rounded-3xl p-5 flex flex-col gap-5 text-center">
            <div className="border-b border-gray-100 pb-3 flex flex-col items-center">
              <p className="text-black/40 text-[9px] font-mono tracking-widest uppercase mb-1">FRONTEND</p>
              <div key={`mob-fe-${currentSkillIndex}`} className="flex items-center gap-2">
                <img src={frontendSkills[currentSkillIndex % frontendSkills.length].icon} alt="Icon" className="w-6 h-6 object-contain" />
                <span className="text-black font-black text-lg font-['poppins']">{frontendSkills[currentSkillIndex % frontendSkills.length].nama}</span>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-3 flex flex-col items-center">
              <p className="text-black/40 text-[9px] font-mono tracking-widest uppercase mb-1">BACKEND</p>
              <div key={`mob-be-${currentSkillIndex}`} className="flex items-center gap-2">
                <img src={backendSkills[currentSkillIndex % backendSkills.length].icon} alt="Icon" className="w-6 h-6 object-contain" />
                <span className="text-black font-black text-lg font-['poppins']">{backendSkills[currentSkillIndex % backendSkills.length].nama}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-black/40 text-[9px] font-mono tracking-widest uppercase mb-1">AI & ML</p>
              <div key={`mob-ai-${currentSkillIndex}`} className="flex items-center gap-2">
                <img src={aiSkills[currentSkillIndex % aiSkills.length].icon} alt="Icon" className="w-6 h-6 object-contain" />
                <span className="text-black font-black text-lg font-['poppins']">{aiSkills[currentSkillIndex % aiSkills.length].nama}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* experience */}
      <div id='experience' className="bg-black w-[90%] md:w-4/5 mx-auto h-auto flex flex-col md:flex-row items-stretch justify-start rounded-4xl overflow-hidden p-6 md:p-10 gap-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border border-black relative">
        {bintangPositions.map((b, i) => <Bintang key={`exp-star-${i}`} {...b} delay={(i % 6) * 0.5} desktopOnly={i % 2 === 1} twinkle />)}
        {extraBintangPositions.map((b, i) => <Bintang key={`exp-extra-star-${i}`} {...b} desktopOnly={i % 2 === 1} twinkle />)}
        {/* background titik */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'}}/>

        {/* foto */}
        <div className="w-full md:w-auto flex justify-center items-center shrink-0 relative z-10 min-w-55 md:min-w-75">
          {/* bintang */}
          {karakterBintang.map((b, i) => (
            <Bintang key={`kar-star-${i}`} {...b} desktopOnly={i % 2 === 1} twinkle />
          ))}
          <img src={karakter} alt="foto gw" className="h-64 md:h-80 w-auto object-contain px-4 md:px-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] relative z-10"/>
        </div>
        <div className="flex-1 w-full text-white font-['poppins'] flex flex-col justify-center gap-4 relative z-10">
          <div>
            <p className="text-white/50 text-xs font-mono tracking-[0.3em] uppercase mb-1">— Pengalaman</p>
            <div className="w-32 h-px bg-linear-to-r from-white via-white/40 to-transparent mb-3"></div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">Aplikasi E-Commerce & Chatbot AI</h3>
          </div>
          <div className="space-y-4 text-sm md:text-base text-white/80">
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors duration-200">
              <span className="text-amber-500 mt-1 shrink-0">✦</span>
              <p>
                <strong className="text-white">Full-Stack Web & Mobile:</strong> Mengembangkan aplikasi e-commerce menggunakan <span className="text-amber-400 font-medium">XML & Java</span> yang terintegrasi dengan <span className="text-amber-400 font-medium">Laravel</span> sebagai backend serta <span className="text-amber-400 font-medium">MariaDB</span> untuk manajemen databasenya.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors duration-200">
              <span className="text-amber-500 mt-1 shrink-0">✦</span>
              <p>
                <strong className="text-white">AI Integration:</strong> Merancang dan mengimplementasikan sistem <span className="text-amber-400 font-medium">Chatbot AI</span> cerdas yang berfungsi untuk mengotomasi pencarian serta penyajian informasi secara interaktif.
              </p>
            </div>
          </div>

          {/* tags */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-mono text-white/60">
            <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">ANDROID JAVA</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">LARAVEL API</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">MARIADB</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10">INTELLIGENT SYSTEM</span>
          </div>
        </div>
      </div>

      {/* skill tambahan */}
      <div className="w-[90%] md:w-4/5 mx-auto mt-12 md:mt-16 mb-20">
        <div className="mb-8 text-center">
          <h3 className="text-black font-black text-3xl md:text-5xl font-['poppins'] uppercase tracking-tight">
            Tambahan Skill
          </h3>
        </div>
        <div className="bg-black rounded-4xl p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'}}/>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 relative z-10">
            {tambahanSkills.map((item) => (
              <div key={item.nama} className="flex flex-col items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-2xl px-4 py-5 font-['poppins'] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <img src={item.icon} alt={item.nama} className="w-9 h-9 md:w-10 md:h-10 object-contain" />
                <span className="text-white font-bold text-xs md:text-sm text-center">{item.nama}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* jejak kaki kucing */}
      <div className="hidden md:block mt-2 -mb-2">
        <AnimasiKucing />
      </div>

      {/* Contact */}
      <div id="contact" className="w-[90%] md:w-4/5 mx-auto mt-24 mb-20">
        <div className="bg-black rounded-4xl p-8 md:p-14 flex flex-col gap-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border border-black relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'}}/>
          {/* bintang berkedip */}
          {extraBintangPositions.map((b, i) => <Bintang key={`contact-star-${i}`} {...b} desktopOnly={i % 2 === 1} twinkle />)}

          {/* lingkaran dekoratif */}
          <div className="absolute -top-16 -right-16 w-56 h-56 border border-white/10 rounded-full z-0 hidden md:block"></div>
          <div className="absolute -top-8 -right-8 w-40 h-40 border border-white/10 rounded-full z-0 hidden md:block"></div>

          {/* heading */}
          <div className="relative z-10 text-center md:text-left">
            <p className="text-white/50 text-xs font-mono tracking-[0.3em] uppercase mb-2">— Contact</p>
            <div className="w-32 h-px bg-linear-to-r from-white via-white/40 to-transparent mb-4 mx-auto md:mx-0"></div>
            <h3 className="text-white font-black text-3xl md:text-5xl font-['poppins']">Hubungi Saya</h3>
          </div>

          {/* kartu kontak */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* email */}
            <a href="mailto:agungleo737@gmail.com"
              className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-white group-hover:scale-110 transition-transform duration-300">
                <img src={emailIcon} alt="Email" className="w-8 h-8 object-contain" />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Email</p>
                <p className="text-white font-semibold text-sm md:text-base font-['poppins'] truncate">agungleo737@gmail.com</p>
              </div>
            </a>

            {/* telepon */}
            <a href="https://wa.me/6281212856286"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-white group-hover:scale-110 transition-transform duration-300">
                <img src={teleponIcon} alt="WhatsApp" className="w-8 h-8 object-contain" />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">WhatsApp</p>
                <p className="text-white font-semibold text-sm md:text-base font-['poppins'] truncate">0812-1285-6286</p>
              </div>
            </a>

            {/* github */}
            <a href="https://github.com/agungleo737"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-white group-hover:scale-110 transition-transform duration-300">
                <img src={githubIcon} alt="GitHub" className="w-8 h-8 object-contain" />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">GitHub</p>
                <p className="text-white font-semibold text-sm md:text-base font-['poppins'] truncate">github.com/agungleo737</p>
              </div>
            </a>

            {/* alamat */}
            <div className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl bg-white">
                <img src={alamatIcon} alt="Alamat" className="w-8 h-8 object-contain" />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Alamat</p>
                <p className="text-white font-semibold text-sm md:text-base font-['poppins'] leading-snug">Duren Village Blok C3 No.24, Sudimara Selatan, Ciledug, Kota Tangerang</p>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-center sm:justify-start">
            <p className="text-white/40 text-xs font-mono tracking-wide">© 2026 Leo Agung Christian</p>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

export default Dashboard;