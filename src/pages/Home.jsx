import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, cubicBezier, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Sparkles,
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Image as ImageIcon, 
  Users, 
  ChevronDown,
  QrCode,
  CheckCircle2,
  Lock
} from "lucide-react";
import BrowserMockup from "../components/ui/BrowserMockup";
import GlassModal from "../components/ui/GlassModal";

// --- Hooks & Mock Data ---

function useTypewriterCycle(words, typingSpeed = 100, deletingSpeed = 60, pauseMs = 2000) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex].text;
    let timer;
    if (!isDeleting) {
      if (displayed !== word) {
        timer = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setIsDeleting(true), pauseMs);
      }
    } else {
      if (displayed !== "") {
        timer = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return { displayed, gradient: words[wordIndex].gradient };
}

const PERFECT_FOR_WORDS = [
  { text: "düğünler", gradient: "from-purple-500 to-pink-500" },
  { text: "mezuniyet geceleri", gradient: "from-blue-500 to-indigo-500" },
  { text: "kurumsal etkinlikler", gradient: "from-emerald-500 to-teal-500" },
  { text: "festival anları", gradient: "from-orange-500 to-red-500" },
  { text: "gece partileri", gradient: "from-pink-500 to-rose-500" },
];

const gridPhotos = {
  scaler: {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=100&w=3840",
    alt: "Düğün çifti dansı"
  },
  layer1: [
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=100&w=3840", alt: "Düğün töreni" },
    { url: "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=100&w=3840", alt: "Mezuniyet günü" },
    { url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=100&w=3840", alt: "İş toplantısı" },
    { url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=100&w=3840", alt: "Parti eğlencesi" },
    { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=100&w=3840", alt: "Etkinlik kalabalığı" },
    { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=100&w=3840", alt: "Konser gecesi" }
  ],
  layer2: [
    { url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=100&w=3840", alt: "Etkinlik davetlileri" },
    { url: "https://images.unsplash.com/photo-1505232458627-a72726f5b712?auto=format&fit=crop&q=100&w=3840", alt: "Kır düğünü" },
    { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=100&w=3840", alt: "Kep atma anı" },
    { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=100&w=3840", alt: "Düğün dans pisti" },
    { url: "https://images.unsplash.com/photo-1522158673376-3c7370222067?auto=format&fit=crop&q=100&w=3840", alt: "Konser grubu" },
    { url: "https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&q=100&w=3840", alt: "Konferans konuşması" }
  ],
  layer3: [
    { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=100&w=3840", alt: "Dış çekim fotoğrafı" },
    { url: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=100&w=3840", alt: "Düğün hazırlığı" }
  ]
};

const HOW_IT_WORKS = [
  { id: "01", title: "Fotoğraflar Çekilsin", desc: "Etkinlikte çekilen binlerce fotoğraf, organizatör veya fotoğrafçı tarafından tek tıkla sisteme yüklenir." },
  { id: "02", title: "Yapay Zeka Tarasın", desc: "Gelişmiş yüz tanıma algoritmamız tüm fotoğrafları saniyeler içinde analiz eder ve yüzleri eşleştirir." },
  { id: "03", title: "Anında Eşleşin", desc: "Sadece bir selfie çekerek, bulunduğunuz tüm fotoğrafları anında galerinizde görün ve indirin." }
];

const TESTIMONIALS = [
  { name: "Melis K.", role: "Düğün Misafiri", content: "Düğünde çekilen fotoğraflarımı bulmak için haftalarca beklememe gerek kalmadı. Sadece bir selfie çektim ve hepsi karşımdaydı!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
  { name: "Can T.", role: "Etkinlik Organizatörü", content: "Misafirlerimize sunduğumuz bu deneyim etkinliğimizin kalitesini bir üst seviyeye taşıdı. Kesinlikle her etkinlikte kullanacağız.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150" },
  { name: "Selin A.", role: "Üniversite Mezunu", content: "Mezuniyet töreninde binlerce kişi arasından kendi fotoğraflarımı saniyeler içinde bulmak sihir gibiydi.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" }
];

// --- Subcomponents ---

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestCode, setGuestCode] = useState("");
  const { displayed, gradient } = useTypewriterCycle(PERFECT_FOR_WORDS);

  const firstSectionRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: firstSectionRef,
    offset: ["start start", "end end"]
  });
  
  const prefersReducedMotion = useReducedMotion();

  // Grid Zoom calculations
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  const [cellDims, setCellDims] = useState({ width: 300, height: 375 });

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setWindowSize({ width: vw, height: vh });
      
      const gutter = vw > 600 ? 64 : 16;
      const containerWidth = Math.min(1800, vw - 2 * gutter);
      
      let gap = vw * 0.03;
      if (gap < 8) gap = 8;
      if (gap > 40) gap = 40;
      
      const cols = vw > 900 ? 7 : (vw > 600 ? 5 : 3);
      const cellW = (containerWidth - (cols - 1) * gap) / cols;
      const cellH = cellW * 1.25; 
      setCellDims({ width: cellW, height: cellH });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const easeSine = cubicBezier(0.61, 1, 0.88, 1);
  const easePower1 = cubicBezier(0.42, 0, 0.58, 1);
  const easePower3 = cubicBezier(0.76, 0, 0.24, 1);
  const easePower4 = cubicBezier(0.87, 0, 0.13, 1);

  const width = useTransform(heroProgress, [0, 0.8], [`${windowSize.width}px`, `${cellDims.width}px`], { ease: easePower1 });
  const height = useTransform(heroProgress, [0, 0.8], [`${windowSize.height}px`, `${cellDims.height}px`], { ease: easePower1 });

  const opacityL1 = useTransform(heroProgress, [0, 0.55, 0.8], [0, 0, 1], { ease: easeSine });
  const scaleL1 = useTransform(heroProgress, [0, 0.3, 0.8], [0, 0, 1], { ease: easePower1 });
  const opacityL2 = useTransform(heroProgress, [0, 0.55, 0.85], [0, 0, 1], { ease: easeSine });
  const scaleL2 = useTransform(heroProgress, [0, 0.3, 0.85], [0, 0, 1], { ease: easePower3 });
  const opacityL3 = useTransform(heroProgress, [0, 0.55, 0.9], [0, 0, 1], { ease: easeSine });
  const scaleL3 = useTransform(heroProgress, [0, 0.3, 0.9], [0, 0, 1], { ease: easePower4 });

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (guestCode.trim().length > 3) {
      navigate(`/guest/${guestCode.trim()}`);
    }
  };

  // Sticky Scroll Logic
  const stickyRef = useRef(null);
  const { scrollYProgress: stickyProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"]
  });

  const [activeStep, setActiveStep] = useState(0);

  useMotionValueEvent(stickyProgress, "change", (latest) => {
    if (latest < 0.33) setActiveStep(0);
    else if (latest < 0.66) setActiveStep(1);
    else setActiveStep(2);
  });

  return (
    <div className="scroll-wrap font-sans overflow-x-hidden selection:bg-[var(--accent-blue-button)] selection:text-white bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      
      {/* Dynamic Background Overlays (Subtle, matching panel aesthetics) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-blue-dark)] opacity-[0.03] blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[var(--color-blue-dark)] opacity-[0.03] blur-[150px] pointer-events-none z-0" />

      {/* Floating Apple-Style Header */}
      <header className="fixed top-6 inset-x-6 max-w-[1280px] mx-auto z-50 flex items-center justify-between p-4 rounded-[24px] bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)] text-[var(--text-main)]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <span className="font-extrabold text-[1.25rem] tracking-tight text-[var(--text-main)] select-none">
            Snapmatch
          </span>
        </div>

        <nav className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => navigate("/about")}
            className="text-[0.82rem] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            Hakkımızda
          </button>
          <button
            onClick={() => navigate("/services")}
            className="text-[0.82rem] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            Hizmetlerimiz
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="text-[0.82rem] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            İletişim
          </button>
          <button
            onClick={() => navigate("/faq")}
            className="text-[0.82rem] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            S.S.S.
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-[0.82rem] py-2 px-5 font-bold rounded-xl bg-[var(--color-blue-dark)] hover:opacity-90 text-white shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 border-none"
          >
            <Lock size={14} />
            <span>Giriş Yap</span>
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setGuestModalOpen(true)}
            className="px-5 py-2.5 rounded-[14px] bg-[var(--accent-blue-button)] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 border-none"
          >
            Kodu Girin
          </motion.button>
        </div>
      </header>

      <main className="relative z-10 pt-40 md:pt-48">
        
        {/* HERO SECTION WITH TYPEWRITER */}
        <section className="max-w-7xl mx-auto px-6 pb-12 text-center flex flex-col items-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-main)] max-w-5xl leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.15 }}
          >
            Binlerce fotoğraf. <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient} min-h-[1.2em] inline-block py-1`}>
              {displayed}
              <span className="text-[var(--glass-border)] font-light opacity-50 ml-1">|</span>
            </span> <br />
            sadece siz.
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.35 }}
          >
            Yapay zeka ile fotoğraflarınızı anında bulun. Görmek için aşağı kaydırın.
          </motion.p>
        </section>

        {/* 3D SCROLL GRID (Gallery) */}
        <section className="scroll-section-first" ref={firstSectionRef}>
          <div className="scroll-content">
            <div className="scroll-grid">
              <motion.div className="scroll-layer" style={prefersReducedMotion ? {} : { opacity: opacityL1, scale: scaleL1 }}>
                {gridPhotos.layer1.map((item, idx) => (
                  <div key={`l1-${idx}`}>
                    <img src={item.url} alt={item.alt} />
                  </div>
                ))}
              </motion.div>
              <motion.div className="scroll-layer" style={prefersReducedMotion ? {} : { opacity: opacityL2, scale: scaleL2 }}>
                {gridPhotos.layer2.map((item, idx) => (
                  <div key={`l2-${idx}`}>
                    <img src={item.url} alt={item.alt} />
                  </div>
                ))}
              </motion.div>
              <motion.div className="scroll-layer" style={prefersReducedMotion ? {} : { opacity: opacityL3, scale: scaleL3 }}>
                {gridPhotos.layer3.map((item, idx) => (
                  <div key={`l3-${idx}`}>
                    <img src={item.url} alt={item.alt} />
                  </div>
                ))}
              </motion.div>
              <div className="scroll-scaler-cell">
                <div className="scroll-scaler-wrapper">
                  <motion.img
                    src={gridPhotos.scaler.url}
                    alt={gridPhotos.scaler.alt}
                    style={prefersReducedMotion ? {} : { width, height }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIA-STYLE STICKY SCROLL: HOW IT WORKS */}
        <section className="relative w-full max-w-[1400px] mx-auto px-6 py-20 mt-10 md:mt-32">
          
          <div className="text-center mb-16 md:hidden">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-[var(--text-main)]">Nasıl Çalışır?</h2>
          </div>

          <div ref={stickyRef} className="relative h-[250vh]">
            <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center justify-center gap-12 pt-16 pb-10">
              
              {/* Left Side: Navigation / Text */}
              <div className="w-full md:w-5/12 flex flex-col gap-4 md:gap-12 justify-center z-10">
                <div className="hidden md:block mb-4 md:mb-8 h-[80px] md:h-[120px] relative">
                  <AnimatePresence mode="wait">
                    <motion.h2 
                      key={activeStep}
                      initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="text-3xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-main)] absolute inset-0 leading-tight"
                    >
                      {activeStep === 0 && <>Fotoğrafları yükler,<br/>saniyeler sürer.</>}
                      {activeStep === 1 && <>Yüzleri tarar,<br/>herkesi tanır.</>}
                      {activeStep === 2 && <>Sizi bulur,<br/>anında eşleştirir.</>}
                    </motion.h2>
                  </AnimatePresence>
                </div>

                <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible no-scrollbar snap-x gap-4 md:gap-0 pb-4 md:pb-0">
                  {HOW_IT_WORKS.map((step, idx) => {
                    const isActive = activeStep === idx;
                    const isPast = activeStep > idx;
                    return (
                      <div 
                        key={step.id} 
                        className={`relative pl-4 md:pl-8 py-2 md:py-6 cursor-pointer transition-all duration-500 border-l-0 border-t-4 md:border-t-0 md:border-l-4 min-w-[200px] md:min-w-0 snap-start ${
                          isActive ? 'border-[var(--color-blue-dark)] opacity-100' : 
                          isPast ? 'border-[var(--color-blue-dark)] opacity-30' : 
                          'border-[var(--glass-border)] opacity-30'
                        }`}
                        onClick={() => setActiveStep(idx)}
                      >
                        <span className={`block font-mono text-[10px] md:text-sm mb-1 md:mb-3 transition-colors duration-300 ${isActive ? 'text-[var(--color-blue-dark)]' : 'text-[var(--text-muted)]'}`}>
                          {step.id}
                        </span>
                        <h3 className={`text-base md:text-2xl font-bold mb-1 md:mb-3 transition-all duration-300 ${isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                          {step.title}
                        </h3>
                        <div className={`grid transition-all duration-500 overflow-hidden ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <p className="min-h-0 text-xs md:text-base text-[var(--text-muted)] leading-relaxed md:max-w-sm hidden md:block">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Dynamic Visual / Mockup */}
              <div className="w-full md:w-7/12 h-[300px] md:h-[600px] flex items-center justify-center relative flex-shrink-0">
                <div className="w-full h-full rounded-[1.5rem] md:rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] shadow-[var(--glass-shadow)] overflow-hidden backdrop-blur-xl p-1.5 md:p-2 flex flex-col">
                  {/* Browser Mockup Header */}
                  <div className="flex items-center px-3 py-2 md:px-4 md:py-3 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                    <div className="flex gap-1.5 md:gap-2 mr-3 md:mr-4">
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400/80"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400/80"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <div className="flex-1 bg-[var(--glass-bg-strong)] rounded-md py-1 px-3 text-[10px] md:text-xs text-center text-[var(--text-muted)] border border-[var(--glass-border)] truncate">
                      snapmatch.com/event/demo
                    </div>
                  </div>
                  
                  {/* Mockup Content area - Switches based on active step */}
                  <div className="flex-1 bg-[var(--bg-main)] relative overflow-hidden flex items-center justify-center p-4 md:p-6">
                    <AnimatePresence mode="wait">
                      {activeStep === 0 && (
                        <motion.div 
                          key="step0"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full flex flex-col items-center justify-center"
                        >
                          <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full max-w-sm h-48 md:h-64 p-3 md:p-4 rounded-xl border border-dashed border-[var(--color-blue-dark)] bg-[var(--glass-bg)]">
                             <div className="bg-gray-200/50 rounded-lg flex items-center justify-center"><ImageIcon className="text-gray-400 opacity-50 w-5 h-5 md:w-6 md:h-6" /></div>
                             <div className="bg-gray-200/50 rounded-lg flex items-center justify-center"><ImageIcon className="text-gray-400 opacity-50 w-5 h-5 md:w-6 md:h-6" /></div>
                             <div className="bg-gray-200/50 rounded-lg flex items-center justify-center"><ImageIcon className="text-gray-400 opacity-50 w-5 h-5 md:w-6 md:h-6" /></div>
                             <div className="bg-gray-200/50 rounded-lg flex items-center justify-center"><ImageIcon className="text-gray-400 opacity-50 w-5 h-5 md:w-6 md:h-6" /></div>
                             <div className="col-span-2 bg-[var(--color-blue-dark)]/10 rounded-lg flex flex-col items-center justify-center border border-[var(--color-blue-dark)]/30">
                               <Camera className="text-[var(--color-blue-dark)] mb-1 md:mb-2 w-6 h-6 md:w-8 md:h-8" />
                               <span className="text-[var(--color-blue-dark)] font-medium text-xs md:text-sm">Yükleniyor...</span>
                             </div>
                          </div>
                        </motion.div>
                      )}

                      {activeStep === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full flex flex-col items-center justify-center"
                        >
                          <div className="relative">
                            <div className="absolute -inset-6 md:-inset-8 rounded-full blur-2xl md:blur-3xl animate-pulse" style={{ backgroundColor: 'var(--color-blue-dark)', opacity: 0.2 }} />
                            <div className="w-28 h-28 md:w-48 md:h-48 rounded-full border-4 border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-center relative z-10 shadow-2xl overflow-hidden backdrop-blur-md">
                               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" alt="Face scan" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 border-t-4 animate-scan pointer-events-none" style={{ borderTopColor: 'var(--color-blue-dark)', background: 'linear-gradient(to bottom, rgba(92,112,149,0.3) 0%, transparent 100%)', backgroundSize: '100% 200%' }} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeStep === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full flex flex-col items-center justify-center"
                        >
                           <div className="w-full max-w-[280px] md:max-w-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-4 md:p-6 shadow-xl text-center">
                              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                                <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                              </div>
                              <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-[var(--text-main)]">Eşleşme Tamamlandı!</h3>
                              <p className="text-[var(--text-muted)] text-xs md:text-sm mb-4 md:mb-6">Etkinlikten 34 fotoğrafınız bulundu.</p>
                              <div className="grid grid-cols-2 gap-2">
                                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=200" className="w-full h-16 md:h-24 object-cover rounded-lg" alt="Result 1" />
                                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200" className="w-full h-16 md:h-24 object-cover rounded-lg" alt="Result 2" />
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID (Built for how you actually work / Testimonials) */}
        <section className="max-w-[1400px] mx-auto px-6 py-20 mt-10 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-[var(--text-main)]">Neden SnapMatch?</h2>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[300px]">
            {/* Bento Item 1: Large Testimonial */}
            <FadeIn delay={0.1} className="md:col-span-2 md:row-span-1 rounded-[24px] bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-[var(--glass-shadow-soft)] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-blue-dark)] opacity-[0.05] blur-[80px] rounded-full pointer-events-none" />
              <p className="text-[var(--text-main)] italic mb-8 relative leading-relaxed text-xl md:text-2xl font-medium">
                <span className="text-6xl absolute -top-6 -left-4 font-serif opacity-20 text-[var(--color-blue-dark)]">"</span>
                {TESTIMONIALS[0].content}
              </p>
              <div className="flex items-center gap-4 mt-auto relative z-10">
                <img src={TESTIMONIALS[0].avatar} alt={TESTIMONIALS[0].name} className="w-14 h-14 rounded-full object-cover border-2 border-[var(--glass-border)]" />
                <div>
                  <h4 className="font-bold text-base text-[var(--text-main)]">{TESTIMONIALS[0].name}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{TESTIMONIALS[0].role}</p>
                </div>
              </div>
            </FadeIn>

            {/* Bento Item 2: Feature / Security */}
            <FadeIn delay={0.2} className="md:col-span-1 md:row-span-1 rounded-[24px] bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] shadow-[var(--glass-shadow-soft)] p-8 flex flex-col items-start justify-center backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-[var(--color-blue-dark)]/10 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[var(--color-blue-dark)]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--text-main)]">Gizlilik Odaklı</h3>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                Fotoğraflarınız yalnızca yüzünüzle eşleştiğinde size gösterilir. Kişisel verileriniz asla dışarıyla paylaşılmaz.
              </p>
            </FadeIn>

            {/* Bento Item 3: Secondary Testimonial */}
            <FadeIn delay={0.3} className="md:col-span-1 md:row-span-1 rounded-[24px] bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] shadow-[var(--glass-shadow-soft)] p-8 flex flex-col justify-between backdrop-blur-md">
              <p className="text-[var(--text-main)] italic mb-6 leading-relaxed text-base">
                <span className="text-5xl absolute -top-4 -left-2 font-serif opacity-20 text-[var(--color-blue-dark)] relative inline-block leading-none">"</span>
                {TESTIMONIALS[1].content}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <img src={TESTIMONIALS[1].avatar} alt={TESTIMONIALS[1].name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-main)]">{TESTIMONIALS[1].name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{TESTIMONIALS[1].role}</p>
                </div>
              </div>
            </FadeIn>

            {/* Bento Item 4: Another Feature or Testimonial */}
            <FadeIn delay={0.4} className="md:col-span-2 md:row-span-1 rounded-[24px] bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-[var(--glass-shadow-soft)] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 backdrop-blur-md overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-blue-dark)]/5 to-transparent pointer-events-none" />
              <div className="flex-1 relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-main)]">Hızlı ve Sınırsız</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-lg mb-6">
                  Etkinlik türü ne olursa olsun, binlerce misafiri aynı anda tanıyabilir ve anında dağıtım yapabiliriz. 
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[var(--color-blue-dark)]/10 text-[var(--color-blue-dark)] rounded-full text-xs font-semibold">Yüz Tanıma</span>
                  <span className="px-3 py-1 bg-[var(--color-blue-dark)]/10 text-[var(--color-blue-dark)] rounded-full text-xs font-semibold">Sınırsız Kapasite</span>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center relative z-10">
                <div className="w-32 h-32 rounded-full border-8 border-[var(--glass-border)] flex items-center justify-center bg-[var(--glass-bg-strong)] shadow-inner">
                  <Zap className="w-12 h-12 text-[var(--color-blue-dark)]" />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FINAL CTA (DiaBrowser style large block) */}
        <section className="max-w-5xl mx-auto px-6 py-32">
          <FadeIn>
            <div 
              className="relative rounded-[32px] p-12 md:p-24 text-center overflow-hidden border shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
              style={{ backgroundColor: 'var(--surface-dark)', borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-[100px] rounded-full pointer-events-none" 
                style={{ backgroundColor: 'var(--color-blue-dark)', opacity: 0.2 }}
              />
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">Hazır Mısınız?</h2>
                <p className="text-lg md:text-xl mb-12 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Siz de bir sonraki etkinliğinizde misafirlerinize bu kusursuz deneyimi yaşatın.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-12 py-5 rounded-[20px] bg-[var(--accent-blue-button)] text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all border border-white/10 flex items-center gap-3 mx-auto"
                >
                  Ücretsiz Başlayın <ArrowRight size={20} />
                </motion.button>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[var(--text-muted)] text-xl tracking-tight">SnapMatch</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Gizlilik</a>
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Şartlar</a>
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">İletişim</a>
          </div>
          <p className="text-sm text-[var(--text-muted)] opacity-80">© 2026 SnapMatch. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {/* GUEST MODAL */}
      <GlassModal
        open={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        title="Etkinlik Kodunu Girin"
        subtitle="Davetiyenizdeki 6 haneli kodu yazın."
        icon={QrCode}
        width="max-w-md"
      >
        <form onSubmit={handleGuestSubmit} className="space-y-4">
          <input
            type="text"
            value={guestCode}
            onChange={(e) => setGuestCode(e.target.value)}
            placeholder="Örn: X7B9K2"
            className="w-full bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-lg font-mono text-center tracking-widest focus:outline-none focus:ring-2 shadow-inner uppercase transition-all text-[var(--text-main)]"
            style={{ borderColor: 'var(--glass-border)' }}
            autoFocus
          />
          <button
            type="submit"
            disabled={guestCode.trim().length < 4}
            className="w-full text-white font-bold py-3.5 rounded-xl disabled:opacity-50 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg bg-[var(--accent-blue-button)]"
          >
            Devam Et <ArrowRight size={18} />
          </button>
        </form>
      </GlassModal>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
