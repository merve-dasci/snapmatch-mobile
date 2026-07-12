import React, { Component } from "react";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center text-[var(--text-main)] p-6 font-sans relative overflow-hidden">
          {/* Subtle background blur shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />

          <div className="relative z-10 max-w-md w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl p-8 rounded-[24px] shadow-[var(--glass-shadow)] text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <AlertOctagon className="text-red-500" size={32} />
            </div>

            <h2 className="text-xl font-extrabold mb-2 text-[var(--text-main)]">Beklenmedik Bir Hata Oluştu</h2>
            <p className="text-[var(--text-muted)] text-[0.88rem] leading-relaxed mb-6">
              Uygulama çalışırken beklenmedik bir sorunla karşılaştı. Teknik ekip bilgilendirildi. Lütfen sayfayı yenilemeyi veya ana sayfaya dönmeyi deneyin.
            </p>

            {this.state.error && (
              <div className="w-full bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] rounded-xl p-3 text-left mb-6 overflow-x-auto max-h-[120px]">
                <code className="text-[0.72rem] text-[var(--accent-red)] font-mono block whitespace-pre">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex gap-3 w-full">
              <button 
                onClick={() => window.location.reload()}
                className="primary-btn flex-grow py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all text-[0.88rem]"
              >
                <RefreshCw size={16} />
                Yeniden Dene
              </button>
              <button 
                onClick={this.handleReset}
                className="secondary-btn flex-grow py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all text-[0.88rem]"
              >
                <Home size={16} />
                Ana Sayfa
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
