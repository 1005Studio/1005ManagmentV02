import React, { useState, useMemo } from 'react';
import { EquipmentItem } from '../types';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EquipmentItem[];
  onAdd: (name: string, category: string) => void;
  onDelete: (id: string) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({ isOpen, onClose, items, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, category);
      setName('');
      setCategory('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md md:p-4">
      <div className="bg-[#F8F9FA] dark:bg-[#090909] w-full h-full md:h-[85vh] md:max-w-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 animate-enter-modal">
        
        {/* Header */}
        <div className="shrink-0 px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="font-extrabold text-xl text-gray-900 dark:text-white font-brand tracking-tight">Stüdyo Ekipmanları</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{items.length} parça demirbaş kayıtlı.</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="shrink-0 p-4 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
           <div className="relative">
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1E1E1E] border-none rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D81B2D]"
                placeholder="Ekipman ara..."
              />
              <svg className="absolute left-3 top-3 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-[#090909]">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600">
               <div className="w-16 h-16 bg-gray-200 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
               </div>
              <p className="font-medium">Ekipman bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20 md:pb-0">
              {filteredItems.map(item => (
                <div key={item.id} className="group relative bg-white dark:bg-[#161616] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-[#D81B2D] dark:hover:border-[#D81B2D] transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-10 h-10 bg-gray-100 dark:bg-[#252525] rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg">
                       {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{item.name}</h3>
                      {item.category && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-gray-100 dark:bg-[#252525] text-gray-500 dark:text-gray-400 text-[9px] font-bold uppercase tracking-wider rounded">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(item.id)} 
                    className="shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Form */}
        <form onSubmit={handleSubmit} className="shrink-0 p-4 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pb-safe">
          <div className="flex flex-col md:flex-row gap-3">
             <div className="flex-1 flex gap-2">
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="flex-[2] bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-[#D81B2D] rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all" 
                  placeholder="Ekipman Adı (Örn: Sony FX3)" 
                />
                <input 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="flex-1 bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-[#D81B2D] rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all" 
                  placeholder="Kategori" 
                />
             </div>
             <button 
                type="submit" 
                disabled={!name.trim()}
                className="bg-[#1A1A1A] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
             >
                Ekle
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};