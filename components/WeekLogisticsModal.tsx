
import React from 'react';
import { ProductStatus, VideoProject, VideoStatus } from '../types';

interface WeekLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel: string;
  items: VideoProject[];
}

export const WeekLogisticsModal: React.FC<WeekLogisticsModalProps> = ({ isOpen, onClose, weekLabel, items }) => {
  if (!isOpen) return null;

  // Filter ONLY missing items regardless of project status
  // Even if cancelled, if product status is NOT_ARRIVED, it shows here.
  // UPDATE: Now ignoring CANCELLED and REPEAT projects from missing list
  const missingItems = items.filter(i => i.productStatus === ProductStatus.NOT_ARRIVED && i.status !== VideoStatus.CANCELLED && i.status !== VideoStatus.REPEAT);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 text-left">
      {/* Screenshot-ready Compact Container */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200">
        
        {/* Compact Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center gap-3">
                <div className="bg-red-600 text-white p-1.5 rounded-lg shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </div>
                <div>
                    <h2 className="font-brand font-black text-base text-red-900 uppercase tracking-tight leading-none">EKSİK ÜRÜN LİSTESİ</h2>
                    <p className="text-[10px] font-bold text-red-400 mt-0.5">{weekLabel}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-red-300 hover:text-red-600 p-1 rounded transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        
        {/* Dense List */}
        <div className="overflow-y-auto flex-1 bg-white">
            {missingItems.length === 0 ? (
                <div className="py-10 text-center">
                    <p className="text-sm font-bold text-green-600">Tüm ürünler tamam!</p>
                </div>
            ) : (
                <table className="w-full text-left">
                    <tbody className="divide-y divide-gray-100">
                        {missingItems.map((item, index) => (
                            <tr key={item.id} className="group hover:bg-red-50/30 transition-colors">
                                <td className="pl-5 py-2.5 w-8 align-middle">
                                    <span className="flex items-center justify-center w-5 h-5 rounded bg-gray-100 text-gray-500 text-[10px] font-bold">{index + 1}</span>
                                </td>
                                <td className="px-3 py-2.5 align-middle">
                                    <span className="font-bold text-gray-900 text-sm leading-tight block">{item.title}</span>
                                </td>
                                <td className="px-3 py-2.5 w-24 align-middle text-right">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">{new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                                </td>
                                <td className="pr-5 py-2.5 w-20 align-middle text-right">
                                    <span className="inline-block text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase tracking-tight whitespace-nowrap">
                                        GELMEDİ
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        
        {/* Minimal Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">1005 STUDIO</p>
            <div className="text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded">
                {missingItems.length} ADET EKSİK
            </div>
        </div>
      </div>
    </div>
  );
};