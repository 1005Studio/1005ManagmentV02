import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { StudioLogo } from './StudioLogo';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // Default true for convenience
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Set Persistence based on "Remember Me" checkbox
      // browserLocalPersistence: Keeps user logged in even after closing browser
      // browserSessionPersistence: Logs user out when tab/browser is closed
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      // 2. Sign In
      await signInWithEmailAndPassword(auth, email, password);
      // Success is handled by the onAuthStateChanged listener in App.tsx
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-posta veya şifre hatalı.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız deneme. Lütfen biraz bekleyin.');
      } else {
        setError('Giriş yapılırken bir hata oluştu.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#050505] font-body relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D81B2D]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-6 relative z-10 animate-fade-in">
        <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          
          {/* Logo Header */}
          <div className="pt-10 pb-6 flex flex-col items-center justify-center border-b border-gray-50 dark:border-gray-800/50">
             <div className="w-20 h-20 mb-4 bg-gray-50 dark:bg-[#1E1E1E] rounded-2xl flex items-center justify-center shadow-inner">
                <StudioLogo className="w-12 h-12" />
             </div>
             <h1 className="text-xl font-brand font-black text-gray-900 dark:text-white tracking-tight">STUDIO MANAGER</h1>
             <p className="text-xs text-gray-400 font-medium mt-1 tracking-widest uppercase">Yönetim Paneli Girişi</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-pulse">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 dark:text-gray-300 ml-1">E-POSTA</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 pl-11 outline-none focus:border-[#D81B2D] focus:ring-1 focus:ring-[#D81B2D] transition-all text-sm font-medium"
                    placeholder="ornek@1005studio.app"
                    required 
                  />
                  <div className="absolute left-3.5 top-3.5 text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 dark:text-gray-300 ml-1">ŞİFRE</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 pl-11 outline-none focus:border-[#D81B2D] focus:ring-1 focus:ring-[#D81B2D] transition-all text-sm font-medium"
                    placeholder="••••••••"
                    required 
                  />
                  <div className="absolute left-3.5 top-3.5 text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#D81B2D] border-[#D81B2D]' : 'bg-transparent border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                    {rememberMe && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400 select-none">Beni Hatırla</span>
                </label>
                <a href="#" className="text-xs font-bold text-gray-400 hover:text-[#D81B2D] transition-colors">Şifremi Unuttum?</a>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>GİRİŞ YAPILIYOR...</span>
                  </>
                ) : (
                  <>
                    <span>SİSTEME GİRİŞ</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-gray-50 dark:bg-[#1E1E1E]/50 px-8 py-4 text-center border-t border-gray-100 dark:border-gray-800">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">1005 CREATIVE STUDIO &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};