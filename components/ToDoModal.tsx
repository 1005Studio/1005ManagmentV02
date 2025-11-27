import React, { useState } from 'react';
import { ToDoItem } from '../types';

export const ToDoModal: React.FC<{ isOpen: boolean, onClose: () => void, items: ToDoItem[], onAdd: (t: string) => void, onToggle: (id: string) => void, onDelete: (id: string) => void }> = ({ isOpen, onClose, items, onAdd, onToggle, onDelete }) => {
  const [text, setText] = useState('');
  
  if (!isOpen) return null;
  
  const completedCount = items.filter(i => i.isCompleted).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md md:p-4">
      <div className="bg-[#F8F9FA] dark:bg-[#090909] w-full h-full md:h-[85vh] md:max-w-md md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 animate-enter-modal">
        
        {/* Header */}
        <div className="shrink-0 px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center relative">
          <div>
            <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white font-brand tracking-tight">Yapılacaklar</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Bugünün işini yarına bırakma.</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Progress Bar */}
        {items.length > 0 && (
          <div className="shrink-0 px-6 py-4 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
             <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                <span>İlerleme</span>
                <span>%{progress}</span>
             </div>
             <div className="h-2 w-full bg-gray-100 dark:bg-[#1E1E1E] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
             </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-[#090909]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-50">
              <div className="w-20 h-20 bg-gray-200 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <p className="font-bold text-lg text-gray-900 dark:text-white">Listeniz Boş</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yeni bir görev ekleyerek başlayın.</p>
            </div>
          ) : (
            <ul className="space-y-3 pb-20 md:pb-0">
              {items.map(item => (
                <li key={item.id} className={`flex gap-4 items-start p-4 rounded-2xl transition-all duration-300 group ${item.isCompleted ? 'bg-gray-100/50 dark:bg-[#121212]/50' : 'bg-white dark:bg-[#161616] shadow-sm border border-gray-100 dark:border-gray-800'}`}>
                  <button 
                    onClick={() => onToggle(item.id)} 
                    className={`shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all border ${item.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 hover:border-red-500'}`}
                  >
                    {item.isCompleted && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </button>
                  <span className={`flex-1 text-sm font-medium leading-relaxed transition-colors pt-0.5 ${item.isCompleted ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-200'}`}>{item.text}</span>
                  <button 
                    onClick={() => onDelete(item.id)} 
                    className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-2 2-2v6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer Input */}
        <div className="shrink-0 p-4 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 pb-safe">
            <form onSubmit={e => { e.preventDefault(); if(text.trim()) { onAdd(text); setText(''); } }} className="flex gap-2">
            <input 
                value={text} 
                onChange={e => setText(e.target.value)} 
                className="flex-1 bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white border border-transparent focus:bg-white dark:focus:bg-[#252525] focus:border-[#D81B2D] rounded-xl px-4 py-3.5 outline-none shadow-sm placeholder-gray-400 dark:placeholder-gray-600 transition-all text-sm" 
                placeholder="Yeni bir görev yaz..." 
            />
            <button 
                type="submit" 
                disabled={!text.trim()}
                className="bg-[#1A1A1A] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black w-12 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};