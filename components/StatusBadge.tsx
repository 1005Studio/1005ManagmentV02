import React from 'react';
import { VideoStatus } from '../types';

// Icons
const PlanIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="16" y1="14" x2="12" y2="12"/></svg>;
const ShootIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15.6 2.7a10 10 0 1 0 5.7 5.7"/><circle cx="12" cy="12" r="2"/></svg>;
const EditIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"/><line x1="3" y1="22" x2="21" y2="22"/></svg>;
const ReviewIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const CompleteIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const CancelIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const RepeatIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;

export const StatusBadge: React.FC<{ status: VideoStatus }> = ({ status }) => {
  const getStyles = (s: VideoStatus) => {
    switch (s) {
      case VideoStatus.PLANNED: return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case VideoStatus.SHOOTING: return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case VideoStatus.EDITING: return 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case VideoStatus.REVIEW: return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case VideoStatus.COMPLETED: return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case VideoStatus.CANCELLED: return 'bg-gray-100 text-gray-400 border-gray-200 line-through decoration-gray-400 opacity-70 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700';
      case VideoStatus.REPEAT: return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = (s: VideoStatus) => {
    switch (s) {
        case VideoStatus.PLANNED: return <PlanIcon />;
        case VideoStatus.SHOOTING: return <ShootIcon />;
        case VideoStatus.EDITING: return <EditIcon />;
        case VideoStatus.REVIEW: return <ReviewIcon />;
        case VideoStatus.COMPLETED: return <CompleteIcon />;
        case VideoStatus.CANCELLED: return <CancelIcon />;
        case VideoStatus.REPEAT: return <RepeatIcon />;
        default: return null;
    }
  }

  return (
    <span className={`relative inline-flex items-center justify-center gap-1.5 w-28 py-1.5 rounded-lg text-[10px] font-bold border ${getStyles(status)} shadow-sm whitespace-nowrap uppercase tracking-tight transition-all duration-300`}>
      {status === VideoStatus.SHOOTING && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse border border-white dark:border-black"></span>
      )}
      <span className={`${status === VideoStatus.SHOOTING ? 'animate-pulse-slow' : ''}`}>
        {getIcon(status)}
      </span>
      {status}
    </span>
  );
};