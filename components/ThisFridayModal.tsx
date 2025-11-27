import React, { useRef, useState } from 'react';
import { GalleryItem } from '../types';
import { ImageViewer } from './ImageViewer';

interface ThisFridayModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  onAdd: (base64: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const ThisFridayModal: React.FC<ThisFridayModalProps> = ({ isOpen, onClose, items, onAdd, onDelete, onToggle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md md:p-4 transition-all animate-in fade-in duration-200">
        <div className="bg-[#F8F9FA] dark:bg-[#090909] w-full h-full md:rounded-3xl md:max-w-6xl overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800">
          
          {/* Header */}
          <div className="shrink-0 px-6 py-5 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white font-brand flex items-center gap-3">
                <span className="bg-[#D81B2D] text-white p-2 rounded-xl shadow-lg shadow-red-600/20"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></span>
                Bu Cuma
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 ml-1">Styling referansları ve ürün hazırlığı.</p>
            </div>
            <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-all">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 dark:bg-[#090909]">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-60">
                <div className="w-24 h-24 bg-gray-200 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center mb-6">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <p className="font-bold text-xl text-gray-900 dark:text-white">Görsel Havuzu Boş</p>
                <p className="text-base mt-2 text-gray-500 dark:text-gray-400 max-w-md">Çekim için styling referanslarını buraya yükleyin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 pb-24 md:pb-0">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    onClick={() => openLightbox(index)}
                    className={`group relative aspect-square bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border cursor-zoom-in overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${item.isCompleted ? 'border-green-500/50 ring-4 ring-green-500/10' : 'border-gray-100 dark:border-gray-800'}`}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt="Ref" 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.isCompleted ? 'grayscale-[80%] opacity-70' : ''}`} 
                    />
                    
                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                          <button 
                          onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
                          className={`flex-1 py-2 rounded-lg shadow-lg text-[10px] font-bold pointer-events-auto z-10 transition-transform active:scale-95 border border-white/10 ${item.isCompleted ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}
                          >
                          {item.isCompleted ? "GERİ AL" : "TAMAMLA"}
                          </button>
                          <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white/20 hover:bg-red-600 text-white rounded-lg pointer-events-auto z-10 backdrop-blur-md transition-all active:scale-95"
                          title="Sil"
                          >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {item.isCompleted && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1 z-20 tracking-wide">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        HAZIR
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="shrink-0 p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121212] flex justify-between items-center gap-6 relative z-20 pb-safe">
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              <strong className="text-gray-900 dark:text-white">{items.length}</strong> görsel
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-3 bg-[#1A1A1A] dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all disabled:opacity-70 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
            >
              {isUploading ? 'Yükleniyor...' : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span className="hidden md:inline">Yeni Görsel Yükle</span>
                  <span className="md:hidden">Yükle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Viewer */}
      <ImageViewer 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={items.map(i => ({ id: i.id, url: i.imageUrl }))}
        currentIndex={currentImageIndex}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};