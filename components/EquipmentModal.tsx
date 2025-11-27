
import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#F8F9FA] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh] shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-100">
          <div>
            <h2 className="font-extrabold text-xl text-gray-900 font-brand tracking-tight">Stüdyo Ekipmanları</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Toplam {items.length} parça demirbaş</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
               </div>
              <p className="font-medium">Henüz ekipman yok</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map(item => (
                <div key={item.id} className="group relative bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-[#D81B2D]/30 hover:shadow-md transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                       <span className="font-bold text-lg">{item.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                      {item.category && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(item.id)} 
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex gap-2 mb-3">
             <input 
               value={name} 
               onChange={e => setName(e.target.value)} 
               className="flex-[2] bg-gray-50 text-gray-900 border border-transparent focus:bg-white focus:border-[#D81B2D] rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all" 
               placeholder="Ekipman Adı (Örn: Sony FX3)" 
             />
             <input 
               value={category} 
               onChange={e => setCategory(e.target.value)} 
               className="flex-1 bg-gray-50 text-gray-900 border border-transparent focus:bg-white focus:border-[#D81B2D] rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all" 
               placeholder="Kategori" 
             />
          </div>
          <button 
            type="submit" 
            disabled={!name.trim()}
            className="w-full bg-[#1A1A1A] hover:bg-black text-white px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Listeye Ekle
          </button>
        </form>
      </div>
    </div>
  );
};
