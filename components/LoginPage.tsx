import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { StudioLogo } from './StudioLogo';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isConfigError, setIsConfigError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsConfigError(false);
    setLoading(true);

    // 1. Önce "Yerel Yönetici" (Hardcoded) şifresini kontrol et
    // Bu, Firebase ayarları bozuk olsa bile giriş yapılmasını sağlar.
    if (email === 'erdem.ozkan@1005.studio' && password === 'Dfn1005.') {
       setTimeout(() => {
         if (onLoginSuccess) onLoginSuccess();
       }, 500);
       return;
    }

    // 2. Eğer yerel şifre değilse, Firebase Auth dene
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // Başarılı olursa onAuthStateChanged tetiklenecek
    } catch (err: any) {
      console.error("Login Error:", err);
      // Kullanıcı dostu hata mesajları
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Kullanıcı adı veya şifre yanlış.');
          break;
        case 'auth/too-many-requests':
          setError('Çok fazla başarısız deneme. Lütfen bir süre bekleyin.');
          break;
        case 'auth/configuration-not-found':
          setError('Sunucu hatası: Giriş yöntemi aktif değil. Firebase panelinden açmalısınız.');
          setIsConfigError(true);
          break;
        case 'auth/network-request-failed':
          setError('İnternet bağlantınızı kontrol edin.');
          break;
        default:
          setError(`Giriş yapılamadı. (${err.code})`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] font-body relative overflow-hidden">
      
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#D81B2D]/10 rounded-full blur-[150px] opacity-40 animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] opacity-30"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      <div className="w-full max-w-[420px] p-6 relative z-10 animate-fade-in">
        <div className="bg-[#121212]/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden ring-1 ring-white/10">
          
          {/* Header */}
          <div className="pt-12 pb-8 flex flex-col items-center justify-center relative">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D81B2D] to-transparent opacity-50"></div>
             
             <div className="w-24 h-24 mb-6 bg-gradient-to-br from-[#1E1E1E] to-[#0a0a0a] rounded-2xl flex items-center justify-center shadow-2xl border border-white/5 group transition-transform hover:scale-105 duration-500">
                <StudioLogo className="w-14 h-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
             </div>
             
             <h1 className="text-2xl font-brand font-black text-white tracking-tight">1005 STUDIO</h1>
             <p className="text-[10px] text-gray-400 font-bold mt-2 tracking-[0.3em] uppercase">Yönetim Paneli v2.0</p>
          </div>

          {/* Form */}
          <div className="px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col items-start gap-2 text-red-400 text-xs font-medium animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2">
                    <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{error}</span>
                  </div>
                  {isConfigError && (
                    <a 
                      href="https://console.firebase.google.com/u/0/project/_/authentication/providers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-6 underline hover:text-red-300 transition-colors"
                    >
                      Firebase Konsoluna Git ve Email/Password'ü Aktif Et →
                    </a>
                  )}
                </div>
              )}

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-white transition-colors">Kullanıcı Adı</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-xl px-4 py-3.5 pl-11 outline-none focus:border-[#D81B2D] focus:ring-1 focus:ring-[#D81B2D]/50 transition-all text-sm font-medium placeholder-gray-700 hover:border-white/20"
                    placeholder="Kullanıcı Adı"
                    required 
                  />
                  <div className="absolute left-3.5 top-3.5 text-gray-600 group-focus-within:text-[#D81B2D] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-white transition-colors">Şifre</label>
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

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#D81B2D] border-[#D81B2D]' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                    {rememberMe && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                  <span className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors select-none">Beni Hatırla</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6 group relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>GİRİŞ YAPILIYOR</span>
                  </>
                ) : (
                  <>
                    <span>SİSTEME GİRİŞ</span>
                    <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-white/5 px-8 py-4 text-center border-t border-white/5 flex justify-center items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Sistem Aktif ve Güvenli</p>
          </div>
        </div>
      </div>
    </div>
  );
};