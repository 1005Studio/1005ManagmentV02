import React, { useState, useEffect } from 'react';
import { VideoStatus, VideoType, VideoProject, ProductStatus } from '../types';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, title: string, quantity: number, status: VideoStatus, type: VideoType, productStatus: ProductStatus, notes: string) => void;
  initialData?: VideoProject | null;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<VideoStatus>(VideoStatus.PLANNED);
  const [type, setType] = useState<VideoType>(VideoType.VIDEO);
  const [productStatus, setProductStatus] = useState<ProductStatus>(ProductStatus.NOT_ARRIVED);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setQuantity(initialData.quantity);
      setStatus(initialData.status);
      setType(initialData.type);
      setProductStatus(initialData.productStatus || ProductStatus.NOT_ARRIVED);
      setNotes(initialData.notes || '');
    } else if (isOpen) {
      setTitle(''); 
      setDate(new Date().toISOString().split('T')[0]); 
      setQuantity(1); 
      setStatus(VideoStatus.PLANNED); 
      setType(VideoType.VIDEO); 
      setProductStatus(ProductStatus.NOT_ARRIVED);
      setNotes('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const typeOptions = [
    { label: VideoType.VIDEO, color: 'border-blue-200 text-blue-700 peer-checked:bg-blue-600 peer-checked:text-white' },
    { label: VideoType.ANIMATION, color: 'border-purple-200 text-purple-700 peer-checked:bg-purple-600 peer-checked:text-white' },
    { label: VideoType.LIFESTYLE, color: 'border-teal-200 text-teal-700 peer-checked:bg-teal-600 peer-checked:text-white' },
    { label: VideoType.RED_ACTUAL, color: 'border-red-200 text-red-700 peer-checked:bg-red-600 peer-checked:text-white' },
    { label: VideoType.LOWER_THIRD, color: 'border-orange-200 text-orange-700 peer-checked:bg-orange-500 peer-checked:text-white' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-enter-modal">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-brand">{initialData ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase mb-2 tracking-wider">Proje Türü</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {typeOptions.map(opt => (
                  <label key={opt.label} className="cursor-pointer relative group">
                    <input type="radio" name="type" checked={type === opt.label} onChange={() => setType(opt.label as VideoType)} className="peer sr-only" />
                    <div className={`text-center py-2.5 px-1 border rounded-lg ${opt.color} bg-white hover:bg-gray-50 hover:shadow-sm transition-all font-bold text-[10px] uppercase shadow-sm peer-checked:shadow-md peer-checked:scale-[1.02]`}>
                      {opt.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase mb-2 tracking-wider">Proje Başlığı / Konusu</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Örn: Şirket Tanıtım Filmi" 
                className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 shadow-sm text-sm font-medium" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label className="block text-xs font-bold text-gray-900 uppercase mb-2 tracking-wider">Ürün Durumu</label>
                 <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    {[ProductStatus.NOT_ARRIVED, ProductStatus.ARRIVED].map((s) => (
                      <button
                        key={s}
                        onClick={() => setProductStatus(s)}
                        className={`w-24 py-2 text-xs font-bold rounded-md transition-all flex-1 ${productStatus === s ? (s === ProductStatus.ARRIVED ? 'bg-green-500 text-white shadow-sm' : 'bg-red-600 text-white shadow-sm') : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        {s === ProductStatus.ARRIVED ? '📦 Ürün Geldi' : '⏳ Gelmedi'}
                      </button>
                    ))}
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase mb-2 tracking-wider">Tarih</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none shadow-sm text-sm" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-2 tracking-wider">Adet</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={e => setQuantity(Number(e.target.value))} 
                  className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none shadow-sm text-sm font-bold text-center" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase mb-2 tracking-wider">Durum</label>
                <div className="relative">
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value as VideoStatus)} 
                    className="w-full p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none shadow-sm appearance-none text-sm font-medium pl-3 pr-8"
                  >
                    {Object.values(VideoStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase mb-2 tracking-wider">Notlar / Açıklama</label>
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Örn: 2 revize hakkı var, müzik seçimi önemli..." 
                className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 shadow-sm text-sm min-h-[80px]" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={onClose} 
              className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              İptal
            </button>
            <button 
              onClick={() => onSave(date, title, quantity, status, type, productStatus, notes)} 
              className="px-8 py-2.5 bg-[#D81B2D] hover:bg-[#b91625] text-white rounded-lg font-bold shadow-md hover:shadow-lg transform active:scale-95 transition-all text-sm"
            >
              Kaydet
            </button>
        </div>
      </div>
    </div>
  );
};