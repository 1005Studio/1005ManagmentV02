import React, { useState } from 'react';
import { SubscriptionItem } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SubscriptionItem[];
  onAdd: (name: string, price: number, currency: 'TL'|'USD'|'EUR', cycle: 'Aylık'|'Yıllık') => void;
  onDelete: (id: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, items, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'TL'|'USD'|'EUR'>('TL');
  const [cycle, setCycle] = useState<'Aylık'|'Yıllık'>('Aylık');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && price) {
      onAdd(name, Number(price), currency, cycle);
      setName('');
      setPrice('');
    }
  };

  const formatCurrency = (val: number, curr: string) => {
     return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: curr === 'TL' ? 'TRY' : curr }).format(val);
  }

  // Calculate Monthly Total Approx (Simple conversion for display)
  const totalMonthly = items.reduce((acc, item) => {
    let p = item.price;
    if(item.currency === 'USD') p *= 34; // Approx rate
    if(item.currency === 'EUR') p *= 36;
    if(item.cycle === 'Yıllık') p /= 12;
    return acc + p;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md md:p-4">
      <div className="bg-[#F8F9FA] dark:bg-[#090909] w-full h-full md:h-[85vh] md:max-w-xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 animate-enter-modal">
        
        {/* Header */}
        <div className="shrink-0 px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="font-extrabold text-xl text-gray-900 dark:text-white font-brand tracking-tight">Abonelikler</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Yazılım ve hizmet giderleri</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Summary Card */}
        {items.length > 0 && (
          <div className="shrink-0 p-4 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
             <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Tahmini Aylık Gider</p>
                      <p className="text-2xl font-mono font-bold tracking-tight">
                         {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalMonthly)}
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Toplam Kalem</p>
                      <p className="text-xl font-bold">{items.length}</p>
                   </div>
                </div>
             </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-[#090909]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600">
               <div className="w-16 h-16 bg-gray-200 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
               </div>
              <p className="font-medium">Abonelik bulunamadı</p>
            </div>
          ) : (
            <div className="grid gap-3 pb-20 md:pb-0">
              {items.map(item => (
                <div key={item.id} className="group relative bg-white dark:bg-[#161616] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-[#D81B2D] dark:hover:border-[#D81B2D] transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${['Adobe','Netflix','Spotify'].some(k => item.name.includes(k)) ? 'bg-black dark:bg-[#252525]' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                       {item.name.substring(0,1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{item.name}</h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${item.cycle === 'Aylık' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'}`}>
                        {item.cycle}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pl-2 shrink-0">
                     <p className="font-brand font-bold text-lg text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatCurrency(item.price, item.currency)}
                     </p>
                     <button 
                        onClick={() => onDelete(item.id)} 
                        className="w-9 h-9 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                        title="Sil"
                     >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Form */}
        <form onSubmit={handleSubmit} className="shrink-0 p-4 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pb-safe">
          <div className="flex flex-col gap-3">
             <input 
               value={name} 
               onChange={e => setName(e.target.value)} 
               className="w-full bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-[#D81B2D] rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all" 
               placeholder="Servis Adı (Örn: Adobe CC)" 
             />
             <div className="flex gap-2">
                <input 
                  type="number"
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  className="flex-[2] bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-[#D81B2D] rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all" 
                  placeholder="0.00" 
                />
                <div className="flex-1 relative">
                    <select 
                        value={currency}
                        onChange={e => setCurrency(e.target.value as any)}
                        className="w-full h-full bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-transparent rounded-xl px-2 outline-none text-xs font-bold appearance-none text-center focus:bg-white dark:focus:bg-[#252525]"
                    >
                        <option value="TL">TL</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>
                <div className="flex-1 relative">
                    <select 
                        value={cycle}
                        onChange={e => setCycle(e.target.value as any)}
                        className="w-full h-full bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-transparent rounded-xl px-2 outline-none text-xs font-bold appearance-none text-center focus:bg-white dark:focus:bg-[#252525]"
                    >
                        <option value="Aylık">AYLIK</option>
                        <option value="Yıllık">YILLIK</option>
                    </select>
                </div>
             </div>
             <button 
                type="submit" 
                disabled={!name.trim() || !price}
                className="w-full bg-[#1A1A1A] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Gider Ekle
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};