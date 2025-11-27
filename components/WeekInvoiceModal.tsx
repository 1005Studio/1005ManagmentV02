
import React from 'react';
import { VideoProject, PROJECT_PRICES, VideoStatus } from '../types';
import { StudioLogo } from './StudioLogo';

interface WeekInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel: string;
  items: VideoProject[];
}

// Helper for title case (Turkish support)
const toTitleCaseTR = (str: string) => {
    return str.toLocaleLowerCase('tr-TR').split(' ').map(word => 
        word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1)
    ).join(' ');
};

export const WeekInvoiceModal: React.FC<WeekInvoiceModalProps> = ({ isOpen, onClose, weekLabel, items }) => {
  if (!isOpen) return null;

  // Filter logic: Exclude CANCELLED and REPEAT items
  const invoicedItems = items.filter(i => i.isInvoiced && i.status !== VideoStatus.CANCELLED && i.status !== VideoStatus.REPEAT);
  
  // Sort items by date
  const sortedItems = [...invoicedItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalAmount = sortedItems.reduce((sum, item) => sum + (PROJECT_PRICES[item.type] * item.quantity), 0);
  const totalQuantity = sortedItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- POPUP PRINT FUNCTION ---
  const handlePrint = () => {
    // 1. Open a new window
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
        alert("Lütfen açılır pencerelere (pop-up) izin verin.");
        return;
    }

    // 2. Generate HTML Rows
    const rowsHtml = sortedItems.map((item, index) => `
      <tr class="border-b border-gray-200 even:bg-gray-50">
        <td class="py-2 pl-2 text-center text-gray-500 text-[10px] font-mono">${index + 1}</td>
        <td class="py-2 text-[10px] text-gray-700 whitespace-nowrap font-medium">${new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
        <td class="py-2 text-[10px] font-bold text-gray-900 tracking-tight whitespace-nowrap">${toTitleCaseTR(item.title)}</td>
        <td class="py-2 text-center text-[9px] text-gray-500 uppercase">${item.type}</td>
        <td class="py-2 text-center font-bold text-[10px] font-mono">${item.quantity}</td>
        <td class="py-2 pr-2 text-right font-bold text-[10px] text-black font-mono">${new Intl.NumberFormat('tr-TR').format(PROJECT_PRICES[item.type] * item.quantity)} ₺</td>
      </tr>
    `).join('');

    // 3. Construct Full HTML Document
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <title>Fatura - ${weekLabel}</title>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4 portrait; margin: 10mm; }
          .font-brand { font-family: 'Inter', sans-serif; }
        </style>
      </head>
      <body class="bg-white p-8 max-w-[210mm] mx-auto h-screen flex flex-col justify-between">
        
        <div>
            <!-- Header -->
            <div class="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
            <div class="flex items-center gap-4">
                <img src="/images/logo.png" class="h-12 object-contain" alt="1005 Studio" />
            </div>
            <div class="text-right">
                <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">HİZMET DÖKÜMÜ</h1>
                <div class="inline-block bg-gray-100 px-2 py-1 rounded mt-1">
                    <p class="text-[10px] font-bold text-gray-800 uppercase">${weekLabel}</p>
                </div>
                <p class="text-[9px] text-gray-400 mt-1 uppercase font-medium">Belge Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
            </div>
            </div>

            <!-- Table -->
            <table class="w-full text-left border-collapse mb-8">
            <thead>
                <tr class="border-b-2 border-black text-[9px] font-black text-gray-500 uppercase tracking-wider">
                <th class="py-2 pl-2 w-10 text-center">NO</th>
                <th class="py-2 w-24">TARİH</th>
                <th class="py-2">PROJE / İÇERİK</th>
                <th class="py-2 w-20 text-center">TÜR</th>
                <th class="py-2 w-12 text-center">ADET</th>
                <th class="py-2 pr-2 w-24 text-right">TUTAR</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
            <tfoot>
                <tr class="border-t-2 border-black bg-gray-50">
                    <td colspan="4" class="py-3 text-right text-[9px] font-black text-gray-500 uppercase tracking-widest">TOPLAM ADET</td>
                    <td class="py-3 text-center font-bold text-[10px] font-mono bg-gray-100">${totalQuantity}</td>
                    <td class="py-3 pr-2 text-right text-lg font-black text-black">
                       <div class="flex flex-col items-end leading-none">
                          <span class="text-[7px] text-gray-400 mb-1 font-normal uppercase tracking-wider">GENEL TOPLAM</span>
                          <span>${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalAmount)}</span>
                       </div>
                    </td>
                </tr>
            </tfoot>
            </table>
        </div>

        <div>
            <!-- Footer Signatures -->
            <div class="flex justify-between mt-8 pt-8 border-t border-dashed border-gray-300">
            <div class="w-1/3">
                <p class="text-[9px] font-bold text-gray-400 uppercase mb-8 tracking-wider">HAZIRLAYAN / ONAY</p>
                <div class="h-px w-32 bg-gray-900"></div>
                <p class="text-[9px] font-bold text-gray-900 mt-2">1005 Studio Yönetimi</p>
            </div>
            <div class="w-1/3 text-right flex flex-col items-end">
                <p class="text-[9px] font-bold text-gray-400 uppercase mb-8 tracking-wider">TESLİM ALAN / KAŞE</p>
                <div class="h-px w-32 bg-gray-900"></div>
            </div>
            </div>

            <div class="text-center pt-8 pb-4">
            <p class="text-[8px] text-gray-300 uppercase tracking-[0.3em] font-bold">1005 CREATIVE STUDIO MANAGER v2.0 • BİLGİ AMAÇLIDIR</p>
            </div>
        </div>

        <script>
           // Automatically print when loaded
           setTimeout(() => {
             window.print();
             // Optional: window.close(); // Close after print (commented out to let user check)
           }, 800);
        </script>
      </body>
      </html>
    `;

    // 4. Write to window
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Main Container */}
      <div className="bg-white w-full max-w-4xl md:rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-gray-900">
        
        {/* Header with Actions */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-lg text-gray-800 font-brand">Fatura Önizleme</h2>
            <div className="flex gap-2">
                <button onClick={handlePrint} className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    Yazdır (A4)
                </button>
                <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Kapat</button>
            </div>
        </div>

        {/* Preview Content (This is just for screen, not for print anymore) */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
            
            <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-12 min-h-[297mm]">
                
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 object-contain flex items-center justify-center">
                            <StudioLogo className="w-full h-full" />
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">HİZMET DÖKÜMÜ</h2>
                        <div className="inline-block bg-gray-100 px-2 py-1 rounded mt-1">
                            <p className="text-[10px] font-bold text-gray-800 uppercase">{weekLabel}</p>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-medium">Belge Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black text-[9px] font-black text-gray-500 uppercase tracking-wider">
                            <th className="py-2 pl-2 w-10 text-center">NO</th>
                            <th className="py-2 w-24">TARİH</th>
                            <th className="py-2">PROJE / İÇERİK</th>
                            <th className="py-2 w-20 text-center">KATEGORİ</th>
                            <th className="py-2 w-12 text-center">ADET</th>
                            <th className="py-2 w-24 text-right pr-2">TUTAR</th>
                        </tr>
                    </thead>
                    <tbody className="text-[10px] text-gray-800 font-medium">
                        {sortedItems.length === 0 ? (
                            <tr><td colSpan={6} className="py-8 text-center italic text-gray-400">Bu dönem için faturalandırılacak kalem bulunmamaktadır.</td></tr>
                        ) : (
                            sortedItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-gray-100 even:bg-gray-50/50">
                                    <td className="py-2 pl-2 text-center text-gray-400 font-mono">{index + 1}</td>
                                    <td className="py-2 whitespace-nowrap text-gray-600">{new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                    <td className="py-2 font-bold tracking-tight whitespace-nowrap truncate max-w-[250px] text-gray-900">
                                        {toTitleCaseTR(item.title)}
                                    </td>
                                    <td className="py-2 text-center">
                                        <span className="text-[8px] uppercase tracking-wide text-gray-500 font-bold border border-gray-200 px-1 rounded">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="py-2 text-center font-mono font-bold">{item.quantity}</td>
                                    <td className="py-2 text-right font-mono font-bold pr-2 text-black">
                                        {new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(PROJECT_PRICES[item.type] * item.quantity)} ₺
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    
                    {/* Footer Summary */}
                    <tfoot className="border-t-2 border-black bg-gray-50">
                        <tr>
                            <td colSpan={4} className="py-3 text-right text-[9px] font-black text-gray-500 uppercase tracking-widest align-middle">TOPLAM ADET</td>
                            <td className="py-3 text-center font-bold text-[10px] align-middle bg-gray-100">{totalQuantity}</td>
                            <td className="py-3 text-right pr-2 align-middle">
                                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest mr-2">GENEL TOPLAM</span>
                                <span className="text-lg font-black text-black tracking-tight">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalAmount)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Bottom Section */}
                <div className="mt-12 flex justify-between gap-12 pt-8 border-t border-dashed border-gray-300">
                    <div className="flex-1">
                        <p className="text-[8px] font-bold text-gray-400 uppercase mb-8 tracking-wider">HAZIRLAYAN / ONAY</p>
                        <div className="h-px w-32 bg-gray-300"></div>
                        <p className="text-[8px] text-gray-400 mt-2 font-medium">1005 Studio Yönetimi</p>
                    </div>
                    <div className="flex-1 text-right flex flex-col items-end">
                         <p className="text-[8px] font-bold text-gray-400 uppercase mb-8 tracking-wider">TESLİM ALAN / KAŞE</p>
                         <div className="h-px w-32 bg-gray-300"></div>
                    </div>
                </div>

                <div className="mt-12 text-center pt-2">
                    <p className="text-[7px] text-gray-300 uppercase tracking-[0.3em] font-bold">1005 CREATIVE STUDIO MANAGER v2.0 • BU BELGE BİLGİ AMAÇLIDIR</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
