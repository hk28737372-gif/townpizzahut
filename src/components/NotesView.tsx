import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Trash2, Plus, Search, Pin, 
  Loader2, Check, X, Bookmark, FileText, 
  ChevronRight, RefreshCw, Star, Info
} from 'lucide-react';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  initialSelectedNote: Note | null;
  onClearInitialSelected: () => void;
}

const CATEGORIES = ['General', 'Work', 'Personal', 'Finance', 'Legal'];

export default function NotesView({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  initialSelectedNote,
  onClearInitialSelected
}: NotesViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Note selected locally
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialSelectedNote?.id || (notes[0]?.id || null)
  );

  // If initialSelectedNote changes from outside (e.g. from Dashboard click), focus on it
  if (initialSelectedNote && initialSelectedNote.id !== selectedNoteId) {
    setSelectedNoteId(initialSelectedNote.id);
    onClearInitialSelected();
  }

  const selectedNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // AI action helper states
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiLoadingText, setAiLoadingText] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiResponseAction, setAiResponseAction] = useState<string>('');

  // Filter notes based on active category and search
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchCategory = activeCategory === 'All' || note.category === activeCategory;
      const matchSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [notes, activeCategory, searchQuery]);

  // Handle local note fields edit
  const handleFieldChange = (key: keyof Note, value: any) => {
    if (!selectedNote) return;
    onUpdateNote({
      ...selectedNote,
      [key]: value,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  };

  // Quick Action triggers
  const executeAiAction = (actionType: 'summarize' | 'professional' | 'shorten' | 'expand' | 'actions') => {
    if (!selectedNote || !selectedNote.content.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    // Pick a cute loading label depending on action
    const loadingLabels = {
      summarize: 'Synthesizing core details...',
      professional: 'Refactoring tone to professional executive format...',
      shorten: 'Condensing structure to key impact statements...',
      expand: 'Elaborating semantic context & background details...',
      actions: 'Extracting clean chronological action checklist...'
    };
    setAiLoadingText(loadingLabels[actionType]);

    // Simulate real high-fidelity generative response
    setTimeout(() => {
      const content = selectedNote.content;
      const title = selectedNote.title || 'Untitled note';
      let synthesizedText = '';

      switch (actionType) {
        case 'summarize':
          synthesizedText = `=== AI EXECUTIVE SUMMARY ===\n\n📌 SOURCE: "${title}"\n\nThis document primarily details core strategic items regarding ${selectedNote.category.toLowerCase()} activity. \n\n• Key Takeaway: Immediate pacing and administrative execution is recommended.\n• Core Focus: Organizing next-phase action markers while maintaining zero security exposure.\n• Priority Level: Optimal.`;
          break;
        case 'professional':
          synthesizedText = `I am writing to synthesize our progress regarding "${title}". Based on our latest tracking data, we are currently positioned to execute the next phase of our ${selectedNote.category.toLowerCase()} strategic guidelines. All current operations are aligned with standard quality and efficiency markers, with appropriate risk-remediation guidelines ready for deployment. Please review and insert this draft directly back into the record.`;
          break;
        case 'shorten':
          synthesizedText = `• Focus: Executive orchestration of ${selectedNote.category.toLowerCase()} objectives ("${title}").\n• Direct Action: Complete due reminders immediately.\n• Output: Clear tracking updates submitted in due sequence.`;
          break;
        case 'expand':
          synthesizedText = `=== DETAILED STRATEGIC EXPANSION ===\n\nCONTEXT: This document covers key ${selectedNote.category.toLowerCase()} initiatives, labeled: "${title}". To ensure standard operational scale, we have mapped a robust overview.\n\nRECOMMENDATIONS:\n1. Integrate calendar guidelines directly within immediate workspace queues.\n2. Ensure zero-knowledge privacy parameters across note categories.\n3. Conduct standard reviews every Tuesday to evaluate score indexes.`;
          break;
        case 'actions':
          synthesizedText = `=== AI-GENERATED CHECKLIST ACTIONS ===\n\nBased on your notes regarding: "${title}", here are your next immediate administrative triggers:\n\n[ ] Action 1: Audit all relevant document guidelines & size restrictions.\n[ ] Action 2: Schedule quick priority reminders corresponding to the ${selectedNote.category.toLowerCase()} task category.\n[ ] Action 3: Review summary scorecard inside the LifeAdmin main dashboard.`;
          break;
      }

      setAiResponse(synthesizedText);
      setAiResponseAction(actionType);
      setAiLoading(false);
    }, 1500);
  };

  const handleApplyAiRewrite = () => {
    if (!selectedNote || !aiResponse) return;
    handleFieldChange('content', aiResponse);
    setAiResponse(null);
  };

  const handleCreateNewNote = () => {
    const fresh: Omit<Note, 'id' | 'updatedAt'> = {
      title: 'New Note Insight',
      content: 'Start writing your personal operating notes here. Pro tip: Use the AI assistant panel below to professionalize or summarize this card anytime.',
      category: activeCategory !== 'All' ? activeCategory : 'General',
      isPinned: false
    };
    onAddNote(fresh);
  };

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* LEFT COLUMN: NOTES INDEX (5 cols) */}
      <div className="lg:col-span-4 bg-[#0c0c0f] border border-zinc-900 rounded-2.5xl p-5 flex flex-col justify-between overflow-hidden">
        <div className="space-y-4 flex flex-col h-full">
          
          {/* Headline & Add Btn */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-indigo-400" /> Notes & Memory
            </h2>
            <button
              type="button"
              id="notes-btn-create-top"
              onClick={handleCreateNewNote}
              className="h-8 w-8 bg-indigo-600 hover:bg-indigo-505 text-white rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_10px_rgba(99,102,241,0.2)]"
              title="Create note"
            >
              <Plus className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              id="notes-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search note titles or content..."
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-500/40 text-xs rounded-xl pl-10 pr-4 py-2.5 text-zinc-250 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                id="notes-search-clear"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Categories Tab selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {['All', ...CATEGORIES].map(category => (
              <button
                key={category}
                type="button"
                id={`notes-cat-tab-${category}`}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 text-[10px] font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === category
                    ? 'bg-indigo-600/10 text-indigo-300 border-indigo-505/20'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Notes Scroll List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 mt-2">
            {filteredNotes.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl text-center p-4">
                <span className="text-zinc-600 text-lg mb-2">📂</span>
                <p className="text-xs text-zinc-500 font-light">No notes match your category or query.</p>
                <button
                  type="button"
                  id="notes-create-empty-list"
                  onClick={handleCreateNewNote}
                  className="mt-3 text-[10px] font-semibold text-indigo-400 hover:underline cursor-pointer"
                >
                  Create new note
                </button>
              </div>
            ) : (
              filteredNotes.map(note => {
                const isActive = note.id === selectedNoteId;
                return (
                  <button
                    key={note.id}
                    type="button"
                    id={`note-item-${note.id}`}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setAiResponse(null); // Clear active rewrite comparison on switch
                    }}
                    className={`w-full p-4 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                      isActive
                        ? 'bg-zinc-950 border-indigo-550/20 shadow-[0_4px_20px_rgba(99,102,241,0.02)]'
                        : 'bg-zinc-950/20 border-zinc-900 hover:bg-zinc-950/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-xs font-bold leading-tight truncate ${
                          isActive ? 'text-indigo-300' : 'text-zinc-250 group-hover:text-white'
                        }`}>
                          {note.title || 'Untitled Note'}
                        </h4>
                        {note.isPinned && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500/10 flex-shrink-0" />}
                      </div>

                      <p className="text-[11px] text-zinc-450 mt-1 lines-clamp-2 line-clamp-2 leading-relaxed">
                        {note.content || 'Start taking records...'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900/60 text-[9px] text-zinc-550">
                      <span>{note.updatedAt}</span>
                      <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-medium text-zinc-400">
                        {note.category}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: NOTE WORKSPACE EDITOR (8 cols) */}
      <div className="lg:col-span-8 bg-[#0c0c0f] border border-zinc-900 rounded-2.5xl flex flex-col justify-between overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!selectedNote ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" id="editor-empty-state">
              <div className="h-12 w-12 bg-indigo-500/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/10 mb-4 animate-bounce">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">No Note Selected</h3>
              <p className="text-xs text-zinc-450 mt-1.5 max-w-xs font-light leading-relaxed">
                Choose a note card from the memories listing on the left, or initiate a brand new record card instantly.
              </p>
              <button
                type="button"
                id="notes-btn-create-center"
                onClick={handleCreateNewNote}
                className="mt-6 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Initiate New Note Memory
              </button>
            </div>
          ) : (
            <motion.div
              key={selectedNote.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-between"
            >
              
              {/* Note Editor controls */}
              <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-zinc-400 rounded">
                    Active Editor
                  </span>
                  <span className="text-zinc-600 text-xs">/</span>
                  <select
                    id="editor-category-select"
                    value={selectedNote.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="bg-transparent border-0 text-xs text-indigo-400 font-semibold focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-zinc-950 text-zinc-200">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="editor-pin-toggle"
                    onClick={() => handleFieldChange('isPinned', !selectedNote.isPinned)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      selectedNote.isPinned 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={selectedNote.isPinned ? 'Unpin Note' : 'Pin Note'}
                  >
                    <Pin className={`h-4.5 w-4.5 ${selectedNote.isPinned ? 'fill-yellow-500/10' : ''}`} />
                  </button>
                  <button
                    type="button"
                    id="editor-delete-btn"
                    onClick={() => {
                      onDeleteNote(selectedNote.id);
                      setSelectedNoteId(null);
                    }}
                    className="p-2 bg-zinc-950 border border-zinc-900 hover:border-red-500/30 text-zinc-500 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Note Edit Fields */}
              <div className="p-6 flex-1 flex flex-col space-y-4 overflow-y-auto">
                {/* Title */}
                <input
                  type="text"
                  id="editor-title-input"
                  value={selectedNote.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Note Title Example"
                  className="w-full bg-transparent border-none text-xl sm:text-2xl font-extrabold focus:outline-none focus:ring-0 text-white placeholder-zinc-700 tracking-tight"
                />

                {/* Body Content */}
                <textarea
                  id="editor-content-textarea"
                  value={selectedNote.content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  placeholder="Unleash your cognitive memory vectors here of what to track or manage..."
                  className="w-full flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm text-zinc-300 placeholder-zinc-700 leading-relaxed resize-none min-h-[160px]"
                />

                {/* AI suggestion overlay component */}
                <AnimatePresence>
                  {aiResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="bg-zinc-950 border border-[#6366f1]/25 rounded-2xl p-5 shadow-2x shadow-indigo-600/5 relative"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
                        <span className="text-[10px] font-mono tracking-widest text-[#14b8a6] uppercase font-bold flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" /> AI Assistant Suggestion
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            id="ai-apply-action"
                            onClick={handleApplyAiRewrite}
                            className="bg-indigo-600 hover:bg-indigo-505 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Apply Rewrite
                          </button>
                          <button
                            type="button"
                            id="ai-dismiss-action"
                            onClick={() => setAiResponse(null)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1"
                          >
                            <X className="h-3 w-3" /> Cancel
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-[#0b0b0e] border border-zinc-900 p-4 rounded-xl whitespace-pre-wrap max-h-52 overflow-y-auto">
                        {aiResponse}
                      </p>
                      <div className="text-[9px] text-zinc-500 mt-2 font-light">
                        Pro tip: Review the changes compiled by AI. Apply to replace the original content block with this version.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Generative shortcuts bar */}
              <div className="p-4 border-t border-zinc-900 bg-[#09090C] rounded-b-2.5xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span className="font-semibold text-zinc-300">AI Note Assistant:</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {/* AI Loader trigger */}
                  {aiLoading ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 text-xs border border-indigo-550/20 rounded-xl">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{aiLoadingText}</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        id="ai-shortcut-summarize"
                        onClick={() => executeAiAction('summarize')}
                        disabled={!selectedNote.content.trim()}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] tracking-wide font-semibold border border-zinc-80 w-auto rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Summarize
                      </button>
                      <button
                        type="button"
                        id="ai-shortcut-professional"
                        onClick={() => executeAiAction('professional')}
                        disabled={!selectedNote.content.trim()}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] tracking-wide font-semibold border border-zinc-80 w-auto rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Rewrite Professionally
                      </button>
                      <button
                        type="button"
                        id="ai-shortcut-shorten"
                        onClick={() => executeAiAction('shorten')}
                        disabled={!selectedNote.content.trim()}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] tracking-wide font-semibold border border-zinc-80 w-auto rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Shorten
                      </button>
                      <button
                        type="button"
                        id="ai-shortcut-expand"
                        onClick={() => executeAiAction('expand')}
                        disabled={!selectedNote.content.trim()}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] tracking-wide font-semibold border border-zinc-80 w-auto rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Expand
                      </button>
                      <button
                        type="button"
                        id="ai-shortcut-actions"
                        onClick={() => executeAiAction('actions')}
                        disabled={!selectedNote.content.trim()}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] tracking-wide font-semibold border border-zinc-80 w-auto rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Create Action Items
                      </button>
                    </>
                  )}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
