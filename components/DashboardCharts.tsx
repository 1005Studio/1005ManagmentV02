import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { VideoProject, VideoStatus, VideoType } from '../types';

interface DashboardChartsProps {
  videos: VideoProject[];
  isOpen: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ videos, isOpen }) => {
  if (!isOpen) return null;

  // 1. Status Distribution Data
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach(v => {
      // Group active statuses
      let key = v.status;
      if (v.status === VideoStatus.PLANNED) key = 'Plan';
      if (v.status === VideoStatus.SHOOTING) key = 'Çekim';
      if (v.status === VideoStatus.EDITING) key = 'Kurgu';
      if (v.status === VideoStatus.REVIEW) key = 'Revize';
      if (v.status === VideoStatus.COMPLETED) key = 'Tamam';
      
      // Don't chart cancelled/repeat usually, or group them
      if (v.status !== VideoStatus.CANCELLED && v.status !== VideoStatus.REPEAT) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [videos]);

  const COLORS = ['#60A5FA', '#A78BFA', '#FB923C', '#FACC15', '#4ADE80'];

  // 2. Type Distribution Data
  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach(v => {
      if (v.status !== VideoStatus.CANCELLED && v.status !== VideoStatus.REPEAT) {
        let shortName = v.type === VideoType.RED_ACTUAL ? 'Kırmızı' : v.type;
        shortName = shortName === VideoType.LOWER_THIRD ? 'Altbant' : shortName;
        counts[shortName] = (counts[shortName] || 0) + v.quantity; // Sum quantity, not just rows
      }
    });
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    })).sort((a, b) => b.count - a.count);
  }, [videos]);

  // 3. Timeline Data (Daily Activity)
  const timelineData = useMemo(() => {
    const days: Record<string, { date: string, total: number, completed: number }> = {};
    
    // Sort videos by date first
    const sorted = [...videos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(v => {
      if (v.status !== VideoStatus.CANCELLED && v.status !== VideoStatus.REPEAT) {
        const d = new Date(v.date);
        const dayKey = `${d.getDate()} ${d.toLocaleString('tr-TR', { month: 'short' })}`;
        
        if (!days[dayKey]) {
          days[dayKey] = { date: dayKey, total: 0, completed: 0 };
        }
        
        days[dayKey].total += v.quantity;
        if (v.isCompleted) {
          days[dayKey].completed += v.quantity;
        }
      }
    });

    return Object.values(days);
  }, [videos]);

  // Custom Tooltip for Dark Mode
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1A1A1A] p-3 border border-gray-100 dark:border-gray-700 shadow-xl rounded-lg">
          <p className="font-bold text-gray-900 dark:text-white text-xs mb-1">{label}</p>
          {payload.map((p: any, idx: number) => (
             <p key={idx} className="text-xs font-medium" style={{ color: p.color || p.fill }}>
                {p.name}: {p.value}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Status Pie */}
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-64 flex flex-col">
           <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Proje Durum Dağılımı</h3>
           <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', opacity: 0.7 }} />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Card 2: Type Bar */}
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-64 flex flex-col">
           <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Video Türleri</h3>
           <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.2} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fill: '#9CA3AF'}} interval={0} />
                 <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                 <Bar dataKey="count" name="Adet" fill="#D81B2D" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Card 3: Timeline Area */}
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-64 flex flex-col">
           <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">İş Tamamlama Hızı</h3>
           <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="date" tick={{fontSize: 9, fill: '#9CA3AF'}} interval="preserveStartEnd" minTickGap={30} />
                 <YAxis tick={{fontSize: 10, fill: '#9CA3AF'}} />
                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                 <Tooltip content={<CustomTooltip />} />
                 <Area type="monotone" dataKey="total" name="Planlanan" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                 <Area type="monotone" dataKey="completed" name="Tamamlanan" stroke="#10B981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
};
