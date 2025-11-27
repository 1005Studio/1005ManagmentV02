
import React from 'react';
import { VideoProject, PROJECT_PRICES, VideoStatus } from '../types';
import { StudioLogo } from './StudioLogo';

interface WeekInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel: string;
  items: VideoProject[];
}

export const WeekInvoiceModal: React.FC<WeekInvoiceModalProps> = ({ isOpen, onClose, weekLabel, items }) => {
  if (!isOpen) return null;

  // Filter logic: Exclude CANCELLED and REPEAT items
  const invoicedItems = items.filter(i => i.isInvoiced && i.status !== VideoStatus.CANCELLED && i.status !== VideoStatus.REPEAT);
  
  // Sort items by date
  const sortedItems = [...invoicedItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalAmount = sortedItems.reduce((sum, item) => sum + (PROJECT_PRICES[item.type] * item.quantity), 0);
  const totalQuantity = sortedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:block print:bg-white print:static print:inset-auto print:h-auto">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          
          body {
            visibility: hidden;
            background: white;
          }

          /* Force the modal content to be the only visible thing */
          #invoice-modal-content {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important; /* Safe print margin */
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: none !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
          }
          
          #invoice-modal-content * {
            visibility: visible;
          }

          .no-print {
            display: none !important;
          }

          /* Reset nice scrollbars for print */
          ::-webkit-scrollbar { display: none; }
          
          table { width: 100% !important; border-collapse: collapse !important; }
        }
      `}</style>

      {/* Main Container */}
      <div id="invoice-modal-content" className="bg-white w-full max-w-4xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:h-auto text-gray-900">
        
        {/* Screen-only Header with Actions */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 no-print">
            <h2 className="font-bold text-lg text-gray-800 font-brand">Fatura Önizleme</h2>
            <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    Yazdır
                </button>
                <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Kapat</button>
            </div>
        </div>

        {/* Scrollable Content Area (On Screen) / Full Page (Print) */}
        <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible bg-white">
            
            {/* --- INVOICE DOCUMENT START --- */}
            <div className="max-w-[210mm] mx-auto bg-white print:w-full print:max-w-none">
                
                {/* 1. Header Section */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 object-contain flex items-center justify-center">
                            <StudioLogo className="w-full h-full" />
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">HİZMET DÖKÜMÜ</h2>
                        <div className="inline-block bg-gray-100 print:bg-transparent px-2 py-1 rounded mt-1">
                            <p className="text-xs font-bold text-gray-800 uppercase">{weekLabel}</p>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-medium">Belge Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                </div>

                {/* 2. Dense Data Table */}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black text-[9px] font-black text-gray-500 uppercase tracking-wider">
                            <th className="py-2 pl-2 w-10 text-center">NO</th>
                            <th className="py-2 w-24">TARİH</th>
                            <th className="py-2">PROJE / İÇERİK</th>
                            <th className="py-2 w-24 text-center">KATEGORİ</th>
                            <th className="py-2 w-12 text-center">ADET</th>
                            <th className="py-2 w-24 text-right">BİRİM FİYAT</th>
                            <th className="py-2 w-24 text-right pr-2">TUTAR</th>
                        </tr>
                    </thead>
                    <tbody className="text-[10px] text-gray-800 font-medium">
                        {sortedItems.length === 0 ? (
                            <tr><td colSpan={7} className="py-12 text-center italic text-gray-400">Bu dönem için faturalandırılacak kalem bulunmamaktadır.</td></tr>
                        ) : (
                            sortedItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-gray-100 print:border-gray-200 even:bg-gray-50/50 print:even:bg-transparent">
                                    <td className="py-1.5 pl-2 text-center text-gray-400 font-mono">{index + 1}</td>
                                    <td className="py-1.5 whitespace-nowrap text-gray-600">{new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                    <td className="py-1.5 font-bold uppercase truncate max-w-[220px] print:max-w-none print:whitespace-normal">{item.title}</td>
                                    <td className="py-1.5 text-center">
                                        <span className="text-[9px] uppercase tracking-wide text-gray-500 font-bold border border-gray-200 px-1 rounded">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="py-1.5 text-center font-mono font-bold">{item.quantity}</td>
                                    <td className="py-1.5 text-right font-mono text-gray-500">
                                        {new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(PROJECT_PRICES[item.type])} ₺
                                    </td>
                                    <td className="py-1.5 text-right font-mono font-bold pr-2 text-black">
                                        {new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(PROJECT_PRICES[item.type] * item.quantity)} ₺
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    
                    {/* 3. Summary Footer */}
                    <tfoot className="border-t-2 border-black bg-gray-50 print:bg-transparent">
                        <tr className="border-t border-gray-300">
                            <td colSpan={4} className="py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest align-middle">TOPLAM ADET</td>
                            <td className="py-3 text-center font-bold text-xs align-middle bg-gray-100 print:bg-transparent">{totalQuantity}</td>
                            <td className="py-3 text-right text-[10px] font-black text-gray-900 uppercase tracking-widest align-middle">GENEL TOPLAM</td>
                            <td className="py-3 text-right pr-2 align-middle">
                                <span className="text-xl font-black text-black tracking-tight">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalAmount)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* 4. Bottom Section: Signatures & Disclaimer */}
                <div className="mt-12 flex justify-between gap-12 pt-6 border-t border-dashed border-gray-300 print:mt-16 page-break-inside-avoid">
                    <div className="flex-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-8 tracking-wider">HAZIRLAYAN / ONAY</p>
                        <div className="h-px w-32 bg-gray-300"></div>
                        <p className="text-[9px] text-gray-400 mt-2 font-medium">1005 Studio Yönetimi</p>
                    </div>
                    <div className="flex-1 text-right">
                         <p className="text-[9px] font-bold text-gray-400 uppercase mb-8 tracking-wider">TESLİM ALAN / KAŞE</p>
                         <div className="h-px w-32 bg-gray-300 ml-auto"></div>
                    </div>
                </div>

                <div className="mt-8 text-center pt-2 print:fixed print:bottom-4 print:left-0 print:w-full">
                    <p className="text-[8px] text-gray-300 uppercase tracking-[0.3em] font-bold">1005 CREATIVE STUDIO MANAGER v2.0 • BU BELGE BİLGİ AMAÇLIDIR</p>
                </div>
            </div>
            {/* --- INVOICE DOCUMENT END --- */}

        </div>
      </div>
    </div>
  );
};
