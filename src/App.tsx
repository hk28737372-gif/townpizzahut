import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Bell, Menu, X, Command, LayoutDashboard, FileText, ShieldCheck } from 'lucide-react';

import { 
  Note, Reminder, Document, AIInsight, UserProfile, 
  Subscription, CaptureItem, Collection, ActivityLog 
} from './types';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import NotesView from './components/NotesView';
import RemindersView from './components/RemindersView';
import DocumentsView from './components/DocumentsView';
import SubscriptionsView from './components/SubscriptionsView';
import AIAssistantView from './components/AIAssistantView';
import SettingsView from './components/SettingsView';
import KnowledgeHubView from './components/KnowledgeHubView';
import DailyReviewView from './components/DailyReviewView';
import GlobalSearchModal from './components/GlobalSearchModal';
import AuthModal from './components/AuthModal';

// --- INITIAL SEED DATA ---
const INITIAL_PROFILE: UserProfile = {
  name: 'Founder Operator',
  email: 'operator@lifeadmin.ai',
  tier: 'Pro',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  productivityScore: 94
};

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'SaaS Investment Series Pitch Structure',
    content: 'Here is the fundamental outline for the LifeAdmin seed investment round deck (targeting $4.5M at $45M cap):\n\n1. Executive Context - Stop building chatbots. Autonomy is the ultimate ceiling.\n2. Proactive OS Architecture - Detail our offline-first semantic memories.\n3. Market Wedge - Individual high-pacing professionals, builders & Silicon Valley founders.\n4. Scalability Metrics - Current productivity score indicators and document parsed verification indexes.\n\nNext Action: Sync this outlines directly with our corporate attorney.',
    category: 'Finance',
    updatedAt: 'Jun 7, 2026',
    isPinned: true
  }
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    text: 'Deliver design spec draft to Silicon Valley team',
    dueDate: '2026-06-10',
    priority: 'high',
    completed: false,
    category: 'Work'
  }
];

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Client_Incorporation_v3.pdf',
    type: 'Legal PDF',
    dateAdded: 'Jun 5, 2026',
    size: '2.4 MB',
    parsedInsights: "Registered Name: LifeAdmin Systems LLC\nAuthorized Share Limit: 10,000,000 common stock assets\nRegistered Agent: CorpTrust Advisors LLC\nStatus Flag: High-priority active validation complete on June 1, 2026. Aligned with state guidelines.",
    isVerified: true
  }
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub-1', name: 'ChatGPT Plus', cost: 20.00, billingCycle: 'monthly', nextBillingDate: '2026-06-20', category: 'Productivity', status: 'active' }
];

const INITIAL_CAPTURES: CaptureItem[] = [
  { id: 'cap-1', title: 'Silicon Valley Wedge Strategy', description: 'wedge into builders & high-performance executives', type: 'idea', category: 'Startup Ideas', tags: ['strategy', 'execution'], isFavorite: true, isArchived: false, createdAt: 'Jun 8, 2026' }
];

const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'col-1', name: 'Startup Pitch Round', description: 'Materials related to Seed pitch execution', color: '#6366f1' },
  { id: 'col-2', name: 'Aesthetic Guidelines', description: 'Plus Jakarta Sans pairing guidelines', color: '#14b8a6' }
];

const INITIAL_LOGS: ActivityLog[] = [
  { id: 'log-1', timestamp: 'Jun 9, 2026 14:10', type: 'reminder_completed', title: 'Audit legal corporate arrangements', details: 'Status set to complete' }
];

const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'action',
    title: 'Inconsistencies in SaaS Investment note',
    description: "We compared your active 'SaaS Investment Deck Structure' note with your active financial targets. Click below to draft an automated professional sync write up.",
    actionLabel: 'Structure Pitch draft'
  },
  {
    id: 'insight-2',
    type: 'alert',
    title: 'High urgency action item due tomorrow',
    description: "You scheduled a high-priority delivery task ('Deliver design spec draft to team') due tomorrow. Would you like AI to pre-segment subtask components?",
    actionLabel: 'Deconstruct subtasks'
  }
];

export default function App() {
  // Global View Navigation State
  const [viewState, setViewState] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Auth Token & Profile States
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nexa_token'));
  const [user, setUser] = useState<UserProfile>(INITIAL_PROFILE);
  
  // App States synchronized from Express server database
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [captureItems, setCaptureItems] = useState<CaptureItem[]>(INITIAL_CAPTURES);
  const [collections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [insights, setInsights] = useState<AIInsight[]>(INITIAL_INSIGHTS);

  // Focus note state (triggered via Dashboard recent clicks or global search)
  const [noteFocus, setNoteFocus] = useState<Note | null>(null);

  // Global UI Overlay toggles
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [launchLoader, setLaunchLoader] = useState<boolean>(false);

  // Helper REST service fetch handler
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const savedToken = token || localStorage.getItem('nexa_token');
    if (!savedToken) return null;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${savedToken}`,
        ...(options.headers || {}),
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleSignOut();
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Server error.');
    }
    return response.json();
  };

  // Sync / Fetch user data on boot or token changes
  useEffect(() => {
    const savedToken = localStorage.getItem('nexa_token');
    if (savedToken) {
      setViewState('app');
    }
  }, []);

  useEffect(() => {
    const activeToken = token || localStorage.getItem('nexa_token');
    if (!activeToken) return;

    const syncLEDGER = async () => {
      try {
        const meRes = await fetchWithAuth('/api/auth/me');
        if (meRes && meRes.user) {
          setUser(meRes.user);
        }

        const notesRes = await fetchWithAuth('/api/notes');
        if (notesRes && notesRes.notes) setNotes(notesRes.notes);

        const remindersRes = await fetchWithAuth('/api/reminders');
        if (remindersRes && remindersRes.reminders) setReminders(remindersRes.reminders);

        const docsRes = await fetchWithAuth('/api/documents');
        if (docsRes && docsRes.documents) setDocuments(docsRes.documents);

        const subsRes = await fetchWithAuth('/api/subscriptions');
        if (subsRes && subsRes.subscriptions) setSubscriptions(subsRes.subscriptions);

        const capturesRes = await fetchWithAuth('/api/captures');
        if (capturesRes && capturesRes.captures) setCaptureItems(capturesRes.captures);

        const logsRes = await fetchWithAuth('/api/activity-logs');
        if (logsRes && logsRes.logs) setActivityLogs(logsRes.logs);
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        if (errMsg.includes('unauthorized') || errMsg.includes('missing') || errMsg.includes('expired')) {
          console.info('Core synchronisation: user session was expired or unauthorized.');
        } else {
          console.error('Core synchronisation failed:', err);
        }
      }
    };

    syncLEDGER();
  }, [token]);

  // Global Command-K keyboard listener
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  // Sync dashboard productivity score dynamically based on operational outcomes
  useEffect(() => {
    const totalCount = reminders.length;
    const completedCount = reminders.filter(r => r.completed).length;
    const notesFactor = Math.min(notes.length * 2, 10); // cap max 10% from note creation
    const baseScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 85) : 50;
    const finalScore = Math.min(baseScore + notesFactor, 100);

    setUser(prev => ({
      ...prev,
      productivityScore: finalScore || 80
    }));
  }, [reminders, notes]);

  // View switches
  const handleAuthSuccess = (authUser: UserProfile, authToken: string) => {
    localStorage.setItem('nexa_token', authToken);
    setToken(authToken);
    setUser(authUser);
    setViewState('app');
    setCurrentTab('dashboard');
  };

  const handleLaunchWorkspace = () => {
    const savedToken = token || localStorage.getItem('nexa_token');
    if (!savedToken) {
      setAuthModalOpen(true);
      return;
    }
    setLaunchLoader(true);
    // Mimic ultra-sleek loading transition for SaaS
    setTimeout(() => {
      setLaunchLoader(false);
      setViewState('app');
      setCurrentTab('dashboard');
    }, 1200);
  };

  const handleSignOut = () => {
    localStorage.removeItem('nexa_token');
    setToken(null);
    setViewState('landing');
  };

  const syncActivityLogs = () => {
    fetchWithAuth('/api/activity-logs')
      .then(res => {
        if (res && res.logs) setActivityLogs(res.logs);
      })
      .catch(err => console.error(err));
  };

  // --- MODEL MODIFIERS (AUTHENTICATED REST HANDLERS) ---
  const handleAddNote = async (newNoteData: Omit<Note, 'id' | 'updatedAt'>) => {
    try {
      const res = await fetchWithAuth('/api/notes', {
        method: 'POST',
        body: JSON.stringify(newNoteData)
      });
      if (res && res.note) {
        setNotes(prev => [res.note, ...prev]);
        setNoteFocus(res.note);
        setCurrentTab('notes');
        syncActivityLogs();
      }
    } catch (err) {
      console.error('Note mapping failed:', err);
    }
  };

  const handleUpdateNote = async (updated: Note) => {
    // Optimistic Update
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
    try {
      await fetchWithAuth(`/api/notes/${updated.id}`, {
        method: 'PUT',
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Note modification synchronization failed:', err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    // Optimistic delete
    setNotes(prev => prev.filter(n => n.id !== id));
    try {
      await fetchWithAuth(`/api/notes/${id}`, {
        method: 'DELETE'
      });
      syncActivityLogs();
    } catch (err) {
      console.error('Note erasure failed:', err);
    }
  };

  const handleAddReminder = async (newRemData: Omit<Reminder, 'id' | 'completed'>) => {
    try {
      const res = await fetchWithAuth('/api/reminders', {
        method: 'POST',
        body: JSON.stringify(newRemData)
      });
      if (res && res.reminder) {
        setReminders(prev => [res.reminder, ...prev]);
        syncActivityLogs();
      }
    } catch (err) {
      console.error('Schedule remainder failed:', err);
    }
  };

  const handleToggleReminder = async (id: string) => {
    const rem = reminders.find(r => r.id === id);
    if (!rem) return;

    const updatedCompleted = !rem.completed;
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: updatedCompleted } : r));

    try {
      await fetchWithAuth(`/api/reminders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: updatedCompleted })
      });
      syncActivityLogs();
    } catch (err) {
      console.error('Toggle remainder trigger failed:', err);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    try {
      await fetchWithAuth(`/api/reminders/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Reminder eradication failed:', err);
    }
  };

  const handleSelectFocusedNote = (note: Note) => {
    setNoteFocus(note);
    setCurrentTab('notes');
  };

  // Smart Documents Handlers
  const handleAddDocument = async (doc: Document) => {
    try {
      const res = await fetchWithAuth('/api/documents', {
        method: 'POST',
        body: JSON.stringify(doc)
      });
      if (res && res.document) {
        setDocuments(prev => [res.document, ...prev]);
        syncActivityLogs();
      }
    } catch (err) {
      console.error('Document integration failed:', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    try {
      await fetchWithAuth(`/api/documents/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Document elimination failed:', err);
    }
  };

  // Subscriptions Tracker Handlers
  const handleAddSubscription = async (newSub: Omit<Subscription, 'id'>) => {
    try {
      const res = await fetchWithAuth('/api/subscriptions', {
        method: 'POST',
        body: JSON.stringify(newSub)
      });
      if (res && res.subscription) {
        setSubscriptions(prev => [res.subscription, ...prev]);
      }
    } catch (err) {
      console.error('Subscription mapping failures:', err);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    try {
      await fetchWithAuth(`/api/subscriptions/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Subscription eradication failed:', err);
    }
  };

  const handleToggleSubscriptionStatus = async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;

    const newStatus = sub.status === 'active' ? 'paused' : 'active';
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

    try {
      await fetchWithAuth(`/api/subscriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Toggle subscription failed:', err);
    }
  };

  // Knowledge Hub item handlers
  const handleAddCaptureItem = async (newItem: Omit<CaptureItem, 'id' | 'createdAt'>) => {
    try {
      const res = await fetchWithAuth('/api/captures', {
        method: 'POST',
        body: JSON.stringify(newItem)
      });
      if (res && res.capture) {
        setCaptureItems(prev => [res.capture, ...prev]);
        syncActivityLogs();
      }
    } catch (err) {
      console.error('Capture mapping failed:', err);
    }
  };

  const handleToggleFavoriteCapture = async (id: string, isNote: boolean) => {
    if (isNote) {
      const n = notes.find(no => no.id === id);
      if (!n) return;
      const updatedFavorited = !n.isFavorite;
      setNotes(prev => prev.map(no => no.id === id ? { ...no, isFavorite: updatedFavorited } : no));
      try {
        await fetchWithAuth(`/api/notes/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ isFavorite: updatedFavorited })
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      const c = captureItems.find(ca => ca.id === id);
      if (!c) return;
      const updatedFavorited = !c.isFavorite;
      setCaptureItems(prev => prev.map(ca => ca.id === id ? { ...ca, isFavorite: updatedFavorited } : ca));
      try {
        await fetchWithAuth(`/api/captures/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ isFavorite: updatedFavorited })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleArchiveCapture = async (id: string, isNote: boolean) => {
    if (isNote) {
      const n = notes.find(no => no.id === id);
      if (!n) return;
      const updatedArchived = !n.isArchived;
      setNotes(prev => prev.map(no => no.id === id ? { ...no, isArchived: updatedArchived } : no));
      try {
        await fetchWithAuth(`/api/notes/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ isArchived: updatedArchived })
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      const c = captureItems.find(ca => ca.id === id);
      if (!c) return;
      const updatedArchived = !c.isArchived;
      setCaptureItems(prev => prev.map(ca => ca.id === id ? { ...ca, isArchived: updatedArchived } : ca));
      try {
        await fetchWithAuth(`/api/captures/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ isArchived: updatedArchived })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteCaptureItem = async (id: string) => {
    setCaptureItems(prev => prev.filter(c => c.id !== id));
    try {
      await fetchWithAuth(`/api/captures/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Capture erasure failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] font-sans antialiased text-zinc-100 selection:bg-indigo-600/30 overflow-x-hidden">
      
      {/* SaaS Landing loader */}
      <AnimatePresence>
        {launchLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#070709] z-[100] flex flex-col items-center justify-center gap-4"
          >
            <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center animate-spin shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase animate-pulse">Initializing Neural Workspace ...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: PREMIUM LANDING PAGE */}
        {viewState === 'landing' ? (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <LandingPage onLaunchApp={handleLaunchWorkspace} />
          </motion.div>
        ) : (
          
          // VIEW 2: LAUNCHED APP WORKSPACE LOGGED-IN
          <motion.div
            key="app-workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen bg-[#070709]"
          >
            {/* Sidebar Desk Column */}
            <div className="hidden md:block flex-shrink-0 w-64">
              <Sidebar
                currentTab={currentTab}
                onChangeTab={setCurrentTab}
                onSearchClick={() => setSearchModalOpen(true)}
                onSignOut={handleSignOut}
                user={user}
              />
            </div>

            {/* Main Application Shell (collapsible & mobile layouts responsive) */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
              
              {/* Mobile View Top Header Bar */}
              <header className="md:hidden flex items-center justify-between border-b border-zinc-900 bg-[#09090c]/90 px-4 h-16 sticky top-0 z-30 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-sm tracking-tight text-white">LifeAdmin AI</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="mobile-search-btn-trigger"
                    onClick={() => setSearchModalOpen(true)}
                    className="p-1.5 bg-zinc-900 border border-zinc-805 text-zinc-400 rounded-lg"
                  >
                    <Command className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    id="mobile-menu-btn-trigger"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-1.5 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-lg"
                  >
                    {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </button>
                </div>
              </header>

              {/* Mobile Sidebar overlay dialog toggles */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <>
                    <div 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity" 
                    />
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="md:hidden fixed top-0 bottom-0 left-0 w-64 bg-[#09090c] border-r border-[#18181b] z-50 shadow-2xl"
                    >
                      <Sidebar
                        currentTab={currentTab}
                        onChangeTab={(tab) => {
                          setCurrentTab(tab);
                          setMobileMenuOpen(false);
                        }}
                        onSearchClick={() => {
                          setSearchModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        onSignOut={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        user={user}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Dynamic Tabs view routers with elegant layout limits */}
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-10 animate-fade-in">
                {currentTab === 'dashboard' && (
                  <DashboardView
                    user={user}
                    notes={notes}
                    reminders={reminders}
                    documents={documents}
                    insights={insights}
                    onAddNote={() => handleAddNote({
                      title: 'Untitled pitch',
                      content: 'Draft your content memories here...',
                      category: 'General',
                      isPinned: false
                    })}
                    onAddReminder={() => setCurrentTab('reminders')}
                    onToggleReminder={handleToggleReminder}
                    onSelectNote={handleSelectFocusedNote}
                    onSelectTab={setCurrentTab}
                    onTriggerSearch={() => setSearchModalOpen(true)}
                  />
                )}

                {currentTab === 'documents' && (
                  <DocumentsView
                    documents={documents}
                    onAddDocument={handleAddDocument}
                    onDeleteDocument={handleDeleteDocument}
                  />
                )}

                {currentTab === 'notes' && (
                  <NotesView
                    notes={notes}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                    initialSelectedNote={noteFocus}
                    onClearInitialSelected={() => setNoteFocus(null)}
                  />
                )}

                {currentTab === 'reminders' && (
                  <RemindersView
                    reminders={reminders}
                    onAddReminder={handleAddReminder}
                    onToggleReminder={handleToggleReminder}
                    onDeleteReminder={handleDeleteReminder}
                  />
                )}

                {currentTab === 'subscriptions' && (
                  <SubscriptionsView
                    subscriptions={subscriptions}
                    onAddSubscription={handleAddSubscription}
                    onDeleteSubscription={handleDeleteSubscription}
                    onToggleStatus={handleToggleSubscriptionStatus}
                  />
                )}

                {currentTab === 'hub' && (
                  <KnowledgeHubView
                    captureItems={captureItems}
                    notes={notes}
                    collections={collections}
                    onAddCaptureItem={handleAddCaptureItem}
                    onToggleFavoriteCapture={handleToggleFavoriteCapture}
                    onToggleArchiveCapture={handleToggleArchiveCapture}
                    onDeleteCaptureItem={handleDeleteCaptureItem}
                    onDeleteNote={handleDeleteNote}
                    onAddNote={handleAddNote}
                  />
                )}

                {currentTab === 'assistant' && (
                  <AIAssistantView
                    notes={notes}
                    reminders={reminders}
                    documents={documents}
                  />
                )}

                {currentTab === 'review' && (
                  <DailyReviewView
                    reminders={reminders}
                    notes={notes}
                    captureItems={captureItems}
                    activityLogs={activityLogs}
                    productivityScore={user.productivityScore}
                  />
                )}

                {currentTab === 'settings' && (
                  <SettingsView
                    user={user}
                    onUpdateProfile={setUser}
                  />
                )}
              </main>

              {/* Mobile Bottom Tab Bar (Page-by-Page Mobile Experience) */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#09090c]/95 border-t border-zinc-900/80 backdrop-blur-md flex items-center justify-around z-50 px-2 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'documents', label: 'Smart Docs', icon: ShieldCheck },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'assistant', label: 'Nexa AI', icon: Sparkles },
                  { id: 'reminders', label: 'Tasks', icon: Bell },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-1 transition-all ${
                        isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110 text-indigo-400' : 'text-zinc-500'}`} />
                      <span className={`text-[9px] tracking-tight font-medium font-sans ${isActive ? 'text-indigo-400 font-semibold' : 'text-zinc-500'}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL Unified Command-K Search overlay */}
      <AnimatePresence>
        {searchModalOpen && (
          <GlobalSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            notes={notes}
            reminders={reminders}
            documents={documents}
            onSelectNote={handleSelectFocusedNote}
            onSelectTab={setCurrentTab}
          />
        )}
      </AnimatePresence>

      {/* GLOBAL Executive Auth Modal panel */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
