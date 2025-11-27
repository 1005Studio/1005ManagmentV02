
import React, { useState } from 'react';
import { ToDoItem } from '../types';

export const ToDoModal: React.FC<{ isOpen: boolean, onClose: () => void, items: ToDoItem[], onAdd: (t: string) => void, onToggle: (id: string) => void, onDelete: (id: string) => void }> = ({ isOpen, onClose, items, onAdd, onToggle, onDelete }) => {
  const [text, setText] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col h-[80vh] shadow-2xl border border-gray-100 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="font-extrabold text-xl text-gray-900 font-brand tracking-tight">Yapılacaklar</h2>
            <p className="text-xs text-gray-500 font-medium">Tamamlanan: {items.filter(i => i.isCompleted).length} / {items.length}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50/30">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-50"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <p className="font-medium text-gray-500">Not defterin boş</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.id} className={`flex gap-3 items-start group p-3 rounded-xl transition-all duration-300 ${item.isCompleted ? 'bg-gray-50 opacity-70' : 'bg-white shadow-sm border border-gray-100 hover:shadow-md'}`}>
                  <button 
                    onClick={() => onToggle(item.id)} 
                    className={`mt-0.5 min-w-[20px] h-5 rounded-md flex items-center justify-center transition-all ${item.isCompleted ? 'bg-gray-400' : 'border-2 border-[#D81B2D] hover:bg-red-50'}`}
                  >
                    {item.isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </button>
                  <span className={`flex-1 text-sm font-medium leading-relaxed transition-colors ${item.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.text}</span>
                  <button 
                    onClick={() => onDelete(item.id)} 
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Sil"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-2 2-2v6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <form onSubmit={e => { e.preventDefault(); if(text.trim()) { onAdd(text); setText(''); } }} className="p-4 border-t border-gray-100 bg-white flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <input 
            value={text} 
            onChange={e => setText(e.target.value)} 
            className="flex-1 bg-gray-50 text-gray-900 border border-transparent focus:bg-white focus:border-[#D81B2D] rounded-xl px-4 py-3 outline-none shadow-sm placeholder-gray-400 transition-all" 
            placeholder="Yeni not..." 
          />
          <button 
            type="submit" 
            disabled={!text.trim()}
            className="bg-[#1A1A1A] hover:bg-black text-white px-5 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};
