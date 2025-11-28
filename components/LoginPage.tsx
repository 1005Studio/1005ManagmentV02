
import React, { useState } from 'react';
import { auth, firebaseConfig } from '../firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  sendPasswordResetEmail
} from 'firebase/auth';
import { StudioLogo } from './StudioLogo';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // View State: 'login' | 'forgot'
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // --- LOGIN HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // 1. LOCAL BACKDOOR CHECK (Acil durumlar için - opsiyonel)
    if (email.trim().toLowerCase() === 'erdem' && password === 'Dfn1005.') {
        localStorage.setItem('1005_auth', 'true');
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
        return;
    }

    // 2. FIREBASE AUTH
    try {
      // Beni Hatırla mantığı
      const persistenceMode = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceMode);
      
      // Sadece giriş işlemi
      await signInWithEmailAndPassword(auth, email, password);
      // Başarılı olursa App.tsx'teki listener yakalar, burada yönlendirme yapmaya gerek yok
    } catch (err: any) {
      // Hata kodunu konsola yazdır (Debug için)
      console.log("Firebase Login Error Code:", err.code);
      console.log("Firebase Login Error Message:", err.message);
      
      let errorMsg = 'Giriş yapılamadı.';
      
      switch (err.code) {
        case 'auth/user-not-found': 
          errorMsg = 'Böyle bir kullanıcı bulunamadı.'; 
          break;
        case 'auth/wrong-password': 
          errorMsg = 'Şifre hatalı.'; 
          break;
        case 'auth/invalid-email': 
          errorMsg = 'Geçersiz e-posta adresi formatı.'; 
          break;
        case 'auth/operation-not-allowed': 
          errorMsg = 'Email/Password yöntemi bu projede kapalı.'; 
          break;
        case 'auth/invalid-credential':
          errorMsg = 'Kullanıcı bilgileri hatalı veya geçersiz.';
          break;
        case 'auth/too-many-requests': 
          errorMsg = 'Çok fazla başarısız deneme yaptınız. Lütfen biraz bekleyin.'; 
          break;
        case 'auth/network-request-failed': 
          errorMsg = 'İnternet bağlantınızı kontrol edin.'; 
          break;
        default: 
          errorMsg = `Beklenmeyen bir hata oluştu: ${err.code}`;
      }
      setMessage(errorMsg);
      setLoading(false);
    }
  };

  // --- PASSWORD RESET HANDLER ---
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!resetEmail.trim()) return;

    setResetStatus('loading');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus('success');
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (err: any) {
      setResetStatus('error');
      console.error("Reset Error:", err.code);
      
      let errorMsg = 'İşlem başarısız.';
      switch (err.code) {
        case 'auth/user-not-found': errorMsg = 'Bu e-posta adresi sistemde kayıtlı değil.'; break;
        case 'auth/invalid-email': errorMsg = 'Geçersiz e-posta adresi.'; break;
        default: errorMsg = `Hata: ${err.code}`;
      }
      setMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] font-body relative overflow-hidden px-4">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#D81B2D]/10 rounded-full blur-[150px] opacity-40 animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] opacity-30"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in flex flex-col gap-4">
        <div className="bg-[#121212]/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden ring-1 ring-white/10 transition-all duration-500">
          
          {/* Header Area */}
          <div className="pt-12 pb-6 flex flex-col items-center justify-center relative">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D81B2D] to-transparent opacity-50"></div>
             
             <div className="w-20 h-20 mb-4 bg-gradient-to-br from-[#1E1E1E] to-[#0a0a0a] rounded-2xl flex items-center justify-center shadow-2xl border border-white/5 group transition-transform hover:scale-105 duration-500">
                <StudioLogo className="w-12 h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
             </div>
             
             <h1 className="text-xl font-brand font-black text-white tracking-tight">1005 STUDIO</h1>
             <p className="text-[9px] text-gray-400 font-bold mt-1 tracking-[0.3em] uppercase opacity-70">
                {view === 'login' ? 'Yönetim Paneli v2.0' : 'Şifre Sıfırlama'}
             </p>
          </div>

          {/* Dynamic Content Area */}
          <div className="px-8 pb-10 min-h-[320px]">
            
            {/* Status Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex flex-col items-start gap-1 text-xs font-medium animate-in slide-in-from-top-2 border ${
                resetStatus === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <div className="flex items-center gap-2">
                    <div className="shrink-0">
                    {resetStatus === 'success' 
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    }
                    </div>
                    <span>{message}</span>
                </div>
              </div>
            )}

            {view === 'login' ? (
              /* --- LOGIN FORM --- */
              <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">KULLANICI ADI</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-xl px-4 py-3.5 pl-11 outline-none focus:border-[#D81B2D] focus:ring-1 focus:ring-[#D81B2D]/50 transition-all text-sm font-medium placeholder-gray-700 hover:border-white/20"
                      required 
                    />
                    <div className="absolute left-3.5 top-3.5 text-gray-600 group-focus-within:text-[#D81B2D] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">ŞİFRE</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-xl px-4 py-3.5 pl-11 outline-none focus:border-[#D81B2D] focus:ring-1 focus:ring-[#D81B2D]/50 transition-all text-sm font-medium placeholder-gray-700 hover:border-white/20"
                      placeholder="••••••••"
                      required 
                    />
                    <div className="absolute left-3.5 top-3.5 text-gray-600 group-focus-within:text-[#D81B2D] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#D81B2D] border-[#D81B2D]' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                      {rememberMe && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors">Beni Hatırla</span>
                  </label>

                  <button 
                    type="button"
                    onClick={() => { setView('forgot'); setMessage(''); setResetStatus('idle'); }}
                    className="text-xs font-bold text-gray-500 hover:text-[#D81B2D] transition-colors"
                  >
                    Şifremi unuttum?
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-white/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4 group"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>SİSTEME GİRİŞ</span>
                    </>
                  ) : (
                    <>
                      <span>SİSTEME GİRİŞ</span>
                      <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* --- FORGOT PASSWORD FORM --- */
              <form onSubmit={handlePasswordReset} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">E-POSTA ADRESİ</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-xl px-4 py-3.5 pl-11 outline-none focus:border-[#D81B2D] focus:ring-1 focus:ring-[#D81B2D]/50 transition-all text-sm font-medium placeholder-gray-700"
                      placeholder="ornek@1005.studio"
                      required 
                    />
                    <div className="absolute left-3.5 top-3.5 text-gray-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 ml-1 leading-relaxed">
                    Sisteme kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı gönderilecektir.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => { setView('login'); setMessage(''); setResetStatus('idle'); }}
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#252525] text-gray-400 hover:text-white py-3.5 rounded-xl font-bold text-xs transition-all border border-white/5"
                  >
                    GERİ DÖN
                  </button>
                  <button 
                    type="submit" 
                    disabled={resetStatus === 'loading' || resetStatus === 'success'}
                    className="flex-[2] bg-[#D81B2D] hover:bg-[#b91625] text-white py-3.5 rounded-xl font-bold uppercase text-xs shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resetStatus === 'loading' ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <>
                        <span>GÖNDER</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Footer Info */}
          <div className="bg-white/5 px-8 py-4 text-center border-t border-white/5 flex justify-center items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${view === 'login' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
               {view === 'login' ? 'Sistem Aktif ve Güvenli' : 'Şifre Kurtarma Modu'}
             </p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="text-center opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[9px] font-mono text-gray-500">
                Connected to: <span className="text-white">{firebaseConfig.projectId}</span>
            </p>
            <p className="text-[9px] font-mono text-gray-600 mt-0.5">
                {firebaseConfig.authDomain}
            </p>
        </div>
      </div>
    </div>
  );
};
