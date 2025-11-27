
import React, { useState, useMemo } from 'react';
import { VideoProject, VideoStatus, MONTHS_TR } from '../types';
import { StatusBadge } from './StatusBadge';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoProject[];
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, videos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  // Adjust for Monday start (Turkey)
  // 0(Sun) -> 6, 1(Mon) -> 0, 2(Tue) -> 1 ...
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  // Group videos by date
  const videosByDate = useMemo(() => {
    const groups: Record<string, VideoProject[]> = {};
    videos.forEach(v => {
      // Exclude cancelled? Optional. Let's keep them but maybe dim them.
      if (v.status !== VideoStatus.CANCELLED && v.status !== VideoStatus.REPEAT) {
          const dateKey = v.date; // YYYY-MM-DD
          if (!groups[dateKey]) groups[dateKey] = [];
          groups[dateKey].push(v);
      }
    });
    return groups;
  }, [videos]);

  const renderDays = () => {
    const daysArray = [];
    
    // Empty slots for previous month
    for (let i = 0; i < startingDayIndex; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/30 dark:bg-[#151515] border border-gray-100 dark:border-gray-800"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayVideos = videosByDate[dateStr] || [];
      const totalCount = dayVideos.reduce((acc, v) => acc + v.quantity, 0);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isSelected = selectedDay === dateStr;

      daysArray.push(
        <div 
          key={d} 
          onClick={() => setSelectedDay(dateStr)}
          className={`h-24 border border-gray-100 dark:border-gray-800 p-2 relative cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#252525] flex flex-col items-center justify-center gap-1
            ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-[#1E1E1E]'}
            ${isSelected ? 'ring-2 ring-[#D81B2D] z-10' : ''}
          `}
        >
          <span className={`absolute top-2 left-2 text-xs font-bold ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>{d}</span>
          
          {totalCount > 0 && (
            <div className="flex flex-col items-center animate-in zoom-in-50">
               <span className="text-2xl font-black text-[#D81B2D] dark:text-white leading-none tracking-tighter">{totalCount}</span>
               <span className="text-[9px] font-bold text-gray-400 uppercase">PROJE</span>
            </div>
          )}
        </div>
      );
    }
    return daysArray;
  };

  const selectedDayVideos = selectedDay ? (videosByDate[selectedDay] || []) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-6 transition-all animate-in fade-in duration-200">
      <div className="bg-[#F8F9FA] dark:bg-[#090909] w-full h-full md:rounded-3xl md:max-w-6xl overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="shrink-0 px-6 py-4 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white font-brand flex items-center gap-3">
                <span className="bg-[#1A1A1A] dark:bg-white text-white dark:text-black p-2 rounded-xl"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                Takvim
             </h2>
             <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1E1E1E] rounded-lg p-1">
                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white dark:hover:bg-[#2C2C2C] rounded-md transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg></button>
                <span className="text-sm font-bold w-32 text-center uppercase">{MONTHS_TR[month]} {year}</span>
                <button onClick={handleNextMonth} className="p-1.5 hover:bg-white dark:hover:bg-[#2C2C2C] rounded-md transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></button>
             </div>
             <button onClick={handleToday} className="text-xs font-bold text-blue-600 hover:underline">Bugün</button>
          </div>
          <button onClick={onClose} className="p-2.5 bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-all">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Calendar Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-[#090909]">
                <div className="grid grid-cols-7 gap-px mb-1">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                        <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase py-2 tracking-wider">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                    {renderDays()}
                </div>
            </div>

            {/* Sidebar Details (Mobile: Bottom, Desktop: Right) */}
            <div className={`bg-white dark:bg-[#161616] border-l border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 ${selectedDay ? 'h-64 md:h-full md:w-80' : 'h-0 md:h-full md:w-0 overflow-hidden'}`}>
                {selectedDay && (
                    <>
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1E1E1E]">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {new Date(selectedDay).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                            <p className="text-xs text-gray-500">{selectedDayVideos.length} Proje Kaydı</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {selectedDayVideos.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-10">Bu tarihte proje yok.</p>
                            ) : (
                                selectedDayVideos.map(video => (
                                    <div key={video.id} className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded text-white ${
                                                video.type.includes('Video') ? 'bg-blue-500' : 'bg-orange-500'
                                            }`}>{video.type}</span>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">x{video.quantity}</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-tight mb-2">{video.title}</h4>
                                        <div className="flex justify-between items-center">
                                            <StatusBadge status={video.status} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
