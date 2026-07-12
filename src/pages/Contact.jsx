import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Lock,
  ChevronDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Send
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import GradientBlob from "../components/ui/GradientBlob";

// FAQ section moved to dedicated FAQ page

export default function Contact() {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync theme
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
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  // FAQ data moved to dedicated FAQ page

  // Framer Motion Animation Settings
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
              className="text-[0.82rem] font-black text-purple-600 border-none bg-transparent outline-none cursor-pointer"
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
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 max-w-[1280px] mx-auto">
          {/* Centered Floating Gradient Blob */}
          <GradientBlob color="rgba(139, 92, 246, 0.12)" size={500} style={{ top: "15%", left: "20%" }} />

          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-semibold mb-6"
            >
              <Sparkles size={14} />
              <span>Sorularınız mı Var? Yanıtlamaya Hazırız</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] font-black tracking-tight leading-none"
            >
              Bizimle <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                İletişime Geçin
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed"
            >
              Etkinlikleriniz için yapay zeka entegrasyonu, özel paket talepleri veya teknik destek için ekibimizle dilediğiniz zaman iletişime geçebilirsiniz.
            </motion.p>
          </div>
        </section>

        {/* İki Kolonlu Ana Düzen */}
        <section className="px-6 pb-20 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

            {/* Sol Kolon (İletişim Bilgileri) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              <h3 className="text-xl md:text-2xl font-black text-[var(--text-main)] mb-2">
                Kurumsal İletişim
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                Sorularınız veya iş ortaklığı teklifleriniz için aşağıdaki kanallar üzerinden bizimle doğrudan bağlantı kurabilirsiniz.
              </p>

              {/* Mail Card */}
              <GlassCard className="glass-panel p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)]">E-posta Adresimiz</h4>
                  <p className="text-base font-extrabold text-[var(--text-main)] mt-1">info@snapmatch.ai</p>
                  <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5">Destek talepleri için: support@snapmatch.ai</p>
                </div>
              </GlassCard>

              {/* Phone Card */}
              <GlassCard className="glass-panel p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)]">Telefon</h4>
                  <p className="text-base font-extrabold text-[var(--text-main)] mt-1">+90 (212) 555 0199</p>
                  <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5">Hafta içi 09:00 - 18:00 saatleri arası</p>
                </div>
              </GlassCard>

              {/* Address Card */}
              <GlassCard className="glass-panel p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)]">Ofis Adresimiz</h4>
                  <p className="text-base font-extrabold text-[var(--text-main)] mt-1">Büyükdere Caddesi, No: 153</p>
                  <p className="text-sm text-[var(--text-main)] font-semibold mt-0.5">Şişli / İstanbul</p>
                </div>
              </GlassCard>

              {/* Clock Card */}
              <GlassCard className="glass-panel p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)]">Çalışma Saatleri</h4>
                  <p className="text-base font-extrabold text-[var(--text-main)] mt-1">Hafta İçi: 09:00 - 18:00</p>
                  <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5">Cumartesi - Pazar: Kapalı (E-posta ile 7/24 nöbetçi destek)</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Sağ Kolon (İnteraktif İletişim Formu) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <GlassCard className="glass-panel p-8 h-full flex flex-col justify-center relative overflow-hidden">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-[var(--text-main)]">
                      Mesajınız Başarıyla İletildi!
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
                      Snapmatch ekibi olarak talebinizi aldık. İletişim bilgilerinizi kontrol ederek en kısa sürede (genellikle 2 saat içinde) size geri dönüş sağlayacağız.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setName("");
                        setEmail("");
                        setMessage("");
                      }}
                      className="mt-6 py-2.5 px-6 font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md cursor-pointer transition-all active:scale-95 border-none text-[0.82rem]"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-[var(--text-main)] mb-2">
                        Bize Mesaj Bırakın
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                        Hizmetlerimizle ilgili her türlü soru veya demo talebi için formu doldurabilirsiniz.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.78rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Adınız Soyadınız
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--glass-border)] bg-white/30 focus:bg-white/60 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]/70"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.78rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        E-posta Adresiniz
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ahmet@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--glass-border)] bg-white/30 focus:bg-white/60 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]/70"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.78rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Etkinlik Türü
                      </label>
                      <div className="relative">
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[var(--glass-border)] bg-white/30 focus:bg-white/60 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all text-[var(--text-main)] appearance-none cursor-pointer"
                        >
                          <option value="wedding" className="text-black">Düğün & Törenler</option>
                          <option value="corporate" className="text-black">Kurumsal Etkinlikler</option>
                          <option value="concert" className="text-black">Konserler & Festivaller</option>
                          <option value="graduation" className="text-black">Mezuniyet Geceleri</option>
                          <option value="other" className="text-black">Diğer Özel Günler</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.78rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Mesajınız
                      </label>
                      <textarea
                        required
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Taleplerinizi buraya yazabilirsiniz..."
                        className="w-full px-4 py-3 rounded-xl border border-[var(--glass-border)] bg-white/30 focus:bg-white/60 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]/70 resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 py-3 px-8 font-extrabold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 border-none text-[0.9rem] disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span>Mesaj Gönderiliyor...</span>
                      ) : (
                        <>
                          <span>Mesaj Gönder</span>
                          <Send size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </div>
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
