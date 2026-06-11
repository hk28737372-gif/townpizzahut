import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, FileText, Bell, Files, X, 
  Command, CornerDownLeft, Sparkles, Plus, 
  Compass, Layout, FolderHeart, ShieldCheck, Bookmark, Link2
} from 'lucide-react';
import { Note, Reminder, Document, CaptureItem } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  reminders: Reminder[];
  documents: Document[];
  captureItems?: CaptureItem[];
  onSelectNote: (note: Note) => void;
  onSelectTab: (tab: string) => void;
  onTriggerCreateNote?: () => void;
  onTriggerCreateReminder?: () => void;
  onTriggerUniversalCapture?: () => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  notes,
  reminders,
  documents,
  captureItems = [],
  onSelectNote,
  onSelectTab,
  onTriggerCreateNote,
  onTriggerCreateReminder,
  onTriggerUniversalCapture
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState<string>('');

  // Handle escape & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Command items definition inspired by Linear / Raycast
  const commands = useMemo(() => {
    return [
      { id: 'nav-dash', title: 'Go to Dashboard', subtitle: 'View daily stats and summaries', action: () => { onSelectTab('dashboard'); onClose(); }, category: 'Navigation', icon: <Layout className="h-4 w-4 text-indigo-400" /> },
      { id: 'nav-notes', title: 'Go to Notes & Brain', subtitle: 'Brain draft repository', action: () => { onSelectTab('notes'); onClose(); }, category: 'Navigation', icon: <FileText className="h-4 w-4 text-emerald-400" /> },
      { id: 'nav-rems', title: 'Go to Tasks & Reminders', subtitle: 'Priority checklist scheduler', action: () => { onSelectTab('reminders'); onClose(); }, category: 'Navigation', icon: <Bell className="h-4 w-4 text-red-400" /> },
      { id: 'nav-hub', title: 'Go to Knowledge Hub', subtitle: 'Manage bookmarks and web files', action: () => { onSelectTab('hub'); onClose(); }, category: 'Navigation', icon: <Bookmark className="h-4 w-4 text-purple-400" /> },
      { id: 'nav-review', title: 'Go to Daily Review', subtitle: 'Analyze score history', action: () => { onSelectTab('review'); onClose(); }, category: 'Navigation', icon: <Sparkles className="h-4 w-4 text-amber-400" /> },
      
      { id: 'act-note', title: 'Create New Note', subtitle: 'Draft a clean text memory', action: () => { if (onTriggerCreateNote) onTriggerCreateNote(); else onSelectTab('notes'); onClose(); }, category: 'Actions', icon: <Plus className="h-4 w-4 text-indigo-400" /> },
      { id: 'act-rem', title: 'Create New Reminder', subtitle: 'Schedule alert calendar', action: () => { if (onTriggerCreateReminder) onTriggerCreateReminder(); else onSelectTab('reminders'); onClose(); }, category: 'Actions', icon: <Plus className="h-4 w-4 text-red-400" /> },
      { id: 'act-capture', title: 'Universal Intelligence Capture', subtitle: 'Bookmark a URL or snippet', action: () => { if (onTriggerUniversalCapture) onTriggerUniversalCapture(); else onSelectTab('hub'); onClose(); }, category: 'Actions', icon: <Plus className="h-4 w-4 text-teal-400" /> },
      
      { id: 'coll-startup', title: 'Smart Collection: Startup Ideas', subtitle: 'Browse startup notes', action: () => { onSelectTab('hub'); onClose(); }, category: 'Collections', icon: <FolderHeart className="h-4 w-4 text-pink-400" /> },
      { id: 'coll-research', title: 'Smart Collection: Business Research', subtitle: 'Browse business outlines', action: () => { onSelectTab('hub'); onClose(); }, category: 'Collections', icon: <FolderHeart className="h-4 w-4 text-indigo-400" /> },
      { id: 'coll-learn', title: 'Smart Collection: Learning', subtitle: 'Browse learning indexes', action: () => { onSelectTab('hub'); onClose(); }, category: 'Collections', icon: <FolderHeart className="h-4 w-4 text-amber-400" /> },
    ];
  }, [onSelectTab, onClose, onTriggerCreateNote, onTriggerCreateReminder, onTriggerUniversalCapture]);

  // Compute matches with rich virtual query/semantic router logic!
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Return default command recommendations
      return {
        commands: commands.slice(0, 5),
        notes: [],
        reminders: [],
        documents: [],
        typeMatched: null
      };
    }

    // Dynamic natural query processor
    let matchesStartup = q.includes('startup') || q.includes('business');
    let matchesReminders = q.includes('reminder') || q.includes('reminders') || q.includes('task') || q.includes('tasks') || q.includes('due') || q.includes('week');
    let matchesNotes = q.includes('note') || q.includes('notes') || q.includes('draft') || q.includes('drafts');
    let matchesAI = q.includes('ai') || q.includes('tool') || q.includes('tools') || q.includes('assistant');
    let matchesProductivity = q.includes('productivity') || q.includes('score') || q.includes('progress');

    // General term search for standard filtering
    const cleanSearchQuery = q
      .replace('show', '')
      .replace('notes', '')
      .replace('reminders', '')
      .replace('tasks', '')
      .replace('about', '')
      .replace('due', '')
      .replace('this', '')
      .replace('week', '')
      .trim();

    // Match exact commands
    const matchedCommands = commands.filter(c => 
      c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );

    // Match Notes
    const matchedNotes = notes.filter(n => {
      if (matchesStartup && n.category === 'Finance') return true;
      if (matchesAI && n.title.toLowerCase().includes('brand')) return true;
      if (matchesProductivity && n.title.toLowerCase().includes('brand')) return true;
      
      const textMatch = n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const categoryMatch = n.category && n.category.toLowerCase().includes(q);
      
      // Fallback to cleaner query
      const subcleanMatch = cleanSearchQuery ? (n.title.toLowerCase().includes(cleanSearchQuery) || n.content.toLowerCase().includes(cleanSearchQuery)) : false;

      return textMatch || categoryMatch || subcleanMatch;
    }).slice(0, 4);

    // Match Reminders
    const matchedReminders = reminders.filter(r => {
      if (matchesReminders && !r.completed) return true;
      
      const textMatch = r.text.toLowerCase().includes(q) || (r.category && r.category.toLowerCase().includes(q));
      
      const subcleanMatch = cleanSearchQuery ? r.text.toLowerCase().includes(cleanSearchQuery) : false;

      return textMatch || subcleanMatch;
    }).slice(0, 4);

    // Match Documents
    const matchedDocuments = documents.filter(d => 
      d.name.toLowerCase().includes(q) || d.parsedInsights.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      commands: matchedCommands,
      notes: matchedNotes,
      reminders: matchedReminders,
      documents: matchedDocuments,
      typeMatched: matchesStartup ? 'Startup Outlines' : matchesReminders ? 'Reminders & Tasks' : matchesAI ? 'AI Assets' : null
    };
  }, [query, notes, reminders, documents, commands]);

  const hasResults = 
    filteredResults.commands.length > 0 || 
    filteredResults.notes.length > 0 || 
    filteredResults.reminders.length > 0 || 
    filteredResults.documents.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:px-6">
      
      {/* Absolute Backdrop layout */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in" 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -10 }}
        className="w-full max-w-2xl bg-[#0c0c0f]/95 border border-[#1e1c2a] rounded-2xl shadow-2xl overflow-hidden relative z-10"
      >
        
        {/* Spotlight Command Input row */}
        <div className="flex items-center justify-between border-b border-zinc-90 w-full relative">
          <Search className="absolute left-5 h-4.5 w-4.5 text-zinc-500" />
          <input
            autoFocus
            type="text"
            id="spotlight-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search naturally ('reminders due this week', 'startup notes') or type actions..."
            className="w-full bg-transparent text-sm font-medium placeholder-zinc-500 text-zinc-200 py-4.5 pl-14 pr-16 focus:outline-none focus:ring-0"
          />
          <div className="absolute right-5 flex items-center gap-1">
            <span className="text-[9px] bg-zinc-900 border border-zinc-850 text-zinc-500 font-mono px-1.5 py-0.5 rounded">ESC</span>
            <button
              type="button"
              id="global-search-close"
              onClick={onClose}
              className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto p-4 space-y-4">
          
          {/* Natural intent Match Pill indicator */}
          {filteredResults.typeMatched && (
            <div className="mx-2 px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-[11px] flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
              <span>Nexa Semantic router detected query focus: <strong>"{filteredResults.typeMatched}"</strong></span>
            </div>
          )}

          {!query.trim() && (
            <div className="px-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold block mb-2">Recommended platform actions</span>
              <div className="space-y-1">
                {commands.slice(0, 4).map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/30 hover:bg-zinc-900 border border-transparent hover:border-zinc-850 text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 bg-zinc-900 rounded-lg flex items-center justify-center font-bold">
                        {cmd.icon}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-zinc-300 block">{cmd.title}</span>
                        <span className="text-[10px] text-zinc-550 block mt-0.5">{cmd.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.5 bg-zinc-900 rounded select-none">⌘ ENTER</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && !hasResults ? (
            <div className="py-12 text-center">
              <span className="text-xl">🔍</span>
              <h4 className="text-xs font-semibold text-zinc-400 mt-2">Zero matching brain cells found</h4>
              <p className="text-[11px] text-zinc-600 max-w-xs mx-auto mt-1 leading-normal font-light">
                No notes, reminders or smart collections match: "{query}".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Commands Matches */}
              {query.trim() && filteredResults.commands.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block px-2">Matched command actions</span>
                  {filteredResults.commands.map(cmd => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 bg-zinc-900 rounded-lg flex items-center justify-center">{cmd.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-zinc-100 block">{cmd.title}</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">{cmd.subtitle}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono uppercase text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-850">EXECUTE</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Notes Matches */}
              {filteredResults.notes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block px-2">Notes & Brain elements</span>
                  {filteredResults.notes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => {
                        onSelectNote(note);
                        onSelectTab('notes');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FileText className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors block truncate">{note.title}</span>
                          <span className="text-[10px] text-zinc-500 truncate block mt-0.5">{note.content}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">{note.category}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Reminders Matches */}
              {filteredResults.reminders.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block px-2 font-normal">Reminders & Alerts</span>
                  {filteredResults.reminders.map(rem => (
                    <button
                      key={rem.id}
                      onClick={() => {
                        onSelectTab('reminders');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Bell className={`h-4 w-4 flex-shrink-0 ${rem.completed ? 'text-zinc-655' : 'text-red-400'}`} />
                        <div className="truncate">
                          <span className={`text-xs block truncate font-semibold ${rem.completed ? 'line-through text-zinc-600 font-light' : 'text-zinc-200'}`}>{rem.text}</span>
                          <span className="text-[9px] text-zinc-550 block mt-0.5">Due: {rem.dueDate}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 font-mono rounded capitalize ${
                        rem.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-900 text-zinc-500'
                      }`}>{rem.priority}</span>
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Backdrop Status information line */}
        <div className="border-t border-zinc-900 bg-zinc-950/60 p-3 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1"><Command className="h-3 w-3" /> Spotlight search engine active</span>
          <span className="flex items-center gap-1 font-mono text-[9.5px]">Navigate tabs &middot; Browse brain collections</span>
        </div>

      </motion.div>
    </div>
  );
}
