import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Plus, Trash2, Check, Calendar, 
  Flag, Filter, Sparkles, X, Clock 
} from 'lucide-react';
import { Reminder } from '../types';

interface RemindersViewProps {
  reminders: Reminder[];
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

const PRIORITIES = ['all', 'high', 'medium', 'low'];
const CATEGORIES = ['All', 'Personal', 'Work', 'Finance', 'General', 'Legal'];

export default function RemindersView({
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder
}: RemindersViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Addition Form inputs
  const [newText, setNewText] = useState<string>('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('General');
  
  const [formOpen, setFormOpen] = useState<boolean>(false);

  // Set default due date as tomorrow
  useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    setNewDueDate(dateString);
  });

  // Filter computation
  const filteredReminders = useMemo(() => {
    return reminders.filter(item => {
      const matchTab = activeTab === 'all' 
        ? true 
        : activeTab === 'active' 
          ? !item.completed 
          : item.completed;
          
      const matchPriority = priorityFilter === 'all' 
        ? true 
        : item.priority === priorityFilter;

      const matchCategory = categoryFilter === 'All'
        ? true
        : item.category === categoryFilter;

      return matchTab && matchPriority && matchCategory;
    });
  }, [reminders, activeTab, priorityFilter, categoryFilter]);

  // Statistics
  const stats = useMemo(() => {
    const active = reminders.filter(r => !r.completed);
    const high = active.filter(r => r.priority === 'high').length;
    const medium = active.filter(r => r.priority === 'medium').length;
    const low = active.filter(r => r.priority === 'low').length;
    return { high, medium, low, total: reminders.length };
  }, [reminders]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddReminder({
      text: newText,
      priority: newPriority,
      dueDate: newDueDate,
      category: newCategory
    });

    setNewText('');
    setFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6366f1] font-bold">Chronos Scheduler</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-400" /> Reminders System
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Auto-escalated notifications based on contextual daily parameters.
          </p>
        </div>

        {/* Create Reminder button */}
        <button
          type="button"
          id="reminders-add-btn-trigger"
          onClick={() => setFormOpen(!formOpen)}
          className="bg-indigo-600 hover:bg-indigo-505 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
        >
          {formOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{formOpen ? 'Close Composer' : 'Add Reminder Action'}</span>
        </button>
      </div>

      {/* QUICK COMPOSER PANEL */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#0c0c0f] border border-[#6366f1]/20 p-6 rounded-2xl shadow-xl max-w-2xl"
          >
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-yellow-405" /> Compose New Action reminder
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reminder-text" className="block text-[10px] uppercase font-mono text-zinc-500 mb-1.5">What is the action item?</label>
                <input
                  type="text"
                  id="reminder-text"
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g., Deliver tax draft details to advisors"
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-505/40 text-xs rounded-xl px-4 py-3 text-zinc-250 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Due Date */}
                <div>
                  <label htmlFor="reminder-due-date" className="block text-[10px] uppercase font-mono text-zinc-500 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    id="reminder-due-date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-505/40 text-xs rounded-xl px-4 py-3 text-zinc-250 font-mono focus:outline-none focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Priority Selection */}
                <div>
                  <label htmlFor="reminder-priority" className="block text-[10px] uppercase font-mono text-zinc-500 mb-1.5">Priority</label>
                  <select
                    id="reminder-priority"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-550/40 text-xs rounded-xl px-4 py-3 text-zinc-250 focus:outline-none cursor-pointer"
                  >
                    <option value="high">🔥 High</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="low">⚙️ Low</option>
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor="reminder-category" className="block text-[10px] uppercase font-mono text-zinc-500 mb-1.5">Category</label>
                  <select
                    id="reminder-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-550/40 text-xs rounded-xl px-4 py-3 text-zinc-250 focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  id="reminder-submit-btn"
                  className="bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  Schedule Trigger
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIMARY REMINDERS INTERFACE: STAT CHIPS AND FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* STAT CHIP BOX (1 col) */}
        <div className="space-y-4">
          <div className="bg-[#0c0c0f] border border-zinc-905 p-5 rounded-2.5xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6366f1] font-bold block">Status Index</span>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-955/20 border border-zinc-900/60 rounded-xl text-xs">
                <span className="flex items-center gap-2 text-red-405 font-medium">
                  <Flag className="h-3.5 w-3.5" /> High Urgency
                </span>
                <span className="font-mono text-zinc-300 font-bold">{stats.high} pending</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-955/20 border border-zinc-900/60 rounded-xl text-xs">
                <span className="flex items-center gap-2 text-amber-405 font-medium">
                  <Flag className="h-3.5 w-3.5" /> Medium Urgency
                </span>
                <span className="font-mono text-zinc-300 font-bold">{stats.medium} pending</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-955/20 border border-zinc-900/60 rounded-xl text-xs">
                <span className="flex items-center gap-2 text-zinc-400 font-medium">
                  <Flag className="h-3.5 w-3.5" /> Low Urgency
                </span>
                <span className="font-mono text-zinc-300 font-bold">{stats.low} pending</span>
              </div>
            </div>
          </div>

          <div className="bg-[#121215] border border-zinc-900 rounded-2xl p-4 flex gap-3 text-xs">
            <span className="text-base text-teal-400">🛡️</span>
            <p className="text-zinc-400 font-light leading-relaxed">
              Items are filtered, color classified & auto-indexed by priorities so you stay structured.
            </p>
          </div>
        </div>

        {/* INTERACTIVE REMINDERS DIRECTORY list (3 cols) */}
        <div className="lg:col-span-3 bg-[#0c0c0f] border border-zinc-900 rounded-2.5xl p-5 flex flex-col justify-between overflow-hidden">
          
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900/80 pb-4">
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'active', label: 'Active' },
                  { id: 'completed', label: 'Completed' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    id={`rem-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-indigo-600/10 text-indigo-300 border-indigo-505/20 shadow-sm'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-450 hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Advanced multi dropdown selectors filters */}
              <div className="flex items-center gap-2">
                {/* Priority Selection */}
                <span className="text-[10px] text-zinc-550 flex items-center gap-1"><Filter className="h-3 w-3" /> filter:</span>
                
                <select
                  id="reminder-list-priority-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 text-[10px] font-semibold text-zinc-400 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="all">Priority: All</option>
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>

                <select
                  id="reminder-list-category-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 text-[10px] font-semibold text-zinc-400 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="All">Category: All</option>
                  {CATEGORIES.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* List */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredReminders.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-zinc-605 text-lg mb-2">🔔</span>
                  <p className="text-xs text-zinc-500 font-light">No action reminders found match criteria.</p>
                </div>
              ) : (
                filteredReminders.map(rem => (
                  <div
                    key={rem.id}
                    className="p-4 bg-zinc-955/40 border border-zinc-900/60 rounded-xl flex items-center justify-between gap-4 hover:bg-zinc-955/90 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        id={`rem-checkbox-${rem.id}`}
                        onClick={() => onToggleReminder(rem.id)}
                        className={`h-5 w-5 rounded-md border text-zinc-650 flex items-center justify-center hover:border-indigo-400 transition-all cursor-pointer ${
                          rem.completed 
                            ? 'bg-indigo-600/15 border-indigo-505/20 text-indigo-400' 
                            : 'bg-zinc-950 border-zinc-900'
                        }`}
                      >
                        {rem.completed && <Check className="h-3.5 w-3.5" />}
                      </button>
                      <div className="min-w-0">
                        <span className={`text-xs block truncate ${
                          rem.completed ? 'line-through text-zinc-550' : 'text-zinc-200 font-medium'
                        }`}>
                          {rem.text}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] text-zinc-500">
                          <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> Due {rem.dueDate}</span>
                          &bull;
                          <span className="px-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-sans tracking-tight">{rem.category || 'General'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ${
                        rem.priority === 'high'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/10'
                          : rem.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                            : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {rem.priority}
                      </span>
                      <button
                        type="button"
                        id={`rem-del-btn-${rem.id}`}
                        onClick={() => onDeleteReminder(rem.id)}
                        className="p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 roundedtransition-colors opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete reminder"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
