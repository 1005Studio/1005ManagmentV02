import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VideoProject, VideoStatus, VideoType, MONTHS_TR, FilterState, PROJECT_PRICES, ToDoItem, EquipmentItem, SubscriptionItem, ProductStatus, GalleryItem, LifestyleItem, DocumentItem } from './types';
import { StatusBadge } from './components/StatusBadge';
import { AddVideoModal } from './components/AddVideoModal';
import { ToDoModal } from './components/ToDoModal';
import { EquipmentModal } from './components/EquipmentModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ThisFridayModal } from './components/ThisFridayModal';
import { LifestyleGallery } from './components/LifestyleGallery';
import { DocumentsModal } from './components/DocumentsModal';
import { WeekInvoiceModal } from './components/WeekInvoiceModal';
import { WeekLogisticsModal } from './components/WeekLogisticsModal';
import { DashboardCharts } from './components/DashboardCharts';
import { db, auth } from './firebaseConfig';
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { StudioLogo } from './components/StudioLogo';
import { BimLogo } from './components/BimLogo';
import { LoginPage } from './components/LoginPage';

// --- Icons ---
const PlusIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const BillIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v4h4"/><path d="M8 11h8"/><path d="M8 15h6"/><path d="M9 2v20"/></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const ChevronDownIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const ChevronUpIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
const PrintIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const ListIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const DatabaseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
const ChevronLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const CameraIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const CreditCardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
const BoxIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GalleryIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const GridIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const AlertIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const ImageIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const MoonIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
const SunIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const FileTextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const ChartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="8" y1="12" x2="8" y2="17"/><line x1="12" y1="17" x2="12" y2="10"/><line x1="16" y1="17" x2="16" y2="7"/></svg>;
const StickyNoteIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>;
const LogOutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

// New Icons for Stats
const FilmIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const MagicIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></svg>;
const ApertureIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>;
const LayoutIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="3 9h18"/><path d="M9 21V9"/></svg>;

const App: React.FC = () => {
  // -- Auth State --
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // -- App State --
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [toDoItems, setToDoItems] = useState<ToDoItem[]>([]);
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [subscriptionItems, setSubscriptionItems] = useState<SubscriptionItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [lifestyleItems, setLifestyleItems] = useState<LifestyleItem[]>([]);
  const [documentItems, setDocumentItems] = useState<DocumentItem[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToDoOpen, setIsToDoOpen] = useState(false);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLifestyleOpen, setIsLifestyleOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
  const [isWeekInvoiceOpen, setIsWeekInvoiceOpen] = useState(false);
  const [isWeekLogisticsOpen, setIsWeekLogisticsOpen] = useState(false);
  const [selectedWeekLabel, setSelectedWeekLabel] = useState('');
  const [selectedWeekItems, setSelectedWeekItems] = useState<VideoProject[]>([]);

  const [editingVideo, setEditingVideo] = useState<VideoProject | null>(null);

  const [filter, setFilter] = useState<FilterState>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [activeTypeFilter, setActiveTypeFilter] = useState<VideoType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilterState, setProductFilterState] = useState<'ALL' | 'ARRIVED' | 'NOT_ARRIVED'>('ALL');
  
  const [activeTab, setActiveTab] = useState<'home'|'todo'|'equipment'|'subscription'>('home');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    // Check local auth
    const local = localStorage.getItem('1005_auth');
    if (local === 'true') {
        setIsLocalAuth(true);
        setAuthLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (!local) setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // AUTH HANDLERS
  const handleLogout = () => {
    signOut(auth).catch(() => {});
    localStorage.removeItem('1005_auth');
    setIsLocalAuth(false);
    // Reload to clear state
    window.location.reload();
  };

  const handleLocalLoginSuccess = () => {
    localStorage.setItem('1005_auth', 'true');
    setIsLocalAuth(true);
  };

  const isAuthenticated = firebaseUser !== null || isLocalAuth;

  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) return; // Only fetch if logged in

    const refs = [
      { ref: ref(db, 'videos'), setter: setVideos },
      { ref: ref(db, 'todos'), setter: setToDoItems },
      { ref: ref(db, 'equipments'), setter: setEquipmentItems },
      { ref: ref(db, 'subscriptions'), setter: setSubscriptionItems },
      { ref: ref(db, 'thisFridayGallery'), setter: setGalleryItems },
      { ref: ref(db, 'lifestyleGallery'), setter: setLifestyleItems },
      { ref: ref(db, 'documents'), setter: setDocumentItems },
    ];

    const unsubscribers = refs.map(({ ref, setter }) => 
      onValue(ref, (snapshot) => {
        const data = snapshot.val();
        setter(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      })
    );

    const activePeriodRef = ref(db, 'settings/activePeriod');
    const periodUnsub = onValue(activePeriodRef, (snapshot) => {
       const data = snapshot.val();
       if (data) {
         setFilter({ month: data.month, year: data.year });
       }
    });

    return () => { unsubscribers.forEach(unsub => unsub()); periodUnsub(); };
  }, [isAuthenticated]); // Re-run when auth state changes

  const handleAddVideo = (date: string, title: string, quantity: number, status: VideoStatus, type: VideoType, productStatus: ProductStatus, notes: string) => {
    if (editingVideo) {
      update(ref(db, `videos/${editingVideo.id}`), { date, title, quantity, status, type, productStatus, notes })
        .then(() => setEditingVideo(null));
    } else {
      push(ref(db, 'videos'), { date, title, quantity, status, type, productStatus, notes, isCompleted: false, isInvoiced: false });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => confirm('Silinsin mi?') && remove(ref(db, `videos/${id}`));
  const toggleComplete = (id: string) => {
    const v = videos.find(v => v.id === id);
    if (v) {
      const newState = !v.isCompleted;
      const updates: any = { isCompleted: newState };
      if (newState) updates.status = VideoStatus.COMPLETED;
      update(ref(db, `videos/${id}`), updates);
    }
  };
  const toggleInvoiced = (id: string) => {
    const v = videos.find(v => v.id === id);
    if (v) update(ref(db, `videos/${id}`), { isInvoiced: !v.isInvoiced });
  };
  const toggleProductStatus = (id: string) => {
    const v = videos.find(v => v.id === id);
    if (v) update(ref(db, `videos/${id}`), { productStatus: v.productStatus === ProductStatus.ARRIVED ? ProductStatus.NOT_ARRIVED : ProductStatus.ARRIVED });
  };
  const handleStatusChange = (id: string, newStatus: VideoStatus) => {
    const updates: any = { status: newStatus };
    if (newStatus === VideoStatus.COMPLETED) updates.isCompleted = true;
    else updates.isCompleted = false;
    update(ref(db, `videos/${id}`), updates);
  };

  const handleEdit = (video: VideoProject) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleAddGalleryItem = (base64: string) => {
    push(ref(db, 'thisFridayGallery'), { imageUrl: base64, createdAt: Date.now(), isCompleted: false });
  };
  const handleDeleteGalleryItem = (id: string) => {
    if(confirm('Bu görseli silmek istediğinize emin misiniz?')) {
      remove(ref(db, `thisFridayGallery/${id}`));
    }
  };
  const toggleGalleryItemComplete = (id: string) => {
     const item = galleryItems.find(i => i.id === id);
     if(item) {
        update(ref(db, `thisFridayGallery/${id}`), { isCompleted: !item.isCompleted });
     }
  }

  const handleAddLifestyleItem = (base64: string) => {
    push(ref(db, 'lifestyleGallery'), { imageUrl: base64, createdAt: Date.now(), isCompleted: false });
  };
  const handleDeleteLifestyleItem = (id: string) => {
    if(confirm('Bu ilham görselini silmek istediğinize emin misiniz?')) {
      remove(ref(db, `lifestyleGallery/${id}`));
    }
  };

  const handleAddDocument = (name: string, category: string, fileUrl: string, fileType: 'pdf' | 'image') => {
    push(ref(db, 'documents'), { name, category, fileUrl, fileType, createdAt: Date.now() });
  };
  const handleDeleteDocument = (id: string) => {
    if(confirm('Bu evrakı silmek istediğinize emin misiniz?')) {
      remove(ref(db, `documents/${id}`));
    }
  };

  const toggleTypeFilter = (type: VideoType) => {
    if (activeTypeFilter === type) {
      setActiveTypeFilter(null);
    } else {
      setActiveTypeFilter(type);
    }
  };

  const handleAddToDo = (text: string) => push(ref(db, 'todos'), { text, isCompleted: false, createdAt: Date.now() });
  const handleToggleToDo = (id: string) => {
    const item = toDoItems.find(t => t.id === id);
    if (item) update(ref(db, `todos/${id}`), { isCompleted: !item.isCompleted });
  };
  const handleDeleteToDo = (id: string) => remove(ref(db, `todos/${id}`));

  const handleAddEquipment = (name: string, category: string) => push(ref(db, 'equipments'), { name, category });
  const handleDeleteEquipment = (id: string) => remove(ref(db, `equipments/${id}`));

  const handleAddSubscription = (name: string, price: number, currency: 'TL'|'USD'|'EUR', cycle: 'Aylık'|'Yıllık') => {
    push(ref(db, 'subscriptions'), { name, price, currency, cycle });
  };
  const handleDeleteSubscription = (id: string) => remove(ref(db, `subscriptions/${id}`));

  const handleYearChange = (inc: number) => setFilter(p => ({ ...p, year: p.year + inc }));
  const handleMonthChange = (inc: number) => {
    let newMonth = filter.month + inc;
    let newYear = filter.year;
    if(newMonth > 11) { newMonth = 0; newYear++; }
    if(newMonth < 0) { newMonth = 11; newYear--; }
    setFilter({ month: newMonth, year: newYear });
  };
  const handleCompleteMonth = () => {
     if(filter.month === -1) {
        alert('Tüm yıl görünümündeyken ay tamamlanamaz.');
        return;
     }
     if(confirm(`${MONTHS_TR[filter.month]} ayını tamamlayıp bir sonraki aya geçmek istiyor musunuz?`)) {
        let nextMonth = filter.month + 1;
        let nextYear = filter.year;
        if(nextMonth > 11) {
           nextMonth = 0;
           nextYear += 1;
        }
        set(ref(db, 'settings/activePeriod'), { month: nextMonth, year: nextYear });
        setFilter({ month: nextMonth, year: nextYear });
     }
  }

  const toggleWeek = (weekLabel: string) => {
     setExpandedWeeks(prev => ({
        ...prev,
        [weekLabel]: !prev[weekLabel]
     }));
  };

  const handleOpenWeekInvoice = (e: React.MouseEvent, label: string, items: VideoProject[]) => {
      e.stopPropagation();
      setSelectedWeekLabel(label);
      setSelectedWeekItems(items);
      setIsWeekInvoiceOpen(true);
  }

  const handleOpenWeekLogistics = (e: React.MouseEvent, label: string, items: VideoProject[]) => {
    e.stopPropagation();
    setSelectedWeekLabel(label);
    setSelectedWeekItems(items);
    setIsWeekLogisticsOpen(true);
  }

  const filteredVideos = useMemo(() => {
    return videos
      .filter(v => {
        const d = new Date(v.date);
        const yearMatch = d.getFullYear() === filter.year;
        const monthMatch = filter.month === -1 ? true : d.getMonth() === filter.month;
        const searchMatch = searchQuery ? v.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        const typeMatch = activeTypeFilter ? v.type === activeTypeFilter : true;
        
        let arrivedMatch = true;
        if (productFilterState === 'ARRIVED') arrivedMatch = v.productStatus === ProductStatus.ARRIVED;
        if (productFilterState === 'NOT_ARRIVED') arrivedMatch = v.productStatus === ProductStatus.NOT_ARRIVED;

        return yearMatch && monthMatch && searchMatch && typeMatch && arrivedMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [videos, filter, searchQuery, activeTypeFilter, productFilterState]);

  const groupedVideos = useMemo(() => {
    const groups: { weekLabel: string, items: VideoProject[], summary: string }[] = [];
    let currentWeekLabel = '';
    let currentGroup: VideoProject[] = [];

    filteredVideos.forEach(video => {
      const date = new Date(video.date);
      const day = date.getDay() || 7; 
      if (day !== 1) date.setHours(-24 * (day - 1));
      const start = date;
      const end = new Date(date);
      end.setDate(date.getDate() + 6);
      const label = `${start.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} HAFTASI`.toUpperCase();
      
      if (label !== currentWeekLabel) {
        if (currentGroup.length > 0) {
           const counts = currentGroup.reduce((acc, item) => {
              if (item.status === VideoStatus.CANCELLED || item.status === VideoStatus.REPEAT) return acc;
              acc[item.type] = (acc[item.type] || 0) + item.quantity;
              return acc;
           }, {} as Record<string, number>);
           const summaryStr = Object.entries(counts).map(([t, c]) => `${c} ${t}`).join(', ');
           groups.push({ weekLabel: currentWeekLabel, items: currentGroup, summary: summaryStr });
        }
        currentWeekLabel = label;
        currentGroup = [video];
      } else currentGroup.push(video);
    });
    if (currentGroup.length > 0) {
        const counts = currentGroup.reduce((acc, item) => {
           if (item.status === VideoStatus.CANCELLED || item.status === VideoStatus.REPEAT) return acc;
           acc[item.type] = (acc[item.type] || 0) + item.quantity;
           return acc;
        }, {} as Record<string, number>);
        const summaryStr = Object.entries(counts).map(([t, c]) => `${c} ${t}`).join(', ');
        groups.push({ weekLabel: currentWeekLabel, items: currentGroup, summary: summaryStr });
    }
    return groups;
  }, [filteredVideos]);

  useEffect(() => {
     const newWeeks: Record<string, boolean> = {};
     groupedVideos.forEach(g => {
        if (expandedWeeks[g.weekLabel] === undefined) {
           newWeeks[g.weekLabel] = true;
        }
     });
     if (Object.keys(newWeeks).length > 0) {
        setExpandedWeeks(prev => ({ ...prev, ...newWeeks }));
     }
  }, [groupedVideos]);

  // Updated Invoice Amount to Exclude CANCELLED and REPEAT
  const totalInvoiceAmount = useMemo(() => filteredVideos.reduce((sum, v) => (v.isInvoiced && v.status !== VideoStatus.CANCELLED && v.status !== VideoStatus.REPEAT) ? sum + (PROJECT_PRICES[v.type] * v.quantity) : sum, 0), [filteredVideos]);

  const monthlySubscriptionCost = useMemo(() => {
     return subscriptionItems.reduce((acc, item) => {
        let price = item.price;
        if(item.currency === 'USD') price = item.price * 34;
        if(item.currency === 'EUR') price = item.price * 36;
        if(item.cycle === 'Yıllık') price = price / 12;
        return acc + price;
     }, 0);
  }, [subscriptionItems]);

  const stats = useMemo(() => {
    // Exclude cancelled/repeat from active stats
    const activeVideos = filteredVideos.filter(v => v.status !== VideoStatus.CANCELLED && v.status !== VideoStatus.REPEAT);
    
    return {
      activeTotal: activeVideos.length,
      arrived: activeVideos.filter(v => v.productStatus === ProductStatus.ARRIVED).length,
      notArrived: activeVideos.filter(v => v.productStatus === ProductStatus.NOT_ARRIVED).length,
      
      videoCount: activeVideos.filter(v => v.type === VideoType.VIDEO).length,
      animCount: activeVideos.filter(v => v.type === VideoType.ANIMATION).length,
      redCount: activeVideos.filter(v => v.type === VideoType.RED_ACTUAL).length,
      lowerCount: activeVideos.filter(v => v.type === VideoType.LOWER_THIRD).length,
    };
  }, [filteredVideos]);

  // Update pending calculations to exclude Cancelled/Repeat
  const pendingInvoiceCount = useMemo(() => filteredVideos.filter(v => !v.isInvoiced && v.status === VideoStatus.COMPLETED).length, [filteredVideos]);
  const missingProductCount = useMemo(() => filteredVideos.filter(v => v.productStatus === ProductStatus.NOT_ARRIVED && !v.isCompleted && v.status !== VideoStatus.CANCELLED && v.status !== VideoStatus.REPEAT).length, [filteredVideos]);
  const netProfit = totalInvoiceAmount - monthlySubscriptionCost;

  // -- LOADING SCREEN --
  if (authLoading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#050505] transition-colors">
           <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#D81B2D] rounded-2xl flex items-center justify-center animate-pulse shadow-2xl">
                 <StudioLogo className="w-12 h-12 brightness-0 invert" />
              </div>
              <div className="mt-8 flex gap-2">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
           </div>
        </div>
     );
  }

  // -- AUTH GUARD --
  if (!isAuthenticated) {
     return <LoginPage onLoginSuccess={handleLocalLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050505] pb-32 font-body text-[#1A1A1A] dark:text-gray-100 print:bg-white print:pb-0 transition-colors duration-300 animate-fade-in">
      
      {/* -- REFRESHED MINIMAL HEADER -- */}
      <div className="sticky top-0 z-40 glass dark:border-b dark:border-gray-800 shadow-sm transition-all duration-300 print:hidden backdrop-blur-xl bg-white/70 dark:bg-[#050505]/70">
          <header className="border-b border-gray-100/50 dark:border-gray-800/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 md:h-20">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    <div className="h-8 md:h-10 hover:opacity-80 transition-opacity cursor-pointer">
                        <StudioLogo className="h-full" />
                    </div>
                </div>

                {/* Minimal Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    
                    {/* Navigation Cluster */}
                    <div className="flex items-center p-1.5 bg-gray-100/50 dark:bg-[#1E1E1E]/50 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        <button onClick={() => setIsDocumentsOpen(true)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C2C2C] rounded-full transition-all" title="Evraklar">
                            <FileTextIcon />
                        </button>
                        <button onClick={() => setIsGalleryOpen(true)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C2C2C] rounded-full transition-all" title="Bu Cuma">
                            <GalleryIcon />
                        </button>
                        <button onClick={() => setIsLifestyleOpen(true)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C2C2C] rounded-full transition-all" title="Lifestyle İlham">
                            <GridIcon />
                        </button>
                        <button onClick={() => setIsToDoOpen(true)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C2C2C] rounded-full transition-all" title="Notlar">
                            <ListIcon />
                        </button>
                        <button onClick={() => setIsEquipmentOpen(true)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C2C2C] rounded-full transition-all" title="Ekipmanlar">
                            <CameraIcon />
                        </button>
                        <button onClick={() => setIsSubscriptionOpen(true)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C2C2C] rounded-full transition-all" title="Abonelikler">
                            <CreditCardIcon />
                        </button>
                    </div>

                    {/* System Cluster */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsDashboardOpen(!isDashboardOpen)} className={`p-2.5 rounded-full transition-all ${isDashboardOpen ? 'bg-gray-200 dark:bg-[#333] text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]'}`} title="İstatistikler">
                            <ChartIcon />
                        </button>
                        <button onClick={toggleDarkMode} className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-all" title="Tema Değiştir">
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <button onClick={handleLogout} className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all" title="Çıkış Yap">
                            <LogOutIcon />
                        </button>
                    </div>

                    {/* Primary CTA */}
                    <button onClick={() => { setEditingVideo(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#D81B2D] hover:bg-[#b91625] text-white rounded-full font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 active:scale-95 transition-all text-sm">
                        <PlusIcon /> <span>Yeni Proje</span>
                    </button>
                    
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                    <div className="h-6"><BimLogo className="h-full opacity-80" /></div>
                </div>

                {/* Mobile Header Elements */}
                <div className="flex md:hidden w-full items-center gap-2 ml-4">
                   <div className="flex-1 relative">
                     <input 
                       type="text" 
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       placeholder="Ara..."
                       className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-[#1E1E1E] border-none rounded-full text-sm focus:ring-2 focus:ring-[#D81B2D] outline-none dark:text-white"
                     />
                     <div className="absolute left-3 top-2.5 text-gray-400"><SearchIcon /></div>
                   </div>
                   <button onClick={() => setIsDashboardOpen(!isDashboardOpen)} className={`p-2 rounded-full ${isDashboardOpen ? 'bg-gray-200 dark:bg-[#333]' : ''} text-gray-600 dark:text-gray-300`}>
                      <ChartIcon />
                   </button>
                   <button onClick={handleLogout} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500">
                      <LogOutIcon />
                   </button>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            
            {/* -- DASHBOARD SECTION (Collapsible) -- */}
            <DashboardCharts isOpen={isDashboardOpen} videos={filteredVideos} />

            {/* -- Filters Bar -- */}
            <div className="bg-white/60 dark:bg-[#1E1E1E]/60 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-3 flex flex-col sm:flex-row justify-between items-center no-print transition-all gap-3">
              {/* Quick Search MOVED TO LEFT */}
              <div className="flex items-center gap-2 w-full sm:w-auto px-2">
                 <div className="relative w-full sm:w-auto flex-1 hidden md:block">
                     <input 
                       type="text" 
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       placeholder="Proje adı ile filtrele..."
                       className="pl-9 pr-3 py-2 bg-transparent border-none text-sm focus:ring-0 outline-none w-full sm:w-64 transition-all dark:text-white placeholder-gray-500"
                     />
                     <div className="absolute left-0 top-2 text-gray-400"><SearchIcon /></div>
                 </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
                
                {/* Product Status Filter Segmented Control */}
                <div className="flex bg-gray-100/80 dark:bg-[#2C2C2C] p-1 rounded-xl">
                   <button 
                     onClick={() => setProductFilterState('ALL')}
                     className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${productFilterState === 'ALL' ? 'bg-white dark:bg-[#3A3A3A] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                   >
                     Tümü
                   </button>
                   <button 
                     onClick={() => setProductFilterState('ARRIVED')}
                     className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${productFilterState === 'ARRIVED' ? 'bg-white dark:bg-[#3A3A3A] text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                   >
                     <BoxIcon /> Geldi
                   </button>
                   <button 
                     onClick={() => setProductFilterState('NOT_ARRIVED')}
                     className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${productFilterState === 'NOT_ARRIVED' ? 'bg-white dark:bg-[#3A3A3A] text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                   >
                     <AlertIcon /> Gelmedi
                   </button>
                </div>

                {/* MONTH NAVIGATION */}
                <div className="flex items-center bg-gray-100/80 dark:bg-[#2C2C2C] rounded-xl p-1">
                  <button onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-white dark:hover:bg-[#3A3A3A] hover:shadow-sm rounded-lg text-gray-500 dark:text-gray-400 transition-all" title="Önceki Ay">
                    <ChevronLeftIcon />
                  </button>
                  
                  <div className="flex items-center px-4 min-w-[120px] justify-center">
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                        {filter.month === -1 ? `${filter.year} TÜM YIL` : `${MONTHS_TR[filter.month]} ${filter.year}`}
                    </span>
                  </div>

                  <button onClick={() => handleMonthChange(1)} className="p-2 hover:bg-white dark:hover:bg-[#3A3A3A] hover:shadow-sm rounded-lg text-gray-500 dark:text-gray-400 transition-all" title="Sonraki Ay">
                    <ChevronRightIcon />
                  </button>
                </div>

                {/* COMPLETE MONTH */}
                <button 
                   onClick={handleCompleteMonth}
                   className="hidden sm:flex items-center gap-2 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                   title="Bu ayı tamamlayıp bir sonraki aya geçer"
                >
                   <CheckIcon /> <span>Ayı Tamamla</span>
                </button>
              </div>
            </div>

            {/* -- Stats Grid (Updated) -- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
              {/* Main Red Card - UPDATED WITH REVENUE */}
              <div className="bg-gradient-to-br from-[#D81B2D] to-[#b91625] p-4 rounded-xl shadow-lg text-white col-span-2 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-default flex flex-col justify-between relative overflow-hidden min-h-[120px] group">
                 <div className="absolute -right-2 -top-2 opacity-20 transform rotate-12 scale-125 pointer-events-none text-white transition-transform group-hover:scale-150 duration-500">
                     <DatabaseIcon />
                 </div>
                 <div className="relative z-10 flex justify-between items-start">
                   <div>
                      <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Aktif Proje</p>
                      <p className="text-4xl font-brand font-extrabold drop-shadow-md">{stats.activeTotal}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Toplam Ciro</p>
                      <p className="text-xl font-mono font-bold opacity-90 drop-shadow-sm">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalInvoiceAmount)}</p>
                   </div>
                 </div>
                 <div className="flex justify-between items-end text-xs font-medium text-white/90 border-t border-white/20 pt-2 mt-auto relative z-10">
                    <div className="flex gap-3">
                       <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span> {stats.arrived} Geldi</span>
                       <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-900 shadow-[0_0_5px_rgba(127,29,29,0.8)]"></span> {stats.notArrived} Gelmedi</span>
                    </div>
                 </div>
              </div>

              {[
                { type: VideoType.VIDEO, label: 'Video', val: stats.videoCount, color: 'blue', icon: <FilmIcon /> },
                { type: VideoType.ANIMATION, label: 'Animasyon', val: stats.animCount, color: 'purple', icon: <MagicIcon /> },
                { type: VideoType.RED_ACTUAL, label: 'Kırmızı Aktüel', val: stats.redCount, color: 'red', icon: <ApertureIcon /> },
                { type: VideoType.LOWER_THIRD, label: 'Altbant', val: stats.lowerCount, color: 'orange', icon: <LayoutIcon /> }
              ].map((s) => (
                <div 
                  key={s.label} 
                  onClick={() => toggleTypeFilter(s.type)}
                  className={`relative p-4 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer col-span-1 overflow-hidden group
                    ${activeTypeFilter === s.type 
                      ? `ring-2 ring-${s.color}-500 bg-${s.color}-50 dark:bg-${s.color}-900/20 border-${s.color}-200 dark:border-${s.color}-800 scale-[1.02] shadow-md` 
                      : `bg-white dark:bg-[#1E1E1E] border-gray-100 dark:border-gray-800 hover:-translate-y-1 hover:shadow-md`
                    }
                  `}
                >
                   {/* Gradient overlay for hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-transparent to-${s.color}-50 dark:to-${s.color}-900/10 pointer-events-none`} />

                  <div className={`absolute -right-3 -top-3 opacity-10 group-hover:opacity-20 transform rotate-12 scale-125 transition-transform duration-500 group-hover:scale-150 pointer-events-none text-${s.color}-500 dark:text-${s.color}-400`}>
                      {s.icon}
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <p className={`text-[10px] font-bold uppercase transition-colors ${activeTypeFilter === s.type ? `text-${s.color}-700 dark:text-${s.color}-300` : `text-${s.color}-500 dark:text-${s.color}-400`}`}>{s.label}</p>
                      <p className={`text-3xl font-brand font-extrabold mt-1 transition-colors ${activeTypeFilter === s.type ? `text-${s.color}-800 dark:text-${s.color}-200` : `text-${s.color}-600 dark:text-${s.color}-300`}`}>{s.val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* -- Table -- */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-gray-50/80 dark:bg-[#252525]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm relative z-10">
                <tr className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400 font-bold">
                  <th className="px-4 py-3 text-center w-12">Tamam</th>
                  <th className="px-4 py-3 text-center w-24">Tarih</th>
                  <th className="px-4 py-3 text-center w-28">Ürün Teslim</th>
                  <th className="px-4 py-3 text-left">Video Adı / Konusu</th>
                  <th className="px-4 py-3 text-center">Tür</th>
                  <th className="px-4 py-3 text-center w-32">Durum</th>
                  <th className="px-4 py-3 text-center w-16">Fatura</th>
                  <th className="px-4 py-3 text-center w-20 no-print">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {groupedVideos.map((group, idx) => (
                  <React.Fragment key={group.weekLabel}>
                    {/* Collapsible Header Row */}
                    <tr 
                       onClick={() => toggleWeek(group.weekLabel)}
                       className="cursor-pointer bg-gray-50 dark:bg-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors border-t-4 border-white dark:border-[#121212] shadow-sm group/header"
                    >
                       <td colSpan={8} className="px-0 py-0">
                          <div className="flex justify-between items-center pl-4 py-2 border-l-4 border-[#D81B2D] transition-all group-hover/header:border-l-8">
                             <div className="flex items-center gap-3">
                                <div className="p-1 bg-white dark:bg-[#1E1E1E] rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 group-hover/header:text-[#D81B2D] transition-colors">
                                   {expandedWeeks[group.weekLabel] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                </div>
                                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide">{group.weekLabel}</span>
                             </div>
                             
                             <div className="flex items-center gap-3 pr-4">
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-white/50 dark:bg-black/20 px-2 py-1 rounded hidden sm:inline-block border border-transparent group-hover/header:border-gray-200 dark:group-hover/header:border-gray-700 transition-all">
                                    {group.summary}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                                    <button onClick={(e) => handleOpenWeekInvoice(e, group.weekLabel, group.items)} className="p-2 bg-white dark:bg-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors shadow-sm" title="Fatura Listesi (PDF)">
                                        <PrintIcon />
                                    </button>
                                    <button onClick={(e) => handleOpenWeekLogistics(e, group.weekLabel, group.items)} className="p-2 bg-white dark:bg-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors shadow-sm" title="Gelmeyenler Listesi (Resim)">
                                        <ImageIcon />
                                    </button>
                                </div>
                             </div>
                          </div>
                       </td>
                    </tr>
                    
                    {/* Video Rows */}
                    {expandedWeeks[group.weekLabel] && group.items.map((video, vIdx) => {
                        const currentDate = new Date(video.date);
                        const currentDayStr = currentDate.toLocaleDateString('tr-TR', { weekday: 'long' });
                        const prevVideo = vIdx > 0 ? group.items[vIdx - 1] : null;
                        const prevDayStr = prevVideo ? new Date(prevVideo.date).toLocaleDateString('tr-TR', { weekday: 'long' }) : '';
                        const showSeparator = vIdx === 0 || currentDayStr !== prevDayStr;
                        
                        const isCancelled = video.status === VideoStatus.CANCELLED;
                        const isRepeat = video.status === VideoStatus.REPEAT;
                        const isDimmed = isCancelled || isRepeat;

                        return (
                          <React.Fragment key={video.id}>
                              {showSeparator && (
                                  <tr className="bg-gradient-to-r from-transparent via-gray-50 to-transparent dark:via-[#222]">
                                      <td colSpan={8} className="px-4 py-2">
                                          <div className="flex items-center justify-center">
                                              <div className="flex items-center gap-2 px-4 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm">
                                                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
                                                 <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-300 tracking-widest">{currentDayStr}</span>
                                              </div>
                                          </div>
                                      </td>
                                  </tr>
                              )}
                              <tr className={`transition-all duration-300 group hover:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:z-10 relative border-b border-transparent
                                ${isCancelled ? 'opacity-60 grayscale bg-gray-50/50 dark:bg-gray-900/50' : ''}
                                ${isRepeat ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}
                                ${video.isCompleted && !isDimmed ? 'bg-gray-50/50 dark:bg-[#1a1a1a] opacity-75' : (!isDimmed ? 'bg-white dark:bg-[#1E1E1E]' : '')} 
                                ${video.productStatus === ProductStatus.NOT_ARRIVED && !video.isCompleted && !isDimmed ? 'bg-red-50/30 dark:bg-red-900/5' : ''}
                                ${video.isInvoiced && !isDimmed ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-emerald-500' : 'hover:bg-gray-50 dark:hover:bg-[#252525] border-l-4 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}
                              `}>
                                <td className="px-4 py-2.5 text-center">
                                <button onClick={() => toggleComplete(video.id)} disabled={isDimmed} className={`w-6 h-6 rounded-md border transition-all flex items-center justify-center transform active:scale-90 shadow-sm ${isDimmed ? 'opacity-30 cursor-not-allowed border-gray-200' : (video.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-green-500 text-transparent hover:text-green-500')}`}>
                                    <CheckIcon />
                                </button>
                                </td>
                                <td className={`px-4 py-2.5 font-semibold text-center ${isCancelled ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                {new Date(video.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                <button onClick={() => toggleProductStatus(video.id)} disabled={isDimmed} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-all w-24 justify-center shadow-sm ${isDimmed ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : (video.productStatus === ProductStatus.ARRIVED ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 hover:scale-105' : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50 hover:scale-105')}`}>
                                    <BoxIcon /> <span>{video.productStatus === ProductStatus.ARRIVED ? 'Geldi' : 'Gelmedi'}</span>
                                </button>
                                </td>
                                <td className={`px-4 py-2.5 font-medium text-left ${isCancelled ? 'line-through decoration-2 decoration-gray-400 text-gray-400' : (video.isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100')}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="truncate">{video.title}</span>
                                        {video.notes && (
                                            <div className="group/note relative">
                                                <div className="text-yellow-500 dark:text-yellow-600 hover:scale-110 transition-transform cursor-help">
                                                    <StickyNoteIcon />
                                                </div>
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/note:block w-64 p-3 bg-yellow-50 dark:bg-yellow-900/90 text-yellow-900 dark:text-yellow-100 text-xs rounded-lg shadow-xl border border-yellow-200 dark:border-yellow-800 z-50 whitespace-normal backdrop-blur-sm animate-in zoom-in-95 duration-200">
                                                    {video.notes}
                                                    <div className="absolute bottom-[-6px] left-3 w-3 h-3 bg-yellow-50 dark:bg-yellow-900/90 border-r border-b border-yellow-200 dark:border-yellow-800 transform rotate-45"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-[#2C2C2C] border border-gray-200 dark:border-gray-700 rounded text-xs shadow-sm w-28 justify-center ${isDimmed ? 'opacity-50 grayscale' : ''}`}>
                                    <span className={`font-bold uppercase text-[10px] ${
                                    video.type === VideoType.VIDEO ? 'text-blue-600 dark:text-blue-400' : 
                                    video.type === VideoType.ANIMATION ? 'text-purple-600 dark:text-purple-400' : 
                                    video.type === VideoType.LIFESTYLE ? 'text-teal-600 dark:text-teal-400' : 
                                    video.type === VideoType.RED_ACTUAL ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                                    }`}>{video.type}</span>
                                </div>
                                </td>
                                <td className="px-4 py-2.5 text-center relative">
                                    <div className="relative inline-block w-full group/status hover:scale-105 transition-transform">
                                        <div className="flex items-center justify-center gap-1 cursor-pointer"><StatusBadge status={video.status} /><ChevronDownIcon /></div>
                                        <select value={video.status} onChange={(e) => handleStatusChange(video.id, e.target.value as VideoStatus)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">{Object.values(VideoStatus).map(s => <option key={s} value={s}>{s}</option>)}</select>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                <button onClick={() => toggleInvoiced(video.id)} disabled={isDimmed} className={`p-1.5 rounded-lg transition-all transform ${isDimmed ? 'opacity-20 cursor-not-allowed' : 'active:scale-90'} ${video.isInvoiced ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200 dark:ring-emerald-900' : 'text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'}`}>
                                    {video.isInvoiced ? <CheckCircleIcon /> : <BillIcon />}
                                </button>
                                </td>
                                <td className="px-4 py-2.5 text-center no-print">
                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(video)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"><EditIcon /></button>
                                    <button onClick={() => handleDelete(video.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><TrashIcon /></button>
                                </div>
                                </td>
                            </tr>
                          </React.Fragment>
                        );
                    })}
                  </React.Fragment>
                ))}
                {filteredVideos.length === 0 && <tr><td colSpan={8} className="p-12 text-center text-gray-400 dark:text-gray-600 bg-gray-50/20 dark:bg-[#121212] italic">Bu dönem için kayıtlı proje bulunamadı.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* -- Mobile Bottom Navigation -- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe z-50 h-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-full px-2 pb-2">
           <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${activeTab === 'home' ? 'text-[#D81B2D]' : 'text-gray-400 dark:text-gray-500'}`}>
              <HomeIcon />
              <span className="text-[10px] font-bold">Ana Sayfa</span>
           </button>
           <button onClick={() => { setActiveTab('todo'); setIsToDoOpen(true); }} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${activeTab === 'todo' ? 'text-[#D81B2D]' : 'text-gray-400 dark:text-gray-500'}`}>
              <ListIcon />
              <span className="text-[10px] font-bold">Yapılacaklar</span>
           </button>
           <div className="w-14"></div> {/* Spacer for FAB */}
           <button onClick={() => { setActiveTab('equipment'); setIsEquipmentOpen(true); }} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${activeTab === 'equipment' ? 'text-[#D81B2D]' : 'text-gray-400 dark:text-gray-500'}`}>
              <CameraIcon />
              <span className="text-[10px] font-bold">Ekipman</span>
           </button>
           <button onClick={() => { setActiveTab('subscription'); setIsSubscriptionOpen(true); }} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${activeTab === 'subscription' ? 'text-[#D81B2D]' : 'text-gray-400 dark:text-gray-500'}`}>
              <CreditCardIcon />
              <span className="text-[10px] font-bold">Abonelik</span>
           </button>
        </div>
      </div>
      
      {/* -- Mobile FAB (New Project) -- */}
      <button 
        onClick={() => { setEditingVideo(null); setIsModalOpen(true); }} 
        className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[#D81B2D] text-white rounded-full shadow-[0_8px_25px_rgba(216,27,45,0.4)] flex items-center justify-center z-[60] hover:bg-[#b91625] active:scale-90 transition-all border-4 border-[#F8F9FA] dark:border-[#050505]"
      >
        <PlusIcon />
      </button>

      {/* -- REFRESHED FLOATING FOOTER -- */}
      <div className="hidden md:flex fixed bottom-6 left-0 right-0 justify-center z-50 print:hidden pointer-events-none">
         <div className="bg-[#1A1A1A]/90 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-black/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] h-16 flex items-center px-6 gap-6 pointer-events-auto transform hover:scale-[1.01] transition-transform duration-300">
            
             {/* Section 1: Context */}
             <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-0.5">AKTİF DÖNEM</span>
                    <span className="text-sm font-bold text-white dark:text-black leading-none hover:text-[#D81B2D] dark:hover:text-[#D81B2D] cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                        {filter.month === -1 ? `${filter.year}` : `${MONTHS_TR[filter.month]} ${filter.year}`}
                    </span>
                </div>
             </div>

             <div className="w-px h-8 bg-white/10 dark:bg-black/10"></div>

             {/* Section 2: Alerts */}
             <div className="flex items-center gap-2">
                {missingProductCount > 0 ? (
                   <button onClick={() => setProductFilterState('NOT_ARRIVED')} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                      <AlertIcon /> <span className="text-xs font-bold">{missingProductCount} Ürün Eksik</span>
                   </button>
                ) : (
                   <div className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 opacity-60">
                      <CheckIcon /> <span className="text-xs font-bold">Ürünler Tamam</span>
                   </div>
                )}
                
                {pendingInvoiceCount > 0 && (
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg">
                      <span className="text-xs font-bold">{pendingInvoiceCount} Faturasız</span>
                   </div>
                )}
             </div>

             <div className="w-px h-8 bg-white/10 dark:bg-black/10"></div>

             {/* Section 3: Money */}
             <div className="flex items-center gap-6">
                <div className="flex flex-col items-end opacity-70">
                   <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-0.5">TAHMİNİ GİDER</span>
                   <span className="text-xs font-mono text-gray-300 dark:text-gray-600">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(monthlySubscriptionCost)}</span>
                </div>
                
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-0.5">NET KÂR</span>
                   <span className={`text-xl font-mono font-black leading-none ${netProfit > 0 ? 'text-emerald-400 dark:text-emerald-600' : 'text-red-500'}`}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(netProfit)}
                   </span>
                </div>
             </div>

             <div className="w-px h-8 bg-white/10 dark:bg-black/10"></div>

             <button onClick={() => window.print()} className="p-2.5 text-gray-400 hover:text-white dark:hover:text-black bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg transition-all" title="Rapor Yazdır">
                <PrintIcon />
             </button>
         </div>
      </div>
       
       <div className="hidden print:block mt-8 pt-8 border-t border-gray-300 text-right pr-4">
          <p className="text-sm font-bold">Toplam Ciro: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalInvoiceAmount)}</p>
       </div>

      {/* ... modals ... */}
      <AddVideoModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingVideo(null); }} onSave={handleAddVideo} initialData={editingVideo} />
      <ToDoModal isOpen={isToDoOpen} onClose={() => setIsToDoOpen(false)} items={toDoItems} onAdd={handleAddToDo} onToggle={handleToggleToDo} onDelete={handleDeleteToDo} />
      <EquipmentModal isOpen={isEquipmentOpen} onClose={() => setIsEquipmentOpen(false)} items={equipmentItems} onAdd={handleAddEquipment} onDelete={handleDeleteEquipment} />
      <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} items={subscriptionItems} onAdd={handleAddSubscription} onDelete={handleDeleteSubscription} />
      <ThisFridayModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} items={galleryItems} onAdd={handleAddGalleryItem} onDelete={handleDeleteGalleryItem} onToggle={toggleGalleryItemComplete} />
      <LifestyleGallery isOpen={isLifestyleOpen} onClose={() => setIsLifestyleOpen(false)} items={lifestyleItems} onAdd={handleAddLifestyleItem} onDelete={handleDeleteLifestyleItem} />
      <DocumentsModal isOpen={isDocumentsOpen} onClose={() => setIsDocumentsOpen(false)} items={documentItems} onAdd={handleAddDocument} onDelete={handleDeleteDocument} />
      <WeekInvoiceModal isOpen={isWeekInvoiceOpen} onClose={() => setIsWeekInvoiceOpen(false)} weekLabel={selectedWeekLabel} items={selectedWeekItems} />
      <WeekLogisticsModal isOpen={isWeekLogisticsOpen} onClose={() => setIsWeekLogisticsOpen(false)} weekLabel={selectedWeekLabel} items={selectedWeekItems} />
    </div>
  );
};

export default App;