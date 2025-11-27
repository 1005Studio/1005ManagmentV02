
import React, { useRef, useState } from 'react';
import { DocumentItem } from '../types';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DocumentItem[];
  onAdd: (name: string, category: string, fileUrl: string, fileType: 'pdf' | 'image') => void;
  onDelete: (id: string) => void;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({ isOpen, onClose, items, onAdd, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Resmi Evrak');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && name.trim()) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const type = file.type.includes('pdf') ? 'pdf' : 'image';
        onAdd(name, category, base64String, type);
        setIsUploading(false);
        setName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } else {
        alert("Lütfen önce evrak adını giriniz.");
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = (item: DocumentItem) => {
      // Open Base64 in new tab
      const win = window.open();
      if (win) {
          if (item.fileType === 'pdf') {
             win.document.write('<iframe src="' + item.fileUrl + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
          } else {
             win.document.write('<img src="' + item.fileUrl + '" style="max-width:100%"/>');
          }
      }
  };

  const categories = ['Resmi Evrak', 'İmza Sirküleri', 'Vergi Levhası', 'Faaliyet Belgesi', 'Sözleşme', 'Banka', 'Diğer'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all animate-in fade-in duration-200">
      <div className="bg-[#F8F9FA] dark:bg-[#1E1E1E] rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] shadow-2xl border border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E]">
          <div>
            <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white font-brand flex items-center gap-3">
              <span className="bg-blue-600 text-white p-2 rounded-lg shadow-md shadow-blue-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </span>
              Şirket Evrakları
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 ml-1">Resmi belgeler ve sözleşmeler arşivi.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-gray-50 dark:bg-[#2C2C2C] hover:bg-gray-100 dark:hover:bg-[#3A3A3A] rounded-full transition-colors">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#FAFAFA] dark:bg-[#121212]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#1E1E1E] m-4">
              <div className="w-20 h-20 bg-gray-50 dark:bg-[#2C2C2C] rounded-full flex items-center justify-center mb-6">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <p className="font-bold text-xl text-gray-900 dark:text-white">Evrak Klasörü Boş</p>
              <p className="text-base mt-2 text-gray-500 dark:text-gray-400 max-w-md">Vergi levhası, imza sirküleri gibi önemli belgeleri buraya yükleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} onClick={() => handleDownload(item)} className="group bg-white dark:bg-[#1E1E1E] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-start gap-4 relative overflow-hidden">
                  {/* Icon based on type */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0 ${item.fileType === 'pdf' ? 'bg-red-500' : 'bg-blue-500'}`}>
                     {item.fileType === 'pdf' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/></svg>
                     ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                     )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-6">{item.name}</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{new Date(item.createdAt).toLocaleDateString('tr-TR')}</p>
                     <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 dark:bg-[#2C2C2C] text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded">
                        {item.category}
                     </span>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                    className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Sil"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Upload Bar */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E] relative z-20">
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
             <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Evrak Adı (Örn: 2025 Vergi Levhası)"
                   className="col-span-2 bg-gray-50 dark:bg-[#2C2C2C] border border-transparent focus:bg-white dark:focus:bg-[#333] focus:border-blue-500 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all dark:text-white"
                />
                <select
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="bg-gray-50 dark:bg-[#2C2C2C] border border-transparent focus:bg-white dark:focus:bg-[#333] focus:border-blue-500 rounded-xl px-4 py-3 outline-none text-sm font-bold text-gray-700 dark:text-gray-300"
                >
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>

             <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !name.trim()}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#1A1A1A] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] whitespace-nowrap"
             >
                {isUploading ? 'Yükleniyor...' : (
                <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Dosya Seç & Yükle
                </>
                )}
             </button>
          </div>
          <p className="text-xs text-gray-400 mt-3 ml-1">* PDF veya Resim dosyası (Max 5MB önerilir)</p>
        </div>
      </div>
    </div>
  );
};
