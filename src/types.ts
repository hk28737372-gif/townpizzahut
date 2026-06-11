export interface Note {
  id: string;
  title: string;
  content: string;
  category: string; // e.g. 'Startup Ideas', 'Work', etc.
  updatedAt: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  collectionId?: string; // Links Note to a specific Smart Collection
  tags?: string[];
}

export interface Reminder {
  id: string;
  text: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  collectionId?: string;
  tags?: string[];
}

export interface CaptureItem {
  id: string;
  title: string;
  description: string;
  type: 'note' | 'idea' | 'snippet' | 'url' | 'bookmark' | 'link';
  content?: string; // Content or URL
  category: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  collectionId?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  iconName?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'note_created' | 'note_updated' | 'reminder_completed' | 'reminder_created' | 'capture_created';
  title: string;
  details?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  dateAdded: string;
  size: string;
  parsedInsights: string;
  isVerified: boolean;
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'action' | 'stat' | 'tip';
  title: string;
  description: string;
  actionLabel?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  avatar: string;
  productivityScore: number;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: string;
  status: 'active' | 'paused';
}
