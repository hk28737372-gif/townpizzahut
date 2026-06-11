import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'db.json');

// Interface structures matching client models paired with owner IDs
export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  avatar: string;
  productivityScore: number;
}

export interface DbNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  tags?: string[];
}

export interface DbReminder {
  id: string;
  userId: string;
  text: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  tags?: string[];
}

export interface DbDocument {
  id: string;
  userId: string;
  name: string;
  type: string;
  dateAdded: string;
  size: string;
  parsedInsights: string;
  isVerified: boolean;
}

export interface DbSubscription {
  id: string;
  userId: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: string;
  status: 'active' | 'paused';
}

export interface DbCaptureItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'note' | 'idea' | 'snippet' | 'url' | 'bookmark' | 'link';
  content?: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface DbActivityLog {
  id: string;
  userId: string;
  timestamp: string;
  type: 'note_created' | 'note_updated' | 'reminder_completed' | 'reminder_created' | 'capture_created';
  title: string;
  details?: string;
}

interface DatabaseSchema {
  users: DbUser[];
  notes: DbNote[];
  reminders: DbReminder[];
  documents: DbDocument[];
  subscriptions: DbSubscription[];
  captureItems: DbCaptureItem[];
  activityLogs: DbActivityLog[];
}

// Initial seed template for new signups
const SEED_NOTES = (userId: string): DbNote[] => [
  {
    id: `note-${Date.now()}-1`,
    userId,
    title: 'SaaS Investment Series Pitch Structure',
    content: 'Here is the fundamental outline for the seed investment round deck (targeting $4.5M at $45M cap):\n\n1. Executive Context - Stop building chatbots. Autonomy is the ultimate ceiling.\n2. Proactive OS Architecture - Detail our offline-first semantic memories.\n3. Market Wedge - Individual high-pacing professionals, builders & Silicon Valley founders.\n4. Scalability Metrics - Current productivity score indicators and document parsed verification indexes.\n\nNext Action: Sync this outline directly with our corporate attorney.',
    category: 'Finance',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isPinned: true
  },
  {
    id: `note-${Date.now()}-2`,
    userId,
    title: 'Brand Design Guidelines & Typography Pairs',
    content: 'Aesthetic pairs for the modern $100M valuation look:\n\n• Primary Display Typography: Plus Jakarta Sans for elite display tracking & modern look.\n• Code & Status Indicator: JetBrains Mono for exact telemetry outputs.\n• Color Pacing: Perfect slate black grids combined with translucent dark cards. High-contrast Indigo and Emerald accents.\n• Density Variation: Reject spacing constants. Rhythm comes from dynamic layouts.',
    category: 'General',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isPinned: false
  }
];

const SEED_REMINDERS = (userId: string): DbReminder[] => [
  {
    id: `rem-${Date.now()}-1`,
    userId,
    text: 'Deliver design spec draft to Silicon Valley team',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    priority: 'high',
    completed: false,
    category: 'Work'
  },
  {
    id: `rem-${Date.now()}-2`,
    userId,
    text: 'Review SaaS pitch analytics scorecard and tax forms',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days
    priority: 'medium',
    completed: false,
    category: 'Finance'
  },
  {
    id: `rem-${Date.now()}-3`,
    userId,
    text: 'Audit client registration legal agreements',
    dueDate: new Date().toISOString().split('T')[0], // today
    priority: 'high',
    completed: true,
    category: 'Legal'
  }
];

const SEED_DOCUMENTS = (userId: string): DbDocument[] => [
  {
    id: `doc-${Date.now()}-1`,
    userId,
    name: 'Client_Incorporation_v3.pdf',
    type: 'Legal PDF',
    dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    size: '2.4 MB',
    parsedInsights: "Registered Name: Nexa Systems LLC\nAuthorized Share Limit: 10,000,000 common stock assets\nRegistered Agent: CorpTrust Advisors LLC\nStatus Flag: High-priority active validation complete. Aligned with state guidelines.",
    isVerified: true
  }
];

const SEED_SUBSCRIPTIONS = (userId: string): DbSubscription[] => [
  { id: `sub-${Date.now()}-1`, userId, name: 'ChatGPT Plus', cost: 20.00, billingCycle: 'monthly', nextBillingDate: '2026-06-20', category: 'Productivity', status: 'active' },
  { id: `sub-${Date.now()}-2`, userId, name: 'Spotify Premium', cost: 11.99, billingCycle: 'monthly', nextBillingDate: '2026-06-18', category: 'Entertainment', status: 'active' }
];

const SEED_CAPTURES = (userId: string): DbCaptureItem[] => [
  { id: `cap-${Date.now()}-1`, userId, title: 'Silicon Valley Wedge Strategy', description: 'wedge into builders & high-performance executives', type: 'idea', category: 'Startup Ideas', tags: ['strategy', 'execution'], isFavorite: true, isArchived: false, createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
];

const SEED_LOGS = (userId: string): DbActivityLog[] => [
  { id: `log-${Date.now()}-1`, userId, timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }), type: 'note_created', title: 'Created business outline deck', details: 'Aesthetic spacing values' }
];

class Database {
  private schema: DatabaseSchema = {
    users: [],
    notes: [],
    reminders: [],
    documents: [],
    subscriptions: [],
    captureItems: [],
    activityLogs: []
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        this.schema = JSON.parse(data);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading Nexa Local Database file:', err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.schema, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving Nexa Local Database file:', err);
    }
  }

  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Users Auth
  register(email: string, name: string, pass: string): DbUser | null {
    this.load();
    const formattedEmail = email.toLowerCase().trim();
    if (this.schema.users.find(u => u.email === formattedEmail)) {
      return null; // Email taken
    }

    const userId = `user-${Date.now()}`;
    const newUser: DbUser = {
      id: userId,
      email: formattedEmail,
      name: name.trim(),
      passwordHash: this.hashPassword(pass),
      tier: 'Pro', // Provide Seed Pro tier by default to unlock full features
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop`,
      productivityScore: 94
    };

    this.schema.users.push(newUser);
    
    // Auto-populate seed values
    this.schema.notes.push(...SEED_NOTES(userId));
    this.schema.reminders.push(...SEED_REMINDERS(userId));
    this.schema.documents.push(...SEED_DOCUMENTS(userId));
    this.schema.subscriptions.push(...SEED_SUBSCRIPTIONS(userId));
    this.schema.captureItems.push(...SEED_CAPTURES(userId));
    this.schema.activityLogs.push(...SEED_LOGS(userId));

    this.save();
    return newUser;
  }

  registerOrLoginOAuth(email: string, name: string, avatar?: string): DbUser {
    this.load();
    const formattedEmail = email.toLowerCase().trim();
    const found = this.schema.users.find(u => u.email === formattedEmail);
    if (found) {
      if (avatar && (!found.avatar || found.avatar.includes('unsplash.com/photo-1534528741775-53994a69daeb'))) {
        found.avatar = avatar;
        this.save();
      }
      return found;
    }

    const userId = `user-${Date.now()}`;
    const newUser: DbUser = {
      id: userId,
      email: formattedEmail,
      name: name.trim() || 'Nexa Operator',
      passwordHash: '', // OAuth users bypass native passwords
      tier: 'Pro',
      avatar: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop`,
      productivityScore: 95
    };

    this.schema.users.push(newUser);

    // Auto-populate seed values
    this.schema.notes.push(...SEED_NOTES(userId));
    this.schema.reminders.push(...SEED_REMINDERS(userId));
    this.schema.documents.push(...SEED_DOCUMENTS(userId));
    this.schema.subscriptions.push(...SEED_SUBSCRIPTIONS(userId));
    this.schema.captureItems.push(...SEED_CAPTURES(userId));
    this.schema.activityLogs.push(...SEED_LOGS(userId));

    this.save();
    return newUser;
  }

  login(email: string, pass: string): DbUser | null {
    this.load();
    const formattedEmail = email.toLowerCase().trim();
    const user = this.schema.users.find(u => u.email === formattedEmail);
    if (!user) return null;
    
    const hash = this.hashPassword(pass);
    if (user.passwordHash === hash) {
      return user;
    }
    return null;
  }

  updateProfile(userId: string, update: Partial<DbUser>): DbUser | null {
    this.load();
    const userIdx = this.schema.users.findIndex(u => u.id === userId);
    if (userIdx === -1) return null;

    this.schema.users[userIdx] = {
      ...this.schema.users[userIdx],
      ...update
    };
    this.save();
    return this.schema.users[userIdx];
  }

  getUser(userId: string): DbUser | null {
    this.load();
    return this.schema.users.find(u => u.id === userId) || null;
  }

  // Notes CRUD
  getNotes(userId: string): DbNote[] {
    this.load();
    return this.schema.notes.filter(n => n.userId === userId).reverse();
  }

  addNote(userId: string, note: Omit<DbNote, 'id' | 'userId' | 'updatedAt'>): DbNote {
    this.load();
    const newNote: DbNote = {
      ...note,
      id: `note-${Date.now()}`,
      userId,
      isPinned: note.isPinned || false,
      isFavorite: note.isFavorite || false,
      isArchived: note.isArchived || false,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    this.schema.notes.push(newNote);
    this.save();
    return newNote;
  }

  updateNote(userId: string, noteId: string, update: Partial<DbNote>): DbNote | null {
    this.load();
    const idx = this.schema.notes.findIndex(n => n.id === noteId && n.userId === userId);
    if (idx === -1) return null;

    this.schema.notes[idx] = {
      ...this.schema.notes[idx],
      ...update,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    this.save();
    return this.schema.notes[idx];
  }

  deleteNote(userId: string, noteId: string): boolean {
    this.load();
    const initialLen = this.schema.notes.length;
    this.schema.notes = this.schema.notes.filter(n => !(n.id === noteId && n.userId === userId));
    const deleted = this.schema.notes.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Reminders CRUD
  getReminders(userId: string): DbReminder[] {
    this.load();
    return this.schema.reminders.filter(r => r.userId === userId).reverse();
  }

  addReminder(userId: string, reminder: Omit<DbReminder, 'id' | 'userId' | 'completed'>): DbReminder {
    this.load();
    const newRem: DbReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      userId,
      completed: false
    };
    this.schema.reminders.push(newRem);
    this.save();
    return newRem;
  }

  updateReminder(userId: string, reminderId: string, update: Partial<DbReminder>): DbReminder | null {
    this.load();
    const idx = this.schema.reminders.findIndex(r => r.id === reminderId && r.userId === userId);
    if (idx === -1) return null;

    this.schema.reminders[idx] = {
      ...this.schema.reminders[idx],
      ...update
    };
    this.save();
    return this.schema.reminders[idx];
  }

  deleteReminder(userId: string, reminderId: string): boolean {
    this.load();
    const initialLen = this.schema.reminders.length;
    this.schema.reminders = this.schema.reminders.filter(r => !(r.id === reminderId && r.userId === userId));
    const deleted = this.schema.reminders.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Documents CRUD
  getDocuments(userId: string): DbDocument[] {
    this.load();
    return this.schema.documents.filter(d => d.userId === userId).reverse();
  }

  addDocument(userId: string, doc: Omit<DbDocument, 'id' | 'userId' | 'dateAdded'>): DbDocument {
    this.load();
    const newDoc: DbDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      userId,
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    this.schema.documents.push(newDoc);
    this.save();
    return newDoc;
  }

  deleteDocument(userId: string, docId: string): boolean {
    this.load();
    const initialLen = this.schema.documents.length;
    this.schema.documents = this.schema.documents.filter(d => !(d.id === docId && d.userId === userId));
    const deleted = this.schema.documents.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Subscriptions Tracker
  getSubscriptions(userId: string): DbSubscription[] {
    this.load();
    return this.schema.subscriptions.filter(s => s.userId === userId).reverse();
  }

  addSubscription(userId: string, sub: Omit<DbSubscription, 'id' | 'userId'>): DbSubscription {
    this.load();
    const newSub: DbSubscription = {
      ...sub,
      id: `sub-${Date.now()}`,
      userId
    };
    this.schema.subscriptions.push(newSub);
    this.save();
    return newSub;
  }

  updateSubscription(userId: string, subId: string, update: Partial<DbSubscription>): DbSubscription | null {
    this.load();
    const idx = this.schema.subscriptions.findIndex(s => s.id === subId && s.userId === userId);
    if (idx === -1) return null;

    this.schema.subscriptions[idx] = {
      ...this.schema.subscriptions[idx],
      ...update
    };
    this.save();
    return this.schema.subscriptions[idx];
  }

  deleteSubscription(userId: string, subId: string): boolean {
    this.load();
    const initialLen = this.schema.subscriptions.length;
    this.schema.subscriptions = this.schema.subscriptions.filter(s => !(s.id === subId && s.userId === userId));
    const deleted = this.schema.subscriptions.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Knowledge Hub items
  getCaptureItems(userId: string): DbCaptureItem[] {
    this.load();
    return this.schema.captureItems.filter(c => c.userId === userId).reverse();
  }

  addCaptureItem(userId: string, c: Omit<DbCaptureItem, 'id' | 'userId' | 'createdAt'>): DbCaptureItem {
    this.load();
    const newItem: DbCaptureItem = {
      ...c,
      id: `cap-${Date.now()}`,
      userId,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    this.schema.captureItems.push(newItem);
    this.save();
    return newItem;
  }

  updateCaptureItem(userId: string, capId: string, update: Partial<DbCaptureItem>): DbCaptureItem | null {
    this.load();
    const idx = this.schema.captureItems.findIndex(c => c.id === capId && c.userId === userId);
    if (idx === -1) return null;

    this.schema.captureItems[idx] = {
      ...this.schema.captureItems[idx],
      ...update
    };
    this.save();
    return this.schema.captureItems[idx];
  }

  deleteCaptureItem(userId: string, capId: string): boolean {
    this.load();
    const initialLen = this.schema.captureItems.length;
    this.schema.captureItems = this.schema.captureItems.filter(c => !(c.id === capId && c.userId === userId));
    const deleted = this.schema.captureItems.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Activity logs
  getActivityLogs(userId: string): DbActivityLog[] {
    this.load();
    return this.schema.activityLogs.filter(a => a.userId === userId).reverse();
  }

  addActivityLog(userId: string, log: Omit<DbActivityLog, 'id' | 'userId' | 'timestamp'>): DbActivityLog {
    this.load();
    const newLog: DbActivityLog = {
      ...log,
      id: `log-${Date.now()}`,
      userId,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    this.schema.activityLogs.push(newLog);
    this.save();
    return newLog;
  }
}

export const dbInstance = new Database();
