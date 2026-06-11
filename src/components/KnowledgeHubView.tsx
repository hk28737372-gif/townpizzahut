import React, { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Grid, List, Bookmark, FileText, Lightbulb, 
  Link2, Star, Archive, Plus, ArrowUpRight, FolderHeart, 
  Trash2, Filter, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { CaptureItem, Note, Collection } from '../types';

interface KnowledgeHubViewProps {
  captureItems: CaptureItem[];
  notes: Note[];
  collections: Collection[];
  onAddCaptureItem: (item: Omit<CaptureItem, 'id' | 'createdAt'>) => void;
  onToggleFavoriteCapture: (id: string, isNote: boolean) => void;
  onToggleArchiveCapture: (id: string, isNote: boolean) => void;
  onDeleteCaptureItem: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
}

export default function KnowledgeHubView({
  captureItems,
  notes,
  collections,
  onAddCaptureItem,
  onToggleFavoriteCapture,
  onToggleArchiveCapture,
  onDeleteCaptureItem,
  onDeleteNote,
  onAddNote
}: KnowledgeHubViewProps) {
  // Navigation & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all'); // all, note, idea, snippet, link
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // all, Startup Ideas, Business Research, Learning, Personal, Work
  const [showArchived, setShowArchived] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Quick Add Simple inline state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickType, setQuickType] = useState<'note' | 'idea' | 'snippet' | 'url' | 'bookmark' | 'link'>('idea');
  const [quickContent, setQuickContent] = useState('');
  const [quickCategory, setQuickCategory] = useState('Startup Ideas');
  const [quickTags, setQuickTags] = useState('');

  // Combine Notes and Capture items for single Brain hub representation
  const combinedItems = useMemo(() => {
    const parsedNotes = notes.map(n => ({
      id: n.id,
      title: n.title,
      description: n.content.slice(0, 140) + (n.content.length > 140 ? '...' : ''),
      type: 'note' as const,
      content: n.content,
      category: n.category || 'General',
      tags: n.tags || ['Brain', 'Note'],
      isFavorite: !!n.isFavorite,
      isArchived: !!n.isArchived,
      createdAt: n.updatedAt,
      rawItem: n
    }));

    const parsedCaptures = captureItems.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      type: c.type,
      content: c.content,
      category: c.category,
      tags: c.tags,
      isFavorite: c.isFavorite,
      isArchived: c.isArchived,
      createdAt: c.createdAt,
      rawItem: c
    }));

    return [...parsedNotes, ...parsedCaptures];
  }, [notes, captureItems]);

  // Filters & sorting
  const filteredItems = useMemo(() => {
    return combinedItems.filter(item => {
      // Search term match
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type match
      const matchesType = selectedType === 'all' || item.type === selectedType;

      // Category match
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Archived state
      const matchesArchive = showArchived ? item.isArchived : !item.isArchived;

      // Favorites only
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      return matchesSearch && matchesType && matchesCategory && matchesArchive && matchesFavorites;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [combinedItems, searchQuery, selectedType, selectedCategory, showArchived, showFavoritesOnly, sortBy]);

  const handleCreateCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const tagsArr = quickTags.split(',').map(t => t.trim()).filter(Boolean);

    if (quickType === 'note') {
      onAddNote({
        title: quickTitle,
        content: quickContent || quickDesc || 'Empty thoughts...',
        category: quickCategory,
        isPinned: false,
        isFavorite: false,
        isArchived: false,
        tags: tagsArr.length > 0 ? tagsArr : ['Direct']
      });
    } else {
      onAddCaptureItem({
        title: quickTitle,
        description: quickDesc,
        type: quickType,
        content: quickContent,
        category: quickCategory,
        tags: tagsArr.length > 0 ? tagsArr : ['Captured'],
        isFavorite: false,
        isArchived: false
      });
    }

    // Reset Form
    setQuickTitle('');
    setQuickDesc('');
    setQuickContent('');
    setQuickTags('');
    setQuickAddOpen(false);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'note': return <FileText className="h-4 w-4 text-emerald-400" />;
      case 'idea': return <Lightbulb className="h-4 w-4 text-amber-400" />;
      case 'url':
      case 'bookmark':
      case 'link': return <Link2 className="h-4 w-4 text-indigo-400" />;
      default: return <Bookmark className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* View Header with Statistics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Digital Operating Room</span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            Knowledge Hub <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">Brain Layer</span>
          </h2>
          <p className="text-sm text-zinc-400 font-light leading-relaxed mt-2 max-w-xl">
            Sift, query, sort and categorize your entire gathered notes, bookmark connections, snippets, and research structures instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="hub-btn-archive-toggle"
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showArchived 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-zinc-950/40 text-zinc-450 border-zinc-900 hover:text-white hover:border-zinc-800'
            }`}
          >
            <Archive className="h-3.5 w-3.5" />
            {showArchived ? 'Viewing Archived' : 'Show Archive'}
          </button>

          <button
            type="button"
            id="hub-btn-quickadd"
            onClick={() => setQuickAddOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-505 text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Universal Capture
          </button>
        </div>
      </div>

      {/* Grid of counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">Total Elements</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-white">{combinedItems.length}</span>
            <span className="text-xs text-zinc-500">records</span>
          </div>
        </div>
        <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">Active Notes</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{notes.length}</span>
            <span className="text-xs text-zinc-500">drafts</span>
          </div>
        </div>
        <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">URLs & Links</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-indigo-400">{captureItems.filter(c => c.type === 'url' || c.type === 'link').length}</span>
            <span className="text-xs text-zinc-500 font-normal">assets</span>
          </div>
        </div>
        <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">Starred Favorites</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {combinedItems.filter(c => c.isFavorite).length}
            </span>
            <span className="text-xs text-zinc-500">starred</span>
          </div>
        </div>
      </div>

      {/* Filter and control panel */}
      <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search input field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            id="hub-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, ideas, saved URLs, tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-900 focus:border-indigo-500/50 rounded-xl text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Filters Select row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Type */}
          <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-900 px-3 py-1.5 rounded-xl text-xs text-zinc-450">
            <Filter className="h-3 w-3 text-zinc-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent border-none text-xs text-zinc-200 focus:outline-none"
            >
              <option value="all" className="bg-zinc-950">All Types</option>
              <option value="note" className="bg-zinc-950">Notes</option>
              <option value="idea" className="bg-zinc-950">Ideas</option>
              <option value="snippet" className="bg-zinc-950">Snippets</option>
              <option value="url" className="bg-zinc-950">Bookmarks</option>
            </select>
          </div>

          {/* Filter Category */}
          <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-900 px-3 py-1.5 rounded-xl text-xs text-zinc-450">
            <FolderHeart className="h-3 w-3 text-zinc-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-xs text-zinc-200 focus:outline-none"
            >
              <option value="all" className="bg-zinc-950">All Collections</option>
              <option value="Startup Ideas" className="bg-zinc-950">Startup Ideas</option>
              <option value="Business Research" className="bg-zinc-950">Business Research</option>
              <option value="Learning" className="bg-zinc-950">Learning</option>
              <option value="Personal" className="bg-zinc-950">Personal</option>
              <option value="Work" className="bg-zinc-950">Work</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-900 px-3 py-1.5 rounded-xl text-xs text-zinc-450">
            <ArrowUpDown className="h-3 w-3 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-xs text-zinc-200 focus:outline-none"
            >
              <option value="newest" className="bg-zinc-950">Newest First</option>
              <option value="oldest" className="bg-zinc-950">Oldest First</option>
              <option value="alphabetical" className="bg-zinc-950">Alphabetical</option>
            </select>
          </div>

          {/* Favorites Star Filter Toggle */}
          <button
            type="button"
            id="hub-btn-toggle-favs"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-1.5 border rounded-xl transition-all cursor-pointer ${
              showFavoritesOnly 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-zinc-900/40 border-zinc-900 text-zinc-500 hover:text-zinc-200'
            }`}
            title="Favorites Only"
          >
            <Star className="h-4 w-4" fill={showFavoritesOnly ? '#fbbf24' : 'none'} />
          </button>

          {/* List Layout toggling */}
          <div className="h-8 w-px bg-zinc-900 mx-1 hidden sm:block" />
          
          <div className="flex bg-zinc-900/80 p-1 border border-zinc-800/65 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Grid Layout"
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-lg ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="List Layout"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ITEMS DISCOVERY CARDS */}
      {filteredItems.length === 0 ? (
        <div className="border border-zinc-900/80 border-dashed rounded-3xl p-12 text-center bg-zinc-950/10">
          <div className="h-10 w-10 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="h-5 w-5 text-zinc-650" />
          </div>
          <span className="text-sm font-semibold text-zinc-200">No Brain Elements Found</span>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing input query words, or capture your first universal record.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <motion.div
              layout
              key={item.id}
              className={`bg-[#0a0a0d]/80 border ${
                item.isFavorite ? 'border-amber-500/20' : 'border-zinc-900/80'
              } hover:border-[#1e1c2a] hover:bg-[#0c0b11]/90 rounded-2xl p-5 transition-all duration-300 group flex flex-col justify-between h-[180px] shadow-sm`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md flex items-center gap-1 text-zinc-400">
                    {getIcon(item.type)} {item.type}
                  </span>
                  
                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      id={`fav-btn-${item.id}`}
                      onClick={() => onToggleFavoriteCapture(item.id, item.type === 'note')}
                      className={`p-1 hover:bg-zinc-900 rounded ${item.isFavorite ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <Star className="h-3.5 w-3.5" fill={item.isFavorite ? '#fbbf24' : 'none'} />
                    </button>
                    <button
                      type="button"
                      id={`arch-btn-${item.id}`}
                      onClick={() => onToggleArchiveCapture(item.id, item.type === 'note')}
                      className={`p-1 hover:bg-zinc-900 rounded ${item.isArchived ? 'text-indigo-400' : 'text-zinc-500 hover:text-teal-400'}`}
                      title={item.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      id={`del-btn-${item.id}`}
                      onClick={() => item.type === 'note' ? onDeleteNote(item.id) : onDeleteCaptureItem(item.id)}
                      className="p-1 hover:bg-[#3b1c1c] text-zinc-500 hover:text-red-400 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-zinc-100 tracking-tight mt-3 text-ellipsis overflow-hidden whitespace-nowrap">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-400 font-light mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-900/80 pt-3 mt-4 text-[10px]">
                <span className="text-zinc-500 font-mono">{item.category}</span>
                <span className="text-zinc-550">{item.createdAt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-900">
          {filteredItems.map(item => (
            <motion.div
              layout
              key={item.id}
              className="flex items-center justify-between p-4 bg-transparent hover:bg-zinc-900/35 transition-colors text-xs"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="h-7 w-7 bg-zinc-900/80 rounded-lg flex items-center justify-center border border-zinc-800">
                  {getIcon(item.type)}
                </span>
                <div className="min-w-0">
                  <h4 className="font-bold text-zinc-100 tracking-tight truncate max-w-sm">{item.title}</h4>
                  <p className="text-[10px] text-zinc-400 font-light truncate max-w-lg mt-0.5">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="font-mono text-[9px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-normal text-zinc-450 hidden md:inline">
                  {item.category}
                </span>
                
                <span className="font-mono text-zinc-550 text-[10px] hidden sm:inline">{item.createdAt}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleFavoriteCapture(item.id, item.type === 'note')}
                    className={`p-1 rounded ${item.isFavorite ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-350'}`}
                  >
                    <Star className="h-3.5 w-3.5" fill={item.isFavorite ? '#fbbf24' : 'none'} />
                  </button>
                  <button
                    onClick={() => onToggleArchiveCapture(item.id, item.type === 'note')}
                    className="p-1 text-zinc-500 hover:text-zinc-350"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* QUICK CAPTURE MODAL OVERLAY */}
      <AnimatePresence>
        {quickAddOpen && (
          <>
            <div 
              onClick={() => setQuickAddOpen(false)} 
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60]" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-lg bg-[#0c0c0f]/95 border border-[#1f1d2b] rounded-2xl p-6 shadow-2xl z-[70]"
            >
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-6">
                <Bookmark className="h-4 w-4 text-indigo-400" /> Universal Intelligence Capture
              </h3>

              <form onSubmit={handleCreateCapture} className="space-y-4">
                {/* Selector tags row */}
                <div className="grid grid-cols-4 gap-2">
                  {(['note', 'idea', 'snippet', 'url'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQuickType(t)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg capitalize select-none transition-colors border ${
                        quickType === t 
                          ? 'bg-indigo-600/10 text-indigo-300 border-indigo-500/30' 
                          : 'bg-zinc-900/60 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Capture Title</label>
                  <input
                    type="text"
                    required
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="Enter short title or URL label..."
                    className="w-full bg-zinc-900 border border-zinc-900 focus:border-indigo-505/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Brief Description</label>
                  <input
                    type="text"
                    value={quickDesc}
                    onChange={(e) => setQuickDesc(e.target.value)}
                    placeholder="Context, outline preview, or quick thoughts..."
                    className="w-full bg-zinc-900 border border-zinc-900 focus:border-indigo-505/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                </div>

                {/* Additional content section for Notes or links */}
                {(quickType === 'note' || quickType === 'url') && (
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">
                      {quickType === 'note' ? 'Full text content (optional)' : 'Destination URL Link'}
                    </label>
                    <textarea
                      value={quickContent}
                      onChange={(e) => setQuickContent(e.target.value)}
                      placeholder={quickType === 'note' ? 'Write everything important ...' : 'https://example.com'}
                      className="w-full bg-zinc-900 border border-zinc-900 focus:border-indigo-550/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none h-20 resize-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Associated Collection</label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-900 focus:border-indigo-505/50 rounded-xl px-4 py-2 text-xs text-white outline-none"
                    >
                      <option value="Startup Ideas">Startup Ideas</option>
                      <option value="Business Research">Business Research</option>
                      <option value="Learning">Learning</option>
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1">Tags (comma split)</label>
                    <input
                      type="text"
                      value={quickTags}
                      onChange={(e) => setQuickTags(e.target.value)}
                      placeholder="saas, design, build"
                      className="w-full bg-zinc-900 border border-zinc-900 focus:border-indigo-505/50 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-900/80">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(false)}
                    className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl text-white shadow-lg shadow-indigo-600/10"
                  >
                    Confirm Capture
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
