import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Lock,
  ChevronDown,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import GradientBlob from "../components/ui/GradientBlob";

// FAQ Item component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <GlassCard className="glass-panel mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[var(--text-main)] bg-transparent border-none outline-none cursor-pointer"
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-purple-600 flex-shrink-0"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--glass-border)]/50 pt-3">
          {answer}
        </div>
      </motion.div>
    </GlassCard>
  );
}

export default function Faq() {
  const navigate = useNavigate();

  // Sync theme with dashboard settings on mount
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

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  // FAQ mock data
  const faqs = [
    {
      question: "Yapay zeka yüz eşleştirme teknolojisi nasıl çalışır?",
      answer: "Platformumuza fotoğraf yüklendiğinde, AI motorumuz görüntüdeki yüzleri tarayarak her bir yüzün 153 biyometrik referans noktasını çıkartır. Katılımcı sisteme bir selfie yüklediğinde veya yüzünü tarattığında, bu referans noktaları saniyeler içinde karşılaştırılarak eşleşen tüm fotoğraflar anında listelenir."
    },
    {
      question: "Yüklenen fotoğraflar ve biyometrik veriler ne kadar süre saklanır?",
      answer: "Biyometrik veriler (yüz haritaları) hiçbir zaman kalıcı olarak sunucularımızda saklanmaz; eşleştirme analizi bittiği anda bellekten silinir. Fotoğraflarınız ise etkinliğin ardından organizatörün tercih ettiği paket planına bağlı olarak 30 gün ile 1 yıl arasında güvenle saklanır, ardından kalıcı olarak silinir."
    },
    {
      question: "QR kod erişimi ve fotoğraf indirme süreci güvenli mi?",
      answer: "Evet, son derece güvenlidir. Snapmatch, KVKK ve GDPR direktiflerine %100 uyumludur. Etkinliğe özel üretilen erişim kodları veya QR matrisleri yalnızca yetkilendirilmiş davetlilerin galerilere girmesine izin verir. Her katılımcı sadece kendi fotoğraflarını görebilecek şekilde ayarlanabilir."
    },
    {
      question: "Fotoğrafçılar ve organizatörler için depolama limiti nedir?",
      answer: "Ücretsiz başlangıç paketimiz 2 GB depolama alanı ve 2 aktif etkinlik desteği sunmaktadır. Kurumsal ve Profesyonel paketlerimizde depolama kotaları 100 GB ile sınırsız depolama seçenekleri arasında değişmektedir. Detaylı bilgi için iletişim formu üzerinden bize ulaşabilirsiniz."
    },
    {
      question: "Fotoğraflarımı toplu olarak nasıl indirebilirim?",
      answer: "Etkinlik galerisine kendi yüzünüzle giriş yaptıktan sonra, eşleşen fotoğraflarınız listelenir. Bu fotoğrafları tek tek indirebileceğiniz gibi, 'Tümünü Seç' ve 'Toplu İndir' butonlarını kullanarak orijinal 4K kalitesindeki tüm anılarınızı zip formatında tek seferde indirebilirsiniz."
    },
    {
      question: "Kendi yüzümü yüklemeden fotoğraflara ulaşabilir miyim?",
      answer: "Eğer etkinlik organizatörü genel galeri erişimini açık bıraktıysa, herhangi bir yüz taraması yapmadan tüm galeriyi kronolojik olarak gezinebilirsiniz. Ancak binlerce fotoğraf arasında kendi anlarınızı bulmak için AI yüz tarama özelliğini kullanmanız tavsiye edilir."
    }
  ];

  // Framer Motion Animation Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 18 }
    }
  };

  return (
    <div className="relative min-h-screen text-[var(--text-main)] overflow-x-hidden">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-pink-500/5 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10">

        {/* Floating Header */}
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
              className="text-[0.82rem] font-black text-purple-600 border-none bg-transparent outline-none cursor-pointer"
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
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 max-w-[1280px] mx-auto">
          {/* Centered Floating Gradient Blob */}
          <GradientBlob color="rgba(139, 92, 246, 0.12)" size={500} style={{ top: "15%", right: "20%" }} />

          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-semibold mb-6"
            >
              <HelpCircle size={14} />
              <span>Aklınıza Takılan Her Şey</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] font-black tracking-tight leading-none"
            >
              Sıkça Sorulan <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                Sorular
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed"
            >
              Snapmatch yapay zeka yüz tanıma altyapısı, sistem güvenliği, KVKK uyumluluğu ve fotoğraf saklama süreçleriyle ilgili detaylı bilgileri aşağıda bulabilirsiniz.
            </motion.p>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="px-6 pb-20 max-w-[800px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA (Call To Action) Section */}
        <section className="px-6 py-20 max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="glass-panel p-10 md:p-14 relative overflow-hidden flex flex-col items-center gap-6">
              <div className="absolute inset-0 bg-purple-500/5 blur-xl pointer-events-none" />

              <h2 className="text-2xl md:text-3xl font-black text-[var(--text-main)] leading-tight relative z-10">
                Aradığınız Cevabı Bulamadınız mı?
              </h2>

              <p className="text-sm md:text-base text-[var(--text-muted)] max-w-xl relative z-10 leading-relaxed">
                Her türlü özel entegrasyon talebi veya teknik konular için destek ekibimizle dilediğiniz zaman iletişime geçebilirsiniz.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10">
                <button
                  onClick={() => navigate("/contact")}
                  className="py-3 px-8 font-extrabold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 border-none text-[0.9rem]"
                >
                  <span>Bizimle İletişime Geçin</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/services")}
                  className="py-3 px-8 font-bold rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-[var(--text-main)] border border-[var(--glass-border)] shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 text-[0.9rem]"
                >
                  <span>Hizmetlerimizi İnceleyin</span>
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-[1280px] mx-auto border-t border-[var(--glass-border)] py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.8rem] text-[var(--text-muted)] px-6 bg-transparent relative z-10">
          <span>© 2026 Snapmatch AI. Tüm hakları saklıdır.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Kullanım Koşulları</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">KVKK & Gizlilik</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">İletişim</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
