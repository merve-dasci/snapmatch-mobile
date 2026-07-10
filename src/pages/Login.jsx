import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../context/ToastContext";
import { ROLES, ACCOUNTS } from "../auth/roles";
import { authApi } from "../services/authApi";
import { Cpu, Mail, Lock, Eye, EyeOff, LogIn, User, UserPlus, ChevronRight } from "lucide-react";

export default function Login() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Registration states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regShowPass, setRegShowPass] = useState(false);
  const [regTerms, setRegTerms] = useState(false);

  // Switch between Login and Register
  const [isRegister, setIsRegister] = useState(false);

  // Sync theme with localStorage during initialization
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

  // If already logged in, redirect to home
  if (user) return <Navigate to="/home" replace />;

  const finishLogin = (data) => {
    login({ ...data.user, token: data.token });
    navigate(ROLES[data.user.role]?.home || "/home", { replace: true });
  };

  const signInWithRole = async (roleId) => {
    const role = ROLES[roleId];
    if (!role?.email || !role?.password) return;

    try {
      setLoading(true);
      setError("");
      const data = await authApi.login({
        email: role.email,
        password: role.password,
      });
      finishLogin(data);
    } catch (err) {
      setError(err.message || "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });
      finishLogin(data);
    } catch (err) {
      setError(err.message || "E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regTerms) {
      showToast("Kullanım Koşullarını ve KVKK şartlarını kabul etmeniz gerekmektedir.", "warning");
      return;
    }
    showToast("Kayıt işleminiz başarıyla tamamlandı! Şimdi giriş yapabilirsiniz.", "success");
    
    // Auto-fill login credentials with the registered email
    setEmail(regEmail);
    setPassword(regPassword);
    
    // Slide back to login card
    setIsRegister(false);
  };

  // Helper to trigger direct fill/login from floating dock
  const handleQuickLogin = (roleId) => {
    const r = ROLES[roleId];
    if (r) {
      setEmail(r.email);
      setPassword(r.password);
      setError("");
      showToast(`${r.label} bilgileri yüklendi. Giriş Yap butonuna basabilirsiniz.`, "info");
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between relative overflow-hidden font-sans select-none transition-colors duration-300"
      style={{
        background: "var(--bg-main)"
      }}
    >
      {/* Custom Floating Keyframe Animations Styles */}
      <style>{`
        @keyframes float-y-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes float-y-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes float-y-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        .floating-bubble-1 { animation: float-y-1 5s ease-in-out infinite; }
        .floating-bubble-2 { animation: float-y-2 4.2s ease-in-out infinite; }
        .floating-bubble-3 { animation: float-y-3 6s ease-in-out infinite; }
        .floating-bubble-4 { animation: float-y-1 4.7s ease-in-out infinite; }
        .floating-bubble-5 { animation: float-y-2 5.5s ease-in-out infinite; }
      `}</style>

      {/* Header Menu (Landing Page Style) */}
      <header className="relative z-20 w-full flex items-center justify-between p-[24px_50px] max-md:p-[20px_20px]">
        <div 
          className="flex items-center gap-2 cursor-pointer font-extrabold text-[1.15rem] tracking-wider drop-shadow-md transition-colors"
          style={{ color: "var(--text-main)" }}
        >
          <span>SNAPMATCH</span>
        </div>
        
        <nav className="flex items-center gap-10 max-md:hidden">
          <a 
            href="#home" 
            className="text-[0.88rem] font-bold transition-opacity no-underline opacity-80 hover:opacity-100"
            style={{ color: "var(--text-main)" }}
          >
            Ana Sayfa
          </a>
          <a 
            href="#service" 
            className="text-[0.88rem] font-bold transition-opacity no-underline opacity-80 hover:opacity-100"
            style={{ color: "var(--text-main)" }}
          >
            Hizmetler
          </a>
          <a 
            href="#contact" 
            className="text-[0.88rem] font-bold transition-opacity no-underline opacity-80 hover:opacity-100"
            style={{ color: "var(--text-main)" }}
          >
            İletişim
          </a>
          <a 
            href="#about" 
            className="text-[0.88rem] font-bold transition-opacity no-underline opacity-80 hover:opacity-100"
            style={{ color: "var(--text-main)" }}
          >
            Hakkımızda
          </a>
        </nav>

        <button 
          onClick={() => setIsRegister(!isRegister)}
          className="px-5 py-1.5 rounded-full border text-[0.82rem] font-extrabold transition-all cursor-pointer select-none"
          style={{
            borderColor: "var(--glass-border)",
            backgroundColor: "var(--glass-bg)",
            color: "var(--text-main)"
          }}
        >
          {isRegister ? "Giriş Yap" : "Kayıt Ol"}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-20 -mt-16">
        
        {/* Sliding Card Container */}
        <div 
          className="w-full max-w-[420px] rounded-[24px] border flex flex-col relative overflow-hidden shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.22),_inset_0_-1px_1px_rgba(255,255,255,0.05),_0_24px_60px_rgba(0,0,0,0.45)]"
          style={{
            background: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
            backdropFilter: "blur(50px)",
            WebkitBackdropFilter: "blur(50px)"
          }}
        >
          {/* Glowing atmospheric liquid light blobs inside the glass card */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] z-0">
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-[var(--color-blue-dark)]/25 blur-[80px]" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-[var(--color-blue-medium)]/18 blur-[80px]" />
          </div>

          {/* Sliding wrapper */}
          <div 
            className="flex transition-transform duration-500 ease-out w-[200%] relative z-10"
            style={{
              transform: isRegister ? "translateX(-50%)" : "translateX(0)"
            }}
          >
            {/* Panel 1: Login Form */}
            <div className="w-1/2 p-10 flex flex-col box-border">
              <h2 
                className="text-[1.5rem] font-extrabold text-center m-0 mb-8 tracking-wide drop-shadow-md"
                style={{ color: "var(--text-main)" }}
              >
                Giriş Yap
              </h2>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6 w-full">
                {/* E-posta Input */}
                <div className="flex flex-col gap-1.5 w-full relative">
                  <label 
                    className="text-[0.78rem] font-extrabold tracking-wider text-left"
                    style={{ color: "var(--text-muted)" }}
                  >
                    E-posta Adresi
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="email" 
                      required
                      autoComplete="username"
                      placeholder="ornek@snapmatch.me"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full glass-input-distinct rounded-[14px] p-3 px-4 pr-10 text-[0.88rem] outline-none"
                    />
                    <Mail 
                      size={16} 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" 
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>

                {/* Şifre Input */}
                <div className="flex flex-col gap-1.5 w-full relative">
                  <label 
                    className="text-[0.78rem] font-extrabold tracking-wider text-left"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Şifre
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type={showPass ? "text" : "password"} 
                      required
                      autoComplete="current-password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full glass-input-distinct rounded-[14px] p-3 px-4 pr-14 text-[0.88rem] outline-none"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="border-none bg-transparent cursor-pointer p-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Lock size={16} style={{ color: "var(--text-muted)" }} />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <span className="text-[0.78rem] font-extrabold text-red-400 drop-shadow-sm text-center">
                    {error}
                  </span>
                )}

                {/* Remember Me Checkbox */}
                <div 
                  className="flex items-center justify-between text-[0.78rem] font-semibold mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-purple-600 cursor-pointer"
                    />
                    <span>Beni Hatırla</span>
                  </label>
                  <a 
                    href="#forgot" 
                    className="hover:opacity-100 transition-opacity no-underline"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Şifremi Unuttum?
                  </a>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 rounded-full text-white font-extrabold text-[0.88rem] tracking-wider border-none cursor-pointer mt-3 shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{
                    background: "var(--accent-gradient)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  <LogIn size={16} />
                  <span>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</span>
                </button>
              </form>

              {/* Toggle to Registration */}
              <div 
                className="text-center mt-6 text-[0.78rem] font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                <span>Hesabınız yok mu? </span>
                <button 
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="bg-transparent border-none cursor-pointer hover:underline font-extrabold ml-1 p-0"
                  style={{ color: "var(--color-blue-dark)" }}
                >
                  Kayıt Olun
                </button>
              </div>
            </div>

            {/* Panel 2: Registration Form */}
            <div className="w-1/2 p-10 flex flex-col box-border">
              <h2 
                className="text-[1.5rem] font-extrabold text-center m-0 mb-8 tracking-wide drop-shadow-md"
                style={{ color: "var(--text-main)" }}
              >
                Kayıt Ol
              </h2>

              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5 w-full">
                {/* Ad Soyad Input */}
                <div className="flex flex-col gap-1.5 w-full relative">
                  <label 
                    className="text-[0.78rem] font-extrabold tracking-wider text-left"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Ad Soyad
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      required
                      placeholder="Ad Soyad giriniz"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full glass-input-distinct rounded-[14px] p-3 px-4 pr-10 text-[0.88rem] outline-none"
                    />
                    <User 
                      size={16} 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" 
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>

                {/* E-posta Input */}
                <div className="flex flex-col gap-1.5 w-full relative">
                  <label 
                    className="text-[0.78rem] font-extrabold tracking-wider text-left"
                    style={{ color: "var(--text-muted)" }}
                  >
                    E-posta Adresi
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="email" 
                      required
                      placeholder="ornek@snapmatch.me"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full glass-input-distinct rounded-[14px] p-3 px-4 pr-10 text-[0.88rem] outline-none"
                    />
                    <Mail 
                      size={16} 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" 
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>

                {/* Şifre Input */}
                <div className="flex flex-col gap-1.5 w-full relative">
                  <label 
                    className="text-[0.78rem] font-extrabold tracking-wider text-left"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Şifre
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type={regShowPass ? "text" : "password"} 
                      required
                      placeholder="••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full glass-input-distinct rounded-[14px] p-3 px-4 pr-14 text-[0.88rem] outline-none"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRegShowPass(!regShowPass)}
                        className="border-none bg-transparent cursor-pointer p-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {regShowPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Lock size={16} style={{ color: "var(--text-muted)" }} />
                    </div>
                  </div>
                </div>

                {/* KVKK / Terms Checkbox */}
                <label className="flex items-start gap-2.5 text-[0.74rem] text-left cursor-pointer font-semibold mt-1" style={{ color: "var(--text-muted)" }}>
                  <input 
                    type="checkbox" 
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    className="accent-purple-600 cursor-pointer mt-0.5"
                  />
                  <span className="leading-tight select-none">
                    Kullanıcı Sözleşmesini ve KVKK Açık Rıza Formu hükümlerini kabul ediyorum.
                  </span>
                </label>

                {/* Register Button */}
                <button 
                  type="submit" 
                  className="w-full py-3 rounded-full text-white font-extrabold text-[0.88rem] tracking-wider border-none cursor-pointer mt-2 shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{
                    background: "var(--accent-gradient)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  <UserPlus size={16} />
                  <span>Kayıt Ol</span>
                </button>
              </form>

              {/* Toggle back to Login */}
              <div 
                className="text-center mt-6 text-[0.78rem] font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                <span>Zaten hesabınız var mı? </span>
                <button 
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="bg-transparent border-none cursor-pointer hover:underline font-extrabold ml-1 p-0"
                  style={{ color: "var(--color-blue-dark)" }}
                >
                  Giriş Yapın
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating animated role logins (Liquid Glass Bubbles) */}
        <div className="mt-8 relative z-20 flex flex-col gap-2.5 items-center w-full max-w-[600px] bg-[var(--glass-bg)]/5 p-4 rounded-[20px] border border-[var(--glass-border)]/50 backdrop-blur-md">
          <div className="flex flex-wrap justify-center gap-3.5 mt-1">
            {Object.values(ROLES).filter(r => r.email).map((r, idx) => {
              const bubbleClasses = [
                "floating-bubble-1",
                "floating-bubble-2",
                "floating-bubble-3",
                "floating-bubble-4",
                "floating-bubble-5"
              ];
              const animClass = bubbleClasses[idx % bubbleClasses.length];

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleQuickLogin(r.id)}
                  className={`px-4 py-2 rounded-full border text-[0.74rem] font-bold cursor-pointer transition-all hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center gap-2 ${animClass}`}
                  style={{
                    borderColor: `color-mix(in srgb, ${r.color} 35%, var(--glass-border))`,
                    background: `color-mix(in srgb, ${r.color} 10%, var(--glass-bg))`,
                    color: "var(--text-main)",
                    boxShadow: `0 4px 12px color-mix(in srgb, ${r.color} 8%, transparent)`
                  }}
                  title={`${r.name} - Bilgileri Doldur`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span>{r.label.split(" / ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

      </main>

      {/* Styled Mountain Silhouette Background SVG at Bottom (Absolute so it doesn't push the login box up) */}
      <div className="w-full pointer-events-none absolute bottom-0 left-0 right-0 z-10 select-none">
        <svg 
          viewBox="0 0 1440 320" 
          className="w-full h-auto block -mb-1"
          style={{ transform: "scale(1.05)", transformOrigin: "bottom center" }}
        >
          {/* Back Mountains */}
          <path 
            fill="var(--color-blue-light)" 
            opacity="0.25"
            d="M0,240 L120,180 L240,260 L360,190 L480,250 L600,160 L720,230 L840,150 L960,240 L1080,180 L1200,260 L1320,170 L1440,240 L1440,320 L0,320 Z"
          />
          {/* Middle Mountains */}
          <path 
            fill="var(--color-blue-soft)" 
            opacity="0.45"
            d="M0,260 L180,210 L320,280 L480,210 L640,270 L800,190 L960,260 L1120,200 L1280,280 L1440,220 L1440,320 L0,320 Z"
          />
          {/* Front Mountains / Forest */}
          <path 
            fill="var(--color-blue-dark)" 
            opacity="0.75"
            d="M0,290 L150,250 L300,300 L450,240 L600,290 L750,230 L900,280 L1050,240 L1200,290 L1350,250 L1440,280 L1440,320 L0,320 Z"
          />
        </svg>
      </div>
    </div>
  );
}
