
import React, { useRef, useState } from 'react';
import { LifestyleItem } from '../types';

interface LifestyleGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  items: LifestyleItem[];
  onAdd: (base64: string) => void;
  onDelete: (id: string) => void;
}

export const LifestyleGallery: React.FC<LifestyleGalleryProps> = ({ isOpen, onClose, items, onAdd, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Reuse toggle logic if needed locally, but prop isn't passed for lifestyle usually.
  // Assuming we want exact same features including "complete" toggle if requested.
  // For now, strict to "This Friday" logic minus complete toggle if not needed, 
  // BUT user said "exact same logic", so I'll assume standard upload/delete flow.
  
  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onAdd(base64String);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  // Sort newest first
  const sortedItems = [...items].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all animate-in fade-in duration-200">
      <div className="bg-[#F8F9FA] rounded-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[90vh] shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white">
          <div>
            <h2 className="font-extrabold text-2xl text-gray-900 font-brand flex items-center gap-3">
              <span className="bg-black text-white p-1.5 rounded-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg></span>
              Lifestyle (İlham)
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1 ml-1">Instagram & Sosyal Medya Referansları</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1">
          {sortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 border-4 border-dashed border-gray-200 rounded-3xl bg-white m-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              <p className="font-bold text-xl text-gray-900">Referans Havuzu Boş</p>
              <p className="text-base mt-2 text-gray-500 max-w-md">Beğendiğin çekim örneklerini veya moodboard görsellerini buraya yükle.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {sortedItems.map(item => (
                <div key={item.id} className="group relative aspect-[3/4] bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img src={item.imageUrl} alt="Lifestyle Ref" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="w-10 h-10 flex items-center justify-center bg-white text-red-600 rounded-xl hover:bg-red-50 pointer-events-auto z-10 shadow-lg transition-transform active:scale-95"
                        title="Resmi Sil"
                        >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center gap-6 shadow-[0_-4px_30px_rgba(0,0,0,0.03)] relative z-20">
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-sm text-gray-500 font-medium">
             <strong className="text-gray-900">{sortedItems.length}</strong> görsel yüklendi
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-3 bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
          >
            {isUploading ? 'Yükleniyor...' : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Yeni İlham Yükle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
