import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Users,
  Cpu,
  Zap,
  Lock,
  Camera,
  QrCode,
  Award,
  Database,
  ArrowRight,
  Target
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import GradientBlob from "../components/ui/GradientBlob";

export default function AboutUs() {
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
        staggerChildren: 0.12,
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
    scale: 1.02,
    y: -5,
    transition: { duration: 0.25, ease: "easeOut" }
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
              className="text-[0.82rem] font-black text-purple-600 border-none bg-transparent outline-none cursor-pointer"
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
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 max-w-[1280px] mx-auto">
          {/* Centered Floating Gradient Blob */}
          <GradientBlob color="rgba(139, 92, 246, 0.15)" size={500} style={{ top: "10%", left: "30%" }} />

          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-semibold mb-6"
            >
              <Sparkles size={14} />
              <span>Yapay Zeka Destekli Etkinlik Fotoğrafçılığı</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[2.25rem] sm:text-[3.5rem] md:text-[4.5rem] font-black tracking-tight leading-none"
            >
              Anılarınızı Özgür Bırakan <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                Yapay Zeka Devrimi
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed"
            >
              Snapmatch, en son teknoloji yapay zeka yüz tanıma motoru ve anlık QR kod erişim altyapısıyla, etkinliklerdeki en değerli anlarınızı saniyeler içinde doğrudan size ulaştırır.
            </motion.p>
          </div>
        </section>

        {/* Hikayemiz ve Misyonumuz (2-Column Grid) */}
        <section className="px-6 pb-20 max-w-[1280px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {/* Story Card */}
            <motion.div variants={itemVariants}>
              <GlassCard className="glass-panel p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 text-purple-500/5 group-hover:text-purple-500/10 transition-colors pointer-events-none">
                  <Camera size={200} />
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6">
                    <Camera size={24} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-4 text-[var(--text-main)]">
                    Bizim Hikayemiz
                  </h3>
                  <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed mb-6">
                    Düğünler, mezuniyet törenleri veya kurumsal zirveler... Hepimiz katıldığımız bu harika etkinliklerde yüzlerce fotoğrafçı tarafından çekilen binlerce kare arasında kendi fotoğraflarımızı ararken saatlerimizi harcadık. Çoğu zaman da o kıymetli anlar, fotoğrafçıların sabit disklerinde unutulup gitti.
                  </p>
                  <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                    İşte bu sorunu kökten çözmek, katılımcılara "daha akıllı ve daha hızlı bir yol sunmak" amacıyla yola çıktık. Snapmatch, etkinlik fotoğrafçılığını yenilikçi yapay zeka algoritmalarıyla buluşturarak anı paylaşımını tamamen zahmetsiz bir deneyime dönüştürmek için kuruldu.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Mission Card */}
            <motion.div variants={itemVariants}>
              <GlassCard className="glass-panel p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 text-pink-500/5 group-hover:text-pink-500/10 transition-colors pointer-events-none">
                  <Target size={200} />
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 mb-6">
                    <Target size={24} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-4 text-[var(--text-main)]">
                    Misyonumuz
                  </h3>
                  <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed mb-6">
                    Teknolojiyi insan odaklı ve güvenlik öncelikli tasarlayarak etkinlik sahiplerinin, fotoğrafçıların ve misafirlerin arasındaki bağı dijitalleştirmek. Her katılımcının kendi fotoğraflarına sadece kendi yüzünü taratarak, KVKK ve GDPR uyumlu bir şekilde anında ulaşmasını sağlamak.
                  </p>
                  <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                    Bizler, kaybolan anıları dijital çağın hızına entegre ederek, her gülümsemenin ait olduğu kişiye en kısa sürede ulaşmasını hedefliyoruz. Anıları saklamanın ve paylaşmanın en güvenli, en teknolojik yolunu inşa ediyoruz.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </section>

        {/* Temel Değerlerimiz (3-Column Grid) */}
        <section className="px-6 py-20 bg-white/10 backdrop-blur-[2px] border-y border-[var(--glass-border)]">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)]">
                Temel Değerlerimiz
              </h2>
              <p className="text-[var(--text-muted)] mt-3 max-w-xl mx-auto text-sm md:text-base">
                Platformumuzu inşa ederken ve müşterilerimize hizmet sunarken bağlı kaldığımız temel ilkelerimiz.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Value 1 */}
              <motion.div
                variants={itemVariants}
                whileHover={cardHoverConfig}
                className="cursor-pointer"
              >
                <GlassCard className="glass-panel p-8 h-full flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)]">Yenilikçilik</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    En güncel derin öğrenme modelleri ve modern web teknolojileri ile sektöre öncülük ediyoruz. Sürekli gelişen algoritmalarımızla en hızlı ve en doğru yüz tanıma deneyimini sunuyoruz.
                  </p>
                </GlassCard>
              </motion.div>

              {/* Value 2 */}
              <motion.div
                variants={itemVariants}
                whileHover={cardHoverConfig}
                className="cursor-pointer"
              >
                <GlassCard className="glass-panel p-8 h-full flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)]">Güvenilirlik</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Kullanıcı verilerinin güvenliği bizim için kırmızı çizgidir. KVKK ve GDPR standartlarına %100 uyumlu, uçtan uca şifrelenmiş veri tabanları ve sıkı gizlilik protokolleri ile hizmet veriyoruz.
                  </p>
                </GlassCard>
              </motion.div>

              {/* Value 3 */}
              <motion.div
                variants={itemVariants}
                whileHover={cardHoverConfig}
                className="cursor-pointer"
              >
                <GlassCard className="glass-panel p-8 h-full flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Users size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)]">Kullanıcı Odaklılık</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Tüm platformumuzu karmaşık adımlardan arındırarak tasarladık. Etkinlik alanındaki QR kodu taratmak ve kendi fotoğrafını tek tıkla indirmek kadar kolay ve akıcı bir deneyim.
                  </p>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Platformun Arkasındaki Teknoloji */}
        <section className="px-6 py-20 max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)]">
              Platformun Arkasındaki Teknoloji
            </h2>
            <p className="text-[var(--text-muted)] mt-3 max-w-xl mx-auto text-sm md:text-base">
              Gücünü kesintisiz hız, yüksek doğruluk ve esnek entegrasyon sunan modern mimarimizden alıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tech 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={cardHoverConfig}
              className="cursor-pointer h-full"
            >
              <GlassCard className="glass-panel p-8 flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6">
                    <Cpu size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)] mb-3">
                    AI Yüz Tanıma Motoru
                  </h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Derin öğrenme tabanlı eşleştirme sistemimiz, yüzünüzdeki 153 biyometrik referans noktasını milisaniyeler seviyesinde haritalandırır. Kalabalık veya farklı açılardaki fotoğraflarda bile %99.9 oranında kusursuz tespiti garantiler.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-purple-600 text-xs font-bold">
                  <span>Derin Öğrenme Altyapısı</span>
                  <ArrowRight size={12} />
                </div>
              </GlassCard>
            </motion.div>

            {/* Tech 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={cardHoverConfig}
              className="cursor-pointer h-full"
            >
              <GlassCard className="glass-panel p-8 flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-pink-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 mb-6">
                    <Zap size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)] mb-3">
                    React & Vite Mimarisi
                  </h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    En yeni web teknolojileriyle sıfırdan tasarlanan modern ön yüz altyapısı sayesinde, sayfalar anında yüklenir ve dinamik veri akışı kesintisiz bir şekilde devam eder. Mobil ve masaüstünde yüksek yenilenme hızı sunar.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-pink-600 text-xs font-bold">
                  <span>Ultra Hızlı Arayüz</span>
                  <ArrowRight size={12} />
                </div>
              </GlassCard>
            </motion.div>

            {/* Tech 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={cardHoverConfig}
              className="cursor-pointer h-full"
            >
              <GlassCard className="glass-panel p-8 flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6">
                    <Database size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)] mb-3">
                    Güvenli CDN & Bulut Depolama
                  </h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Uçtan uca şifrelenmiş bulut sunucuları ve küresel içerik dağıtım ağı (CDN) entegrasyonu sayesinde, 4K kalitesindeki yüksek boyutlu fotoğraflar bile kalitesini kaybetmeden saniyeler içinde indirilebilir hale gelir.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-indigo-600 text-xs font-bold">
                  <span>Güvenli & Hızlı Erişim</span>
                  <ArrowRight size={12} />
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Sayılarla Biz (İstatistikler) */}
        <section className="px-6 py-20 bg-white/10 backdrop-blur-[2px] border-t border-[var(--glass-border)]">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {/* Stat 1 */}
              <motion.div variants={itemVariants}>
                <GlassCard className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 mb-3">
                    <QrCode size={18} />
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-main)] bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    1M+
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-medium">
                    Taranan QR Kod
                  </span>
                </GlassCard>
              </motion.div>

              {/* Stat 2 */}
              <motion.div variants={itemVariants}>
                <GlassCard className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-600 mb-3">
                    <Camera size={18} />
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-main)] bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-red-500">
                    500+
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-medium">
                    Tamamlanan Etkinlik
                  </span>
                </GlassCard>
              </motion.div>

              {/* Stat 3 */}
              <motion.div variants={itemVariants}>
                <GlassCard className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-3">
                    <Cpu size={18} />
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-main)] bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    %99.9
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-medium">
                    Yapay Zeka Doğruluğu
                  </span>
                </GlassCard>
              </motion.div>

              {/* Stat 4 */}
              <motion.div variants={itemVariants}>
                <GlassCard className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 mb-3">
                    <Award size={18} />
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-main)] bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    153
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-medium">
                    Yüz Eşleşme Noktası
                  </span>
                </GlassCard>
              </motion.div>
            </motion.div>
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
                Geleceğin Fotoğraf Deneyimi ile <br />Etkinliğinizi Unutulmaz Kılın
              </h2>

              <p className="text-sm md:text-base text-[var(--text-muted)] max-w-xl relative z-10 leading-relaxed">
                Snapmatch'in güçlü yapay zeka altyapısını kendi etkinliklerinizde deneyimleyin. Davetlilerinizin en mutlu anlarına saniyeler içinde ulaşmasını sağlayın.
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
                  onClick={() => navigate("/")}
                  className="py-3 px-8 font-bold rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-[var(--text-main)] border border-[var(--glass-border)] shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 text-[0.9rem]"
                >
                  <span>Ana Sayfaya Dön</span>
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
