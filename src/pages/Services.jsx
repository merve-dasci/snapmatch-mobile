import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap,
  Lock,
  Camera,
  QrCode,
  LayoutDashboard,
  ArrowRight
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import GradientBlob from "../components/ui/GradientBlob";

export default function Services() {
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

  const cardHoverConfig = {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.25, ease: "easeOut" }
  };

  return (
    <div className="relative min-h-screen text-[var(--text-main)] overflow-x-hidden">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-pink-500/5 blur-[140px] pointer-events-none z-0" />

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
              className="text-[0.82rem] font-black text-purple-600 border-none bg-transparent outline-none cursor-pointer"
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
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 max-w-[1280px] mx-auto">
          {/* Centered Floating Gradient Blob */}
          <GradientBlob color="rgba(244, 114, 182, 0.12)" size={500} style={{ top: "15%", right: "20%" }} />

          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-semibold mb-6"
            >
              <Sparkles size={14} />
              <span>Yapay Zekalı Fotoğraf Dağıtım Altyapısı</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] font-black tracking-tight leading-none"
            >
              Etkinliklerinizi Dijitalleştiren <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                Akıllı Hizmetler
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed"
            >
              Snapmatch, en gelişmiş yapay zeka entegrasyonu ve gerçek zamanlı fotoğraf dağıtımıyla hem organizatörlere hem de katılımcılara benzersiz bir hız deneyimi sunar.
            </motion.p>
          </div>
        </section>

        {/* Ana Hizmetlerimiz (Grid Yapısı) */}
        <section className="px-6 pb-20 max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-main)]">
              Sunmuş Olduğumuz Çözümler
            </h2>
            <p className="text-[var(--text-muted)] mt-2 text-sm md:text-base">
              Etkinlik fotoğrafçılığını baştan uca optimize eden modern ve premium SaaS çözümlerimiz.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* Service 1 */}
            <motion.div variants={itemVariants} whileHover={cardHoverConfig} className="cursor-pointer">
              <GlassCard className="glass-panel p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-3">
                    Yapay Zeka Destekli Yüz Eşleştirme
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                    Etkinlikte çekilen binlerce fotoğraf arasından kendinizi arayarak vakit kaybetmeyin. Snapmatch AI, biyometrik referans noktalarını analiz ederek saniyeler içinde sadece size ait olan kareleri bulur ve yüksek çözünürlükte indirmenizi sağlar.
                  </p>
                </div>
                <div className="border-t border-[var(--glass-border)] pt-4 mt-6 flex flex-wrap gap-2 text-[0.72rem] font-bold text-purple-600">
                  <span className="bg-purple-500/5 px-2.5 py-1 rounded-md">%99.9 Doğruluk</span>
                  <span className="bg-purple-500/5 px-2.5 py-1 rounded-md">Biyometrik Haritalama</span>
                  <span className="bg-purple-500/5 px-2.5 py-1 rounded-md">Milisaniyede Arama</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Service 2 */}
            <motion.div variants={itemVariants} whileHover={cardHoverConfig} className="cursor-pointer">
              <GlassCard className="glass-panel p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-pink-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 mb-6">
                    <QrCode size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-3">
                    Anlık Fotoğraf Yükleme ve QR Erişim
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                    Fotoğrafçılar çektikleri kareleri doğrudan bulut sistemimize yükler. Davetlileriniz ise alandaki kendilerine özel veya genel QR kodları taratarak kişiselleştirilmiş fotoğraf galerilerine anında ve şifresiz erişim sağlar.
                  </p>
                </div>
                <div className="border-t border-[var(--glass-border)] pt-4 mt-6 flex flex-wrap gap-2 text-[0.72rem] font-bold text-pink-600">
                  <span className="bg-pink-500/5 px-2.5 py-1 rounded-md">Bulut Entegrasyonu</span>
                  <span className="bg-pink-500/5 px-2.5 py-1 rounded-md">Kişiye Özel QR Kod</span>
                  <span className="bg-pink-500/5 px-2.5 py-1 rounded-md">Anlık Galeri Güncellemesi</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Service 3 */}
            <motion.div variants={itemVariants} whileHover={cardHoverConfig} className="cursor-pointer">
              <GlassCard className="glass-panel p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6">
                    <LayoutDashboard size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-3">
                    Gelişmiş Etkinlik Yönetim Paneli
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                    Organizatörler ve fotoğrafçılar için tasarlanmış gelişmiş yönetim paneliyle etkinlik trafiğini, katılımcı etkileşimlerini, indirme sayılarını ve depolama kotasını gerçek zamanlı olarak izleyin ve raporlayın.
                  </p>
                </div>
                <div className="border-t border-[var(--glass-border)] pt-4 mt-6 flex flex-wrap gap-2 text-[0.72rem] font-bold text-indigo-600">
                  <span className="bg-indigo-500/5 px-2.5 py-1 rounded-md">Gerçek Zamanlı Takip</span>
                  <span className="bg-indigo-500/5 px-2.5 py-1 rounded-md">Kota Kontrolü</span>
                  <span className="bg-indigo-500/5 px-2.5 py-1 rounded-md">Detaylı Analiz</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Service 4 */}
            <motion.div variants={itemVariants} whileHover={cardHoverConfig} className="cursor-pointer">
              <GlassCard className="glass-panel p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-3">
                    KVKK Uyumlu & Güvenli Bulut
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                    Tüm fotoğraflar ve kullanıcı verileri yerel regülasyonlara (KVKK ve GDPR) tam uyumlu şekilde işlenir. Biyometrik veriler hiçbir zaman sunucularımızda saklanmaz, eşleştirme tamamlandıktan sonra anında imha edilir.
                  </p>
                </div>
                <div className="border-t border-[var(--glass-border)] pt-4 mt-6 flex flex-wrap gap-2 text-[0.72rem] font-bold text-purple-600">
                  <span className="bg-purple-500/5 px-2.5 py-1 rounded-md">%100 Uyumlu</span>
                  <span className="bg-purple-500/5 px-2.5 py-1 rounded-md">Uçtan Uca Şifreleme</span>
                  <span className="bg-purple-500/5 px-2.5 py-1 rounded-md">Güvenli CDN Dağıtımı</span>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </section>

        {/* Nasıl Çalışır? (Step-by-Step Flowchart) */}
        <section className="px-6 py-20 bg-white/10 backdrop-blur-[2px] border-y border-[var(--glass-border)]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)]">
                Nasıl Çalışır?
              </h2>
              <p className="text-[var(--text-muted)] mt-3 max-w-xl mx-auto text-sm md:text-base">
                Platformumuzun hızı ve sadeliği, kullanıcı deneyiminin merkezindedir. Yalnızca 3 basit adımda anılarınıza ulaşın.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Horizontal line connector in desktop */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 -translate-y-1/2 z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[var(--glass-bg)] border-2 border-purple-500/40 flex items-center justify-center text-purple-600 text-xl font-extrabold shadow-[var(--glass-shadow-soft)] group-hover:scale-105 group-hover:border-purple-600 transition-all duration-300">
                  1
                </div>
                <h4 className="text-lg font-bold text-[var(--text-main)] mt-6">Kodu Okut</h4>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xs mt-2 leading-relaxed">
                  Etkinlik alanında yer alan kişiye özel veya genel QR kodunu telefonunuzun kamerasıyla saniyeler içinde taratın.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[var(--glass-bg)] border-2 border-pink-500/40 flex items-center justify-center text-pink-600 text-xl font-extrabold shadow-[var(--glass-shadow-soft)] group-hover:scale-105 group-hover:border-pink-600 transition-all duration-300">
                  2
                </div>
                <h4 className="text-lg font-bold text-[var(--text-main)] mt-6">Selfie Çek</h4>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xs mt-2 leading-relaxed">
                  Güvenli arayüzümüz üzerinden kameranızı açıp hızlıca bir selfie çekerek yüzünüzü taratın. Biyometrik veriniz anında analiz edilir.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[var(--glass-bg)] border-2 border-indigo-500/40 flex items-center justify-center text-indigo-600 text-xl font-extrabold shadow-[var(--glass-shadow-soft)] group-hover:scale-105 group-hover:border-indigo-600 transition-all duration-300">
                  3
                </div>
                <h4 className="text-lg font-bold text-[var(--text-main)] mt-6">Fotoğraflarına Ulaş</h4>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xs mt-2 leading-relaxed">
                  Yapay zekanın sizin için süzdüğü yüksek kaliteli (4K) fotoğrafları görüntüleyin ve cihazınıza anında indirin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 md:py-28 max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="glass-panel p-10 md:p-14 relative overflow-hidden flex flex-col items-center gap-6">
              <div className="absolute inset-0 bg-purple-500/5 blur-xl pointer-events-none" />

              <h2 className="text-2xl md:text-4xl font-black text-[var(--text-main)] leading-tight relative z-10">
                Siz de Etkinliğinizi <br />Snapmatch ile Güçlendirin
              </h2>

              <p className="text-sm md:text-base text-[var(--text-muted)] max-w-xl relative z-10 leading-relaxed">
                Hemen bir fotoğrafçı veya organizatör hesabı oluşturarak akıllı albüm deneyimini davetlilerinize sunun ve iş akışınızı hızlandırın.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10">
                <button
                  onClick={() => navigate("/login")}
                  className="py-3 px-8 font-extrabold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 border-none text-[0.9rem]"
                >
                  <span>Şimdi Başlayın</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="py-3 px-8 font-bold rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-[var(--text-main)] border border-[var(--glass-border)] shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 text-[0.9rem]"
                >
                  <span>Hakkımızda</span>
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
