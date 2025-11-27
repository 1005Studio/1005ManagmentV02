

export enum VideoStatus {
  PLANNED = 'Planlama',
  SHOOTING = 'Çekim',
  EDITING = 'Kurgu',
  REVIEW = 'Revize',
  COMPLETED = 'Tamamlandı',
  CANCELLED = 'Gelmedi',
  REPEAT = 'Tekrar'
}

export enum VideoType {
  VIDEO = 'Video',
  ANIMATION = 'Animasyon',
  RED_ACTUAL = 'Kırmızı Aktüel',
  LOWER_THIRD = 'Altbant',
  LIFESTYLE = 'Lifestyle'
}

export enum ProductStatus {
  NOT_ARRIVED = 'Gelmedi',
  ARRIVED = 'Geldi'
}

export const PROJECT_PRICES: Record<VideoType, number> = {
  [VideoType.VIDEO]: 30000,
  [VideoType.ANIMATION]: 20000,
  [VideoType.LOWER_THIRD]: 20000,
  [VideoType.RED_ACTUAL]: 35000,
  [VideoType.LIFESTYLE]: 30000,
};

export interface VideoProject {
  id: string;
  date: string;
  title: string;
  quantity: number;
  type: VideoType;
  status: VideoStatus;
  productStatus: ProductStatus;
  isCompleted: boolean;
  isInvoiced: boolean;
  isPinned?: boolean;
  notes?: string;
}

export interface ToDoItem {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category?: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  price: number;
  currency: 'TL' | 'USD' | 'EUR';
  cycle: 'Aylık' | 'Yıllık';
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  isCompleted?: boolean;
  createdAt: number;
}

export interface LifestyleItem {
  id: string;
  imageUrl: string;
  createdAt: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: string; // 'Resmi', 'Banka', 'Sözleşme', 'Diğer'
  fileUrl: string;
  fileType: 'pdf' | 'image';
  createdAt: number;
}

export interface FilterState {
  month: number;
  year: number;
}

export const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];