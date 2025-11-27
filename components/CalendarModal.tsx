
import React, { useState, useMemo } from 'react';
import { VideoProject, VideoStatus, MONTHS_TR, VideoType } from '../types';
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
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now.toISOString().split('T')[0]);
  };

  // Group videos by date
  const videosByDate = useMemo(() => {
    const groups: Record<string, VideoProject[]> = {};
    videos.forEach(v => {
      // Exclude cancelled/repeat items if desired, currently showing but dimmed logic can be applied
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
      daysArray.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 dark:bg-[#151515] border border-gray-100 dark:border-gray-800"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayVideos = videosByDate[dateStr] || [];
      const totalCount = dayVideos.reduce((acc, v) => acc + v.quantity, 0);
      
      const todayStr = new Date().toISOString().split('T')[0];
      const isToday = todayStr === dateStr;
      const isSelected = selectedDay === dateStr;

      daysArray.push(
        <div 
          key={d} 
          onClick={() => setSelectedDay(dateStr)}
          className={`h-24 border border-gray-100 dark:border-gray-800 p-2 relative cursor-pointer transition-all hover:bg-white dark:hover:bg-[#252525] flex flex-col justify-between
            ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-[#FAFAFA] dark:bg-[#1E1E1E]'}
            ${isSelected ? 'ring-2 ring-inset ring-[#D81B2D] z-10 bg-white dark:bg-[#252525]' : ''}
          `}
        >
          <div className="flex justify-between items-start">
             <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>{d}</span>
             {totalCount > 0 && (
                <span className="text-[9px] font-bold text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 rounded">{totalCount}</span>
             )}
          </div>
          
          <div className="flex flex-wrap gap-1 content-end">
             {dayVideos.slice(0, 8).map((v, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${
                     v.type === VideoType.VIDEO ? 'bg-blue-500' : 
                     v.type === VideoType.ANIMATION ? 'bg-purple-500' :
                     v.type === VideoType.RED_ACTUAL ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                  title={v.title}
                />
             ))}
             {dayVideos.length > 8 && <span className="text-[8px] text-gray-400 leading-none">+</span>}
          </div>
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
             <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1E1E1E] rounded-lg p-1 shadow-inner">
                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white dark:hover:bg-[#2C2C2C] rounded-md transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg></button>
                <span className="text-sm font-bold w-32 text-center uppercase select-none text-gray-800 dark:text-gray-200">{MONTHS_TR[month]} {year}</span>
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
            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-[#000]">
                <div className="grid grid-cols-7 gap-px mb-2">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                        <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {renderDays()}
                </div>
            </div>

            {/* Sidebar Details (Mobile: Bottom, Desktop: Right) */}
            <div className={`bg-gray-50 dark:bg-[#121212] border-l border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ${selectedDay ? 'h-72 md:h-full md:w-96' : 'h-0 md:h-full md:w-0 overflow-hidden'}`}>
                {selectedDay && (
                    <>
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161616]">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white font-brand">
                                {new Date(selectedDay).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-[#D81B2D]"></span>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{selectedDayVideos.length} Proje Kayıtlı</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {selectedDayVideos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                   <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#222] flex items-center justify-center mb-2">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                   </div>
                                   <p className="text-sm font-medium">Bu tarihte planlanmış proje yok.</p>
                                </div>
                            ) : (
                                selectedDayVideos.map(video => (
                                    <div key={video.id} className="p-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 shadow-sm hover:border-[#D81B2D] transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded text-white tracking-wide ${
                                                video.type === VideoType.VIDEO ? 'bg-blue-600' : 
                                                video.type === VideoType.ANIMATION ? 'bg-purple-600' :
                                                video.type === VideoType.RED_ACTUAL ? 'bg-red-600' : 'bg-orange-600'
                                            }`}>{video.type}</span>
                                            <span className="text-xs font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#333] px-1.5 py-0.5 rounded">x{video.quantity}</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-snug mb-3 group-hover:text-[#D81B2D] transition-colors">{video.title}</h4>
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
