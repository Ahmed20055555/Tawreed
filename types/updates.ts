export type UpdateType = 'new_product' | 'offer' | 'price_change' | 'announcement';

export type UpdateStatus = 'published' | 'scheduled';

export type AudienceType = 'all' | 'custom';

export interface UpdateAudience {
  type: AudienceType;
  targetCount: number;
  areas?: string[];
  types?: string[];
}

export interface SupplierUpdate {
  id: string;
  type: UpdateType;
  title: string;
  description: string;
  imageUrl?: string;
  // Type-specific fields
  productName?: string;
  price?: number;
  unit?: string;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
  oldPrice?: number;
  newPrice?: number;
  // Publishing config
  audience: UpdateAudience;
  scheduleType: 'now' | 'scheduled';
  scheduledFor?: string;
  status: UpdateStatus;
  publishedAt: string;
  // Stats
  reachCount: number;   // وصل لـ X
  viewsCount: number;   // شاهده Y
}

export interface UpdateFormData {
  type: UpdateType;
  title: string;
  description: string;
  imageUrl?: string;
  productName?: string;
  price?: number;
  unit?: string;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
  oldPrice?: number;
  newPrice?: number;
  audienceType: AudienceType;
  selectedAreas?: string[];
  selectedTypes?: string[];
  scheduleType: 'now' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
}
