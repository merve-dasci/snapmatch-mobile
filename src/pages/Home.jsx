import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useReducedMotion,
  cubicBezier,
  AnimatePresence
} from "framer-motion";
import { 
  Sparkles, 
  Camera, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Image as ImageIcon,
  Users,
  Lock
} from "lucide-react";
import TiltedCard from "../components/ui/TiltedCard";
import GlassCard from "../components/ui/GlassCard";
import BrowserMockup from "../components/ui/BrowserMockup";
import { mockApi } from "../services/mockApi";

const gridPhotos = {
  scaler: {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=95&w=1200",
    title: "💍 Rüya Gibi Bir Başlangıç",
    alt: "Düğün çifti dansı"
  },
  layer1: [
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=95&w=800", title: "✨ Sonsuz Birliktelik", alt: "Düğün töreni" },
    { url: "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=95&w=800", title: "🎓 Başarı Dolu Yarınlar", alt: "Mezuniyet günü" },
    { url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=95&w=800", title: "🤝 Kurumsal Güç ve Sinerji", alt: "İş toplantısı" },
    { url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=95&w=800", title: "🎉 Ritmin Enerjisi", alt: "Parti eğlencesi" },
    { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=95&w=800", title: "🌟 Muhteşem Atmosfer", alt: "Etkinlik kalabalığı" },
    { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=95&w=800", title: "🎸 Sahne Işıkları Altında", alt: "Konser gecesi" }
  ],
  layer2: [
    { url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=95&w=800", title: "💬 Keyifli Sohbetler", alt: "Etkinlik davetlileri" },
    { url: "https://images.unsplash.com/photo-1505232458627-a72726f5b712?auto=format&fit=crop&q=95&w=800", title: "🌸 Bahar Düğünü Detayları", alt: "Kır düğünü" },
    { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=95&w=800", title: "🎓 Heyecan Dolu Mezunlar", alt: "Kep atma anı" },
    { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=95&w=800", title: "🕺 Eğlencenin Doruk Noktası", alt: "Düğün dans pisti" },
    { url: "https://images.unsplash.com/photo-1522158673376-3c7370222067?auto=format&fit=crop&q=95&w=800", title: "🎤 Canlı Müzik Dinamikleri", alt: "Konser grubu" },
    { url: "https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&q=95&w=800", title: "🎙️ Değerli Paylaşımlar", alt: "Konferans konuşması" }
  ],
  layer3: [
    { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=95&w=800", title: "🗼 Aşkın Başkenti", alt: "Dış çekim fotoğrafı" },
    { url: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=95&w=800", title: "💖 Mutlu Anlar, Gülen Yüzler", alt: "Düğün hazırlığı" }
  ]
};

const demoPhotos = [
  { id: "d1", title: "💍 Rüya Gibi Bir Başlangıç", alt: "Düğün çifti", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=95&w=600", guests: ["selin", "mert"], bboxClass: "top-[20%] left-[30%] w-[25%] h-[25%]" },
  { id: "d2", title: "🎓 Heyecan Dolu Mezunlar", alt: "Kep atma", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=95&w=600", guests: ["melis", "upload"], bboxClass: "top-[25%] left-[40%] w-[25%] h-[25%]" },
  { id: "d3", title: "🎸 Sahne Işıkları Altında", alt: "Konser", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=95&w=600", guests: ["can", "mert", "upload"], bboxClass: "top-[15%] left-[25%] w-[25%] h-[25%]" },
  { id: "d4", title: "🌸 Bahar Düğünü Detayları", alt: "Kır düğünü", url: "https://images.unsplash.com/photo-1505232458627-a72726f5b712?auto=format&fit=crop&q=95&w=600", guests: ["selin"], bboxClass: "top-[22%] left-[38%] w-[25%] h-[25%]" },
  { id: "d5", title: "🕺 Eğlencenin Doruk Noktası", alt: "Parti", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=95&w=600", guests: ["melis", "can"], bboxClass: "top-[20%] left-[45%] w-[25%] h-[25%]" },
  { id: "d6", title: "🤝 Kurumsal Güç ve Sinerji", alt: "Toplantı", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=95&w=600", guests: ["mert"], bboxClass: "top-[18%] left-[32%] w-[25%] h-[25%]" },
  { id: "d7", title: "🎓 Başarı Dolu Yarınlar", alt: "Mezuniyet kızları", url: "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=95&w=600", guests: ["selin", "melis"], bboxClass: "top-[20%] left-[28%] w-[25%] h-[25%]" },
  { id: "d8", title: "🗼 Aşkın Başkenti", alt: "Dış çekim", url: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=95&w=600", guests: ["can", "upload"], bboxClass: "top-[25%] left-[35%] w-[25%] h-[25%]" }
];

// ─── PerfectForSection ────────────────────────────────────────────────────────

const PERFECT_FOR_WORDS = [
  { text: "düğünler",          gradient: "linear-gradient(90deg, #8B5CF6, #EC4899)" },
  { text: "mezuniyet geceleri", gradient: "linear-gradient(90deg, #EC4899, #f97316)" },
  { text: "kurumsal etkinlikler", gradient: "linear-gradient(90deg, #3B82F6, #8B5CF6)" },
  { text: "festival anları",   gradient: "linear-gradient(90deg, #f97316, #EF4444)" },
  { text: "gece partileri",    gradient: "linear-gradient(90deg, #EC4899, #8B5CF6)" },
  { text: "okul törenleri",    gradient: "linear-gradient(90deg, #10b981, #3B82F6)" },
];

const PERFECT_FOR_CARDS = [
  {
    tag: "Düğün & Tören",
    title: "Düğün & Kutlamalar",
    desc: "Davetliler fotoğrafçıya sormadan fotoğraflarını bulur.",
    src: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=700&h=520",
    accent: "#8B5CF6",
  },
  {
    tag: "Gece Hayatı",
    title: "Gece Partileri & Kulüpler",
    desc: "After-party galeriniz kendiliğinden oluşsun.",
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=700&h=520",
    accent: "#EC4899",
  },
  {
    tag: "Festival",
    title: "Festival & Müzik Etkinlikleri",
    desc: "Binlerce fotoğraf arasından yalnızca sizinkiler.",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=700&h=520",
    accent: "#3B82F6",
  },
];

function useTypewriterCycle(words, typingSpeed = 100, deletingSpeed = 60, pauseMs = 2000) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex].text;
    let timer;

    if (!isDeleting) {
      if (displayed !== word) {
        timer = setTimeout(() => {
          setDisplayed(word.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseMs);
      }
    } else {
      if (displayed !== "") {
        timer = setTimeout(() => {
          setDisplayed(word.slice(0, displayed.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return { displayed, gradient: words[wordIndex].gradient };
}

function PerfectForSection() {
  const { displayed, gradient } = useTypewriterCycle(PERFECT_FOR_WORDS);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", damping: 24, stiffness: 120 }}
      style={{
        padding: "80px 0 0",
        width: "100%",
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "#1C1917",
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
          }}
        >
          {"Şunun için mükemmel: "}
          <span
            className="bg-clip-text text-transparent inline-block transition-all duration-300"
            style={{
              backgroundImage: gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {displayed}
          </span>
          <span
            className="inline-block w-0.5 h-[0.9em] align-middle ml-0.5 rounded-sm"
            style={{
              background: gradient,
              animation: "snapmatch-cursor-blink 0.9s step-end infinite",
            }}
          />
        </h2>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {PERFECT_FOR_CARDS.map((card, i) => (
          <motion.div
            key={card.tag}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", damping: 22, stiffness: 140, delay: i * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              aspectRatio: "4/3",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            }}
          >
            {/* Photo */}
            <img
              src={card.src}
              alt={card.title}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* Dark gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Tag pill */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                padding: "4px 10px",
                borderRadius: 99,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
                fontSize: 11,
                fontWeight: 700,
                color: "#1C1917",
                letterSpacing: "0.02em",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {card.tag}
            </div>

            {/* Bottom text */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "16px 18px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.3,
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                {card.title}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.45,
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
              >
                {card.desc}
              </p>
            </div>

            {/* Accent glow on hover */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                border: `2px solid transparent`,
                backgroundClip: "border-box",
                pointerEvents: "none",
                transition: "opacity 0.3s ease",
                boxShadow: `inset 0 0 0 2px ${card.accent}00`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Cursor blink keyframe — injected once */}
      <style>{`
        @keyframes snapmatch-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </motion.section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  
  // Sync page theme with dashboard settings
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "soft-light";
    const classes = [
      "theme-soft-light",
      "theme-midnight",
      "theme-aurora",
      "theme-rose-quartz",
      "theme-forest",
      "theme-amoled-black"
    ];
    document.body.classList.remove(...classes);
    document.body.classList.add(`theme-${savedTheme}`);
  }, []);

  const prefersReducedMotion = useReducedMotion();
  const [eventCode, setEventCode] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // States for interactive AI matching sandbox
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [scanningState, setScanningState] = useState("idle");
  const [activeScanId, setActiveScanId] = useState(null);

  const handleDemoSelect = (guestId) => {
    setScanningState("scanning");
    setActiveScanId(guestId);
    setTimeout(() => {
      setSelectedGuest(guestId);
      setScanningState("done");
      setActiveScanId(null);
    }, 1200);
  };

  const resetDemo = () => {
    setSelectedGuest(null);
    setScanningState("idle");
    setActiveScanId(null);
  };

  // States for interactive 1-2-3 stepper
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);


  // Track viewport dimensions and calculate natural grid cell sizes
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  const [cellDims, setCellDims] = useState({
    width: 300,
    height: 375
  });

  useEffect(() => {
    setEvents(mockApi.getEvents() || []);

    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setWindowSize({ width: vw, height: vh });
      
      // Math to find natural grid cell dimensions
      // Container width matches CSS: min(1600px, 100% - 2 * gutter)
      const gutter = vw > 600 ? 32 : 16;
      const containerWidth = Math.min(1600, vw - 2 * gutter);
      
      // Gap matches CSS: clamp(10px, 5.5vw, 60px)
      let gap = vw * 0.055;
      if (gap < 10) gap = 10;
      if (gap > 60) gap = 60;
      
      // 5 columns on desktop, 3 columns on mobile (max-width: 600px)
      const cols = vw > 600 ? 5 : 3;
      const cellW = (containerWidth - (cols - 1) * gap) / cols;
      const cellH = cellW * 1.25; // aspect-ratio: 4 / 5
      
      setCellDims({ width: cellW, height: cellH });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Auto-rotate steps every 6s unless manually clicked
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev === 3 ? 1 : prev + 1));
      }, 6000);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying]);

  // Set up scroll track reference
  const firstSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: firstSectionRef,
    offset: ["start start", "end end"]
  });

  // GSAP Easing curves translated into framer-motion cubicBeziers
  const easeSine = cubicBezier(0.61, 1, 0.88, 1);    // GSAP sine.out
  const easePower1 = cubicBezier(0.42, 0, 0.58, 1);  // GSAP power1.inOut
  const easePower3 = cubicBezier(0.76, 0, 0.24, 1);  // GSAP power3.inOut
  const easePower4 = cubicBezier(0.87, 0, 0.13, 1);  // GSAP power4.inOut

  // 1. Zoom transformations for the central image (completed at 80% scroll progress)
  const width = useTransform(
    scrollYProgress, 
    [0, 0.8], 
    [`${windowSize.width}px`, `${cellDims.width}px`],
    { ease: easePower1 }
  );
  const height = useTransform(
    scrollYProgress, 
    [0, 0.8], 
    [`${windowSize.height}px`, `${cellDims.height}px`],
    { ease: easePower1 }
  );

  // 2. Layer transformations (opacity and scale) with staggered endpoints
  const opacityL1 = useTransform(scrollYProgress, [0, 0.55, 0.8], [0, 0, 1], { ease: easeSine });
  const scaleL1 = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 0, 1], { ease: easePower1 });

  const opacityL2 = useTransform(scrollYProgress, [0, 0.55, 0.85], [0, 0, 1], { ease: easeSine });
  const scaleL2 = useTransform(scrollYProgress, [0, 0.3, 0.85], [0, 0, 1], { ease: easePower3 });

  const opacityL3 = useTransform(scrollYProgress, [0, 0.55, 0.9], [0, 0, 1], { ease: easeSine });
  const scaleL3 = useTransform(scrollYProgress, [0, 0.3, 0.9], [0, 0, 1], { ease: easePower4 });

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      setError("Lütfen geçerli bir etkinlik kodu girin.");
      return;
    }
    
    const matchedEvent = events.find(
      (ev) => ev.qr_token === eventCode.trim() || ev.id === eventCode.trim()
    );

    if (matchedEvent) {
      setError("");
      navigate(`/guest/${matchedEvent.qr_token || matchedEvent.id}`);
    } else {
      setError("Etkinlik bulunamadı. Lütfen kodu kontrol edin (Örnek: evt_1, evt_2).");
    }
  };

  return (
    <div className="scroll-wrap text-[var(--text-main)]">
      {/* Dynamic Glow Overlays - Soft Violet and Pink, No Blue */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-pink-500/5 blur-[140px] pointer-events-none z-0" />

      {/* Floating Header controls - Deep Liquid Glassmorphism */}
      <header className="fixed top-6 inset-x-6 max-w-[1280px] mx-auto z-50 flex items-center justify-between p-4 rounded-[24px] bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-[var(--glass-shadow)] text-[var(--text-main)]">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[1.25rem] tracking-tight text-[var(--text-main)] select-none">
            Snapmatch
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/login")}
            className="text-[0.82rem] py-2 px-5 font-bold rounded-xl bg-[var(--color-blue-dark)] hover:opacity-90 text-white shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 border-none"
          >
            <Lock size={14} />
            <span>Giriş Yap</span>
          </button>
        </div>
      </header>

      {/* Step 1: Cinematic Intro Screen with Instant Guest Access Form */}
      <div className="scroll-header flex flex-col justify-center">
        <motion.h1 
          className="fluid"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.15 }}
        >
          çek.<br />eşleştir.
        </motion.h1>
        
        <motion.h2 
          className="fluid text-stone-600"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.35 }}
        >
          Yapay zeka ile binlerce etkinlik fotoğrafı arasından sadece kendinizi anında bulun. Görmek için aşağı kaydırın.
        </motion.h2>
      </div>

      {/* Step 2: 3D Scroll Grid Zoom Animation section */}
      <section className="scroll-section-first" ref={firstSectionRef}>
        <div className="scroll-content">
          <div className="scroll-grid">
            
            {/* Layer 1: Outer columns (1 and 5) */}
            <motion.div 
              className="scroll-layer"
              style={prefersReducedMotion ? {} : { opacity: opacityL1, scale: scaleL1 }}
            >
              {gridPhotos.layer1.map((item, idx) => (
                <div key={`l1-${idx}`}>
                  <img 
                    src={item.url} 
                    alt={item.alt} 
                    className="cursor-zoom-in"
                    onClick={() => setSelectedPhoto(item)}
                  />
                </div>
              ))}
            </motion.div>

            {/* Layer 2: Inner columns (2 and 4) */}
            <motion.div 
              className="scroll-layer"
              style={prefersReducedMotion ? {} : { opacity: opacityL2, scale: scaleL2 }}
            >
              {gridPhotos.layer2.map((item, idx) => (
                <div key={`l2-${idx}`}>
                  <img 
                    src={item.url} 
                    alt={item.alt} 
                    className="cursor-zoom-in"
                    onClick={() => setSelectedPhoto(item)}
                  />
                </div>
              ))}
            </motion.div>

            {/* Layer 3: Center Column (Top and Bottom Rows) */}
            <motion.div 
              className="scroll-layer"
              style={prefersReducedMotion ? {} : { opacity: opacityL3, scale: scaleL3 }}
            >
              {gridPhotos.layer3.map((item, idx) => (
                <div key={`l3-${idx}`}>
                  <img 
                    src={item.url} 
                    alt={item.alt} 
                    className="cursor-zoom-in"
                    onClick={() => setSelectedPhoto(item)}
                  />
                </div>
              ))}
            </motion.div>

            {/* Center scaler image - wedding hero */}
            <div className="scroll-scaler-cell">
              <div className="scroll-scaler-wrapper">
                <motion.img
                  src={gridPhotos.scaler.url}
                  alt={gridPhotos.scaler.alt}
                  className="cursor-zoom-in"
                  style={prefersReducedMotion ? {} : { width, height }}
                  onClick={() => setSelectedPhoto(gridPhotos.scaler)}
                />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Step 3: Interactive Marketing Content */}
      <div className="w-full max-w-[1280px] mx-auto z-10 relative flex flex-col gap-24 px-4 py-24 bg-transparent">
        
        {/* Stepper Product Tour: It's as easy as 1, 2, 3 */}
        <div className="flex flex-col gap-10">
          <div className="text-center max-w-[620px] mx-auto flex flex-col gap-2">
            <h2 className="text-[2.2rem] sm:text-[2.8rem] font-black leading-[1.1] text-[var(--text-main)]">
              Her Şey 1, 2, 3 Kadar Kolay.
            </h2>
            <p className="text-[var(--text-muted)] text-[1rem]">
              Karmaşık kurulumlar yok, uygulama yüklemek yok. Herhangi bir kamera veya telefonla anında çalışır.
            </p>
          </div>

          {/* Step Pill Selectors */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap max-w-xl mx-auto w-full">
            {[
              { num: 1, label: "Fotoğrafları Yükle" },
              { num: 2, label: "Bağlantıyı Paylaş" },
              { num: 3, label: "Fotoğraflarını Bul" }
            ].map((step) => {
              const isActive = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => {
                    setActiveStep(step.num);
                    setIsAutoPlaying(false); // Stop autoplay on click
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.82rem] font-bold border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-blue-dark)] text-white border-[var(--color-blue-dark)] shadow-md"
                      : "bg-white/5 text-[var(--text-muted)] border-[var(--glass-border)] hover:border-[var(--color-blue-medium)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isActive ? "bg-white text-[var(--color-blue-dark)]" : "bg-black/10 text-[var(--text-muted)]"
                  }`}>{step.num}</span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stepper Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] p-8 md:p-12 backdrop-blur-xl shadow-[var(--glass-shadow)] relative overflow-hidden text-left min-h-[460px]">
            
            {/* Background glowing gradients */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Column 1: Dynamic Visual Showcase */}
            <div className={`relative w-full flex items-center justify-center ${activeStep === 2 ? "h-auto min-h-[340px] overflow-visible py-2" : "h-[300px] sm:h-[350px] overflow-visible"}`}>
              <AnimatePresence mode="wait">
                
                {/* Step 1 Visual: Polaroid Card Fan Stack */}
                {activeStep === 1 && (
                  <motion.div
                    key="step-1-visual"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="flex justify-center items-center gap-1 sm:gap-2 relative w-full h-full"
                  >
                    {[
                      { id: "f1", rotate: -16, y: 24, x: 24, url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300", tag: "💍 Düğün" },
                      { id: "f2", rotate: -8, y: 8, x: 12, url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300", tag: "✨ Davet" },
                      { id: "f3", rotate: 0, y: 0, x: 0, url: "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=80&w=300", tag: "🎓 Mezuniyet" },
                      { id: "f4", rotate: 8, y: 8, x: -12, url: "https://images.unsplash.com/photo-1505232458627-a72726f5b712?auto=format&fit=crop&q=80&w=300", tag: "🌸 Kır Düğünü" },
                      { id: "f5", rotate: 16, y: 24, x: -24, url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=300", tag: "🕺 Parti" }
                    ].map((card, idx) => (
                      <motion.div
                        key={card.id}
                        whileHover={{ scale: 1.15, rotate: 0, y: -20, zIndex: 50, transition: { duration: 0.2 } }}
                        style={{
                          transform: `rotate(${card.rotate}deg) translateY(${card.y}px) translateX(${card.x}px)`,
                          zIndex: 10 + idx
                        }}
                        className="absolute bg-white p-2.5 pb-6 rounded-xl border border-black/10 shadow-lg w-[95px] h-[120px] sm:w-[130px] sm:h-[160px] cursor-pointer transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                      >
                        <div className="w-full h-[80%] rounded-lg overflow-hidden bg-black/5">
                          <img src={card.url} alt="Fan Item" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-stone-800 text-[7px] sm:text-[9px] font-bold text-center mt-2 tracking-wide uppercase">{card.tag}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Step 2 Visual: macOS Safari browser mockup – Snapmatch guest gallery */}
                {activeStep === 2 && (
                  <motion.div
                    key="step-2-visual"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full flex items-center justify-center"
                  >
                    <BrowserMockup />
                  </motion.div>
                )}

                {/* Step 3 Visual: Live Working Guest Access Form */}
                {activeStep === 3 && (
                  <motion.div
                    key="step-3-visual"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full max-w-[340px]"
                  >
                    <div className="p-6 border border-[var(--glass-border)] shadow-xl bg-[var(--glass-bg-strong)] rounded-[24px] text-left text-[var(--text-main)]">
                      <h3 className="text-[0.95rem] font-bold mb-3 flex items-center gap-1.5 text-[var(--text-main)]">
                        <QrCode size={18} className="text-purple-600" />
                        <span>Misafir Girişi: Etkinliğe Katıl</span>
                      </h3>
                      
                      <form onSubmit={handleGuestSubmit} className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Etkinlik Kodu Girin (Örn: evt_1, evt_2)"
                            value={eventCode}
                            onChange={(e) => {
                              setEventCode(e.target.value);
                              if (error) setError("");
                            }}
                            className="flex-grow rounded-xl border border-[var(--glass-border)] bg-white/5 px-4 py-2.5 text-[0.88rem] focus:outline-none focus:border-[var(--color-blue-dark)] text-[var(--text-main)] placeholder-[var(--text-muted)] transition-colors"
                          />
                          <button
                            type="submit"
                            className="shrink-0 rounded-xl px-5 bg-[var(--color-blue-dark)] hover:opacity-90 text-white font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-1 cursor-pointer border-none shadow-md"
                          >
                            <span>Katıl</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                        {error && (
                          <p className="text-red-600 text-[0.75rem] font-bold m-0">{error}</p>
                        )}
                        <p className="text-[0.75rem] text-[var(--text-muted)] m-0 leading-normal">
                          Fotoğrafçınızın paylaştığı QR kodu tarayabilir ya da size verilen 5 haneli etkinlik kodunu yazarak anında kendi fotoğraflarınızı sorgulayabilirsiniz.
                        </p>
                      </form>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Column 2: Dynamic Description Panel */}
            <div className="flex flex-col gap-5 justify-center text-left">
              <AnimatePresence mode="wait">
                
                {/* Step 1 Description */}
                {activeStep === 1 && (
                  <motion.div
                    key="step-1-desc"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[0.78rem] font-bold self-start border border-purple-500/20">
                      <Sparkles size={14} />
                      <span>Adım 1: Toplu Yükleme</span>
                    </div>
                    
                    <h3 className="text-[1.5rem] font-black text-[var(--text-main)] leading-tight">
                      Sürükleyin, Bırakın, AI Yüklesin.
                    </h3>
                    
                    <p className="text-[var(--text-muted)] text-[0.9rem] leading-[1.6]">
                      Fotoğrafçı olarak etkinlikte çektiğiniz yüzlerce fotoğrafı doğrudan panele yükleyin. AI motorumuz fotoğrafları otomatik olarak işler; kırpma, sıkıştırma ya da elle ayıklama yapmanız gerekmez.
                    </p>

                    <button
                      onClick={() => navigate("/login")}
                      className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[0.82rem] font-bold self-start transition-all duration-200 shadow-lg shadow-purple-600/20 active:scale-[0.98] cursor-pointer border-none"
                    >
                      <span>Fotoğrafçı Olarak Kaydol</span>
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}

                {/* Step 2 Description */}
                {activeStep === 2 && (
                  <motion.div
                    key="step-2-desc"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[0.78rem] font-bold self-start border border-purple-500/20">
                      <Sparkles size={14} />
                      <span>Adım 2: Hızlı Paylaşım</span>
                    </div>
                    
                    <h3 className="text-[1.5rem] font-black text-[var(--text-main)] leading-tight">
                      Giriş Kodunu veya QR'ı Dağıtın.
                    </h3>
                    
                    <p className="text-[var(--text-muted)] text-[0.9rem] leading-[1.6]">
                      Sistem, etkinliğiniz için özel bir giriş QR kodu ve 5 haneli erişim kodu üretir. Davetlilerin telefon kamerasıyla taratması veya bu kodu girmesi yeterlidir.
                    </p>

                    <button
                      onClick={() => navigate("/login")}
                      className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[0.82rem] font-bold self-start transition-all duration-200 shadow-lg shadow-purple-600/20 active:scale-[0.98] cursor-pointer border-none"
                    >
                      <span>Yeni Etkinlik Oluştur</span>
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}

                {/* Step 3 Description */}
                {activeStep === 3 && (
                  <motion.div
                    key="step-3-desc"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[0.78rem] font-bold self-start border border-purple-500/20">
                      <Sparkles size={14} />
                      <span>Adım 3: Selfie Arama</span>
                    </div>
                    
                    <h3 className="text-[1.5rem] font-black text-[var(--text-main)] leading-tight">
                      Yüzünü Tara, Fotoğraflarını İndir.
                    </h3>
                    
                    <p className="text-[var(--text-muted)] text-[0.9rem] leading-[1.6]">
                      Katılımcılar sisteme bir selfie yükler. AI motorumuz fotoğraflar arasından davetlinin olduğu kareleri saniyeler içinde bulur ve kişiye özel albüm olarak teslim eder.
                    </p>

                    <span className="text-[0.78rem] text-[var(--text-muted)] italic font-bold">
                      Aşağıdaki canlı test alanından Selin veya Mert'i seçip AI eşleşmesini izleyebilirsiniz!
                    </span>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
            
          </div>
        </div>




        {/* Interactive AI Matching Sandbox */}
        <section id="demo-sandbox" className="flex flex-col gap-10 py-8 border-t border-[var(--glass-border)] pt-16">
          <div className="text-center max-w-[620px] mx-auto flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[0.78rem] font-bold self-center border border-purple-500/20 mb-1">
              <Sparkles size={14} />
              <span>Etkileşimli Canlı Deneyim</span>
            </div>
            <h2 className="text-[1.8rem] font-extrabold text-[var(--text-main)]">AI Yüz Eşleştirmeyi Canlı Dene</h2>
            <p className="text-[var(--text-muted)] text-[0.92rem]">
              Bir davetlinin üzerine tıklayarak yüz eşleştirme algoritmasını gerçek zamanlı deneyimleyin. AI motorumuzun fotoğrafları saniyeler içinde nasıl ayıkladığını canlı izleyin.
            </p>
          </div>

          <div className="p-6 md:p-8 border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-[var(--glass-shadow)] backdrop-blur-xl rounded-[32px] flex flex-col gap-8">
            
            {/* Guest Selector Row */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-[0.78rem] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                {scanningState === "scanning" ? "YAPAY ZEKA YÜZ TARAMASI BAŞLATILDI..." : "Aşağıdaki davetlilerden birini seçin:"}
              </span>
              
              <div className="flex flex-wrap justify-center items-center gap-6">
                {[
                  { id: "selin", name: "Selin", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=95&w=150" },
                  { id: "mert", name: "Mert", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=95&w=150" },
                  { id: "melis", name: "Melis", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=95&w=150" },
                  { id: "can", name: "Can", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=95&w=150" }
                ].map((guest) => {
                  const isSelected = selectedGuest === guest.id;
                  const isScanningThis = scanningState === "scanning" && activeScanId === guest.id;
                  return (
                    <button
                      key={guest.id}
                      onClick={() => handleDemoSelect(guest.id)}
                      disabled={scanningState === "scanning"}
                      className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent outline-none relative"
                    >
                      <div className={`relative rounded-full overflow-hidden w-[72px] h-[72px] ring-2 transition-all duration-300 ${isSelected ? "ring-purple-500 scale-105" : "ring-[var(--glass-border)] group-hover:ring-purple-500 group-hover:scale-105"}`}>
                        <img src={guest.img} alt={guest.name} className="w-full h-full object-cover" />
                        
                        {/* Scanning Laser Line Overlay */}
                        {isScanningThis && (
                          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-[1px] flex flex-col justify-between overflow-hidden">
                            <motion.div
                              animate={{ y: [0, 72, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                              className="w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"
                            />
                          </div>
                        )}
                      </div>
                      <span className={`text-[0.82rem] font-bold transition-colors ${isSelected ? "text-purple-600" : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"}`}>{guest.name}</span>
                    </button>
                  );
                })}
 
                <div className="w-px h-12 bg-[var(--glass-border)] hidden sm:block" />
 
                {/* Simulated Webcam Action Button */}
                <button
                  onClick={() => handleDemoSelect("upload")}
                  disabled={scanningState === "scanning"}
                  className={`flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent outline-none ${selectedGuest === "upload" ? "text-purple-600" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                >
                  <div className={`relative rounded-full overflow-hidden w-[72px] h-[72px] ring-2 flex items-center justify-center transition-all duration-300 ${selectedGuest === "upload" ? "ring-purple-500 scale-105 bg-purple-500/20" : "ring-[var(--glass-border)] bg-white/5 group-hover:ring-purple-500 group-hover:scale-105 group-hover:bg-white/10"}`}>
                    <Camera size={24} className="text-[var(--text-main)]" />
                    {scanningState === "scanning" && activeScanId === "upload" && (
                      <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-[1px] flex flex-col justify-between overflow-hidden">
                        <motion.div
                          animate={{ y: [0, 72, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-[0.82rem] font-bold">Kendi Yüzünü Tara</span>
                </button>
              </div>

              {selectedGuest && (
                <button
                  onClick={resetDemo}
                  className="mt-2 text-[0.78rem] text-pink-600 hover:text-pink-700 font-bold border border-pink-600/20 hover:border-pink-600/30 px-3.5 py-1.5 rounded-full bg-pink-500/5 transition-colors cursor-pointer"
                >
                  Filtreyi Temizle
                </button>
              )}
            </div>

            {/* Simulated Live Gallery Grid */}
            <div className="relative">
              {/* Scan Banner / Status Overlay */}
              <AnimatePresence>
                {scanningState === "scanning" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="absolute inset-0 z-30 bg-[var(--glass-bg-strong)] backdrop-blur-sm rounded-[24px] flex flex-col items-center justify-center gap-4 border border-[var(--glass-border)]"
                  >
                    <div className="relative w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-t-purple-500 border-r-purple-500"
                      />
                      <Cpu size={24} className="text-purple-600" />
                    </div>
                    <div className="text-center">
                      <strong className="text-[0.95rem] text-[var(--text-main)] block">AI Yüz Tanıma Analizi Yapılıyor...</strong>
                      <span className="text-[0.78rem] text-[var(--text-muted)] mt-1 block">Fotoğraf veritabanındaki 153 nokta eşleştiriliyor</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Demo Gallery Grid */}
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[360px]"
              >
                {demoPhotos
                  .filter((photo) => !selectedGuest || photo.guests.includes(selectedGuest))
                  .map((photo) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      key={photo.id}
                      onClick={() => setSelectedPhoto({ url: photo.url, title: photo.title, alt: photo.alt })}
                      className="relative aspect-[4/5] rounded-[18px] overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] cursor-zoom-in group shadow-md"
                    >
                      <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      
                      {/* Sub-label banner */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-[var(--glass-bg-strong)] text-[var(--text-main)] text-[10px] font-bold text-left border-t border-[var(--glass-border)] flex items-center justify-between">
                        <span>{photo.title}</span>
                        
                        {/* Little Guest Badge Counters */}
                        <div className="flex gap-1">
                          {photo.guests.map(g => (
                            <span key={g} className="w-3.5 h-3.5 rounded-full bg-black/10 text-[var(--text-muted)] text-[8px] flex items-center justify-center uppercase">{g.substring(0, 1)}</span>
                          ))}
                        </div>
                      </div>

                      {/* Mock AI Bounding Box Overlay if filtered */}
                      {selectedGuest && selectedGuest !== "upload" && (
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Face Match Bounding Box */}
                          <div className={`absolute border-2 border-emerald-500 rounded-md shadow-[0_0_12px_rgba(52,211,153,0.5)] ${
                            photo.bboxClass || "top-[25%] left-[35%] w-[30%] h-[30%]"
                          }`}>
                            <div className="absolute -top-5 left-0 bg-emerald-500 text-white text-[7px] font-black uppercase px-1 rounded flex items-center gap-0.5">
                              <span>Match</span>
                              <span>99.8%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Webcam simulation bounding box */}
                      {selectedGuest === "upload" && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute border-2 border-emerald-500 rounded-md shadow-[0_0_12px_rgba(52,211,153,0.5)] top-[20%] left-[30%] w-[35%] h-[35%]">
                            <div className="absolute -top-5 left-0 bg-emerald-500 text-white text-[7px] font-black uppercase px-1 rounded flex items-center gap-0.5">
                              <span>SİZ</span>
                              <span>99.5%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </motion.div>

              {/* No results */}
              {demoPhotos.filter((photo) => !selectedGuest || photo.guests.includes(selectedGuest)).length === 0 && (
                <div className="p-12 text-center text-[var(--text-muted)] text-[0.88rem]">
                  Eşleşen fotoğraf bulunamadı.
                </div>
              )}
            </div>
          </div>
        </section>



        {/* ── Perfect for... Section ─────────────────────────────────────── */}
        <PerfectForSection />

      </div>

      {/* Footer */}
      <footer className="w-full max-w-[1280px] mx-auto z-10 border-t border-[var(--glass-border)] mt-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.8rem] text-[var(--text-muted)] px-4 bg-transparent">
        <span>© 2026 Snapmatch AI. Tüm hakları saklıdır.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[var(--text-main)] transition-colors">Kullanım Koşulları</a>
          <a href="#" className="hover:text-[var(--text-main)] transition-colors">KVKK & Gizlilik</a>
          <a href="#" className="hover:text-[var(--text-main)] transition-colors">İletişim</a>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-8 cursor-zoom-out"
          >
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer z-50 transition-colors"
              onClick={() => setSelectedPhoto(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </motion.button>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[85vh] rounded-[24px] overflow-hidden border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md flex flex-col cursor-default"
            >
              <img
                src={selectedPhoto.url.replace("&w=800", "&w=2500").replace("&w=1200", "&w=2500")}
                alt={selectedPhoto.alt || "Snapmatch AI Fotoğrafı"}
                className="max-w-full max-h-[70vh] object-contain block mx-auto"
              />
              <div className="p-5 bg-black/60 border-t border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                <div>
                  <h4 className="text-[0.92rem] font-extrabold text-white m-0">{selectedPhoto.title || "Snapmatch AI Fotoğrafı"}</h4>
                  <p className="text-[var(--text-muted)] text-[0.75rem] m-0 mt-0.5">Yüksek Çözünürlüklü 4K Orijinal Görüntü</p>
                </div>
                <a
                  href={selectedPhoto.url.replace("&w=800", "&w=2500").replace("&w=1200", "&w=2500")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-white/90 text-black text-[0.8rem] font-bold rounded-xl transition-all active:scale-95 shadow-md border-none decoration-none"
                >
                  <span>4K İndir</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
