import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Brain, CheckCircle2, ChevronRight, 
  Files, Plus, TrendingUp, Upload, FileText, 
  Check, Play, ArrowRight, Star, Compass, Command, Search, Pocket
} from 'lucide-react';
import { Note, Reminder, Document, AIInsight, UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
  notes: Note[];
  reminders: Reminder[];
  documents: Document[];
  insights: AIInsight[];
  onAddNote: () => void;
  onAddReminder: () => void;
  onToggleReminder: (id: string) => void;
  onSelectNote: (note: Note) => void;
  onSelectTab: (tab: string) => void;
  onTriggerSearch: () => void;
}

export default function DashboardView({
  user,
  notes,
  reminders,
  documents,
  insights,
  onAddNote,
  onAddReminder,
  onToggleReminder,
  onSelectNote,
  onSelectTab,
  onTriggerSearch
}: DashboardProps) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Dynamic greeting based on current local time
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  // Calculate stats
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter(r => r.completed).length;
  const activeReminders = reminders.filter(r => !r.completed);

  // Take high priority, pending reminders for "Today's Agenda"
  const pendingHighPriority = activeReminders
    .sort((a, b) => {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    })
    .slice(0, 3);

  // Selected document info for deep extraction detail
  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  // Simulated doc upload
  const handleSimulatedUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev !== null && prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1200);
          return 100;
        }
        return (prev || 0) + 20;
      });
    }, 150);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER GREETINGS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#6366f1] font-semibold">Personal Operating System</span>
          <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight mt-1 text-white flex items-center gap-2">
            {greeting}, {user.name.split(' ')[0]} <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-light">
            Operating at peak clarity. Nexa has parsed your second brain activity logs.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Nexa Core Online</span>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Fast Triggers</span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onAddNote}
            className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            Create Note
          </button>
          <button
            type="button"
            onClick={onAddReminder}
            className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-805 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-indigo-400" />
            Add Reminder
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('hub')}
            className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-805 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Pocket className="h-3.5 w-3.5 text-purple-400" />
            Universal Capture
          </button>
          <button
            type="button"
            onClick={onTriggerSearch}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-505 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Search className="h-3.5 w-3.5" />
            Spotlight (⌘K)
          </button>
        </div>
      </div>

      {/* BEGINNER QUICK START & INSTALL GUIDE */}
      <div className="bg-[#0b0c10] border-2 border-indigo-950/40 rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_25px_rgba(99,102,241,0.02)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/10 shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
                Nexa Beginner's Quick-Start Guide (Aasan Rahnumai)
              </h3>
              <p className="text-[11px] text-zinc-400 font-light mt-0.5 font-sans">
                App ko download karne, offline save karne aur behtareen tareeqay se chalane ka aasan tarika.
              </p>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-950/30 text-emerald-400 font-mono border border-emerald-900/40 px-2.5 py-1 rounded-full uppercase self-start sm:self-auto font-semibold">User Friendly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs mt-2 font-sans">
          {/* Section 1: Guide */}
          <div className="space-y-3.5 bg-zinc-950/40 border border-zinc-900/60 p-4 rounded-xl">
            <h4 className="font-bold text-indigo-300 flex items-center gap-2 text-xs">
              <span className="h-5 w-5 bg-indigo-500/15 text-indigo-400 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold">1</span>
              Nexa Ko Kaise Istemaal Karein?
            </h4>
            <ul className="space-y-2.5 text-zinc-300 font-light">
              <li className="flex gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <div>
                  <strong className="text-zinc-200">Notes Likhein (📝):</strong> 
                  <span className="text-zinc-400 ml-1">Notes Screen par jaakar apnay ahem ideas aur drafts save karein.</span>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <div>
                  <strong className="text-zinc-200">Files Upload Karein (📄):</strong> 
                  <span className="text-zinc-400 ml-1">Documents section mai apna PDF upload karein, AI isko khud parse karkay summary bana dega.</span>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <div>
                  <strong className="text-zinc-200">AI Brain se Baat Karein (🧠):</strong> 
                  <span className="text-zinc-400 ml-1">AI Brain Assistant se kisi bh sawal poochen (Jaise: "Pakistan mai kitni province hai" ya "mera aakhri document kahan hai"). Yeh Roman Urdu mai dosti ke sath sahi jawab dega!</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Section 2: Download PWA */}
          <div className="space-y-3.5 bg-zinc-950/40 border border-zinc-900/60 p-4 rounded-xl">
            <h4 className="font-bold text-indigo-300 flex items-center gap-2 text-xs font-sans">
              <span className="h-5 w-5 bg-indigo-500/15 text-indigo-400 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold">2</span>
              Mobile / Laptop par Download karne ka Tareeqah (PWA)
            </h4>
            <div className="space-y-2.5 text-zinc-300 font-light font-sans">
              <div className="flex gap-2">
                <span className="text-indigo-400 mt-0.5">📱</span>
                <div>
                  <strong className="text-zinc-200">Mobile par Kaise Save Karein:</strong>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Browser (Chrome/Safari) ke corner par triple dot option ya "Share" par click karein aur <strong className="text-zinc-300">"Add to Home Screen"</strong> select karein. Icon desktop par aa jaye ga!
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400 mt-0.5">💻</span>
                <div>
                  <strong className="text-zinc-200">Desktop / Laptop par App Install:</strong>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Chrome browser ki top bar mai URL ke sath mojud <strong className="text-zinc-300">"Install" / desktop icon</strong> par click karein taake Nexa ek native app ki tarah save ho sakay.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-400 mt-0.5">🛡️</span>
                <div>
                  <strong className="text-zinc-200">Offline aur Secure Access:</strong>
                  <span className="text-zinc-400 ml-1">Yeh app behtareen speed ke liye local state encryption aur server synchronization protect karti hai.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD TOP CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Summary Card */}
        <div className="lg:col-span-2 bg-[#0c0c0f] border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-400 font-semibold flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5" /> Proactive Intelligence Summary
            </span>
            <span className="text-zinc-500 text-xs font-mono select-none">UTC Clock</span>
          </div>

          <p className="text-base text-zinc-100 leading-relaxed font-light font-sans">
            You completed <strong className="font-semibold text-white">{completedReminders} operations</strong>. Your personal second brain output stands at <strong className="font-semibold text-teal-400 font-mono">{user.productivityScore}%</strong>. Nexa AI auto-categorized 2 files under learning collections, and drafted a series briefing action for your pitch note.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-900/80">
            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-medium font-mono uppercase">CHECKLIST REMINDERS</span>
              <span className="text-xl font-bold font-mono text-zinc-100 mt-1">{activeReminders.length}</span>
            </div>
            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-medium font-mono uppercase">MEMORIES & DRAFTS</span>
              <span className="text-xl font-bold font-mono text-zinc-100 mt-1">{notes.length}</span>
            </div>
            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-medium font-mono uppercase">INGESTED CONTRACTS</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1">{documents.length}</span>
            </div>
          </div>
        </div>

        {/* Agency Score Gauge */}
        <div className="bg-[#0c0c0f] border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#14b8a6] uppercase font-semibold">Integrity Index</span>
              <h3 className="text-base font-bold text-zinc-150 mt-1">Cognitive Output</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/10 rounded font-bold font-mono tracking-wide">+8%</span>
          </div>

          <div className="flex items-center justify-center py-4 relative">
            <div className="h-28 w-28 rounded-full border-4 border-zinc-900 flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.03)]">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{user.productivityScore}%</span>
                <span className="text-[9px] block text-zinc-500 uppercase font-mono mt-0.5 font-semibold">ELITE SYSTEM</span>
              </div>
            </div>
            <span className="absolute top-2 right-12 h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>

          <div className="text-xs text-zinc-400 text-center font-light">
            Calculated by tracking capture intensity, active summaries, and item compliance.
          </div>
        </div>

      </div>

      {/* DETAILED CONTENT COLUMNS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Column 1: Agenda, Action items, Notes shortcuts (8 cols) */}
        <div className="xl:col-span-7 space-y-6">

          {/* Agenda & Reminders checklist */}
          <div className="bg-[#0c0c0f] border border-zinc-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-400" /> High-Priority Goals
              </span>
              <button
                type="button"
                id="dash-add-reminder"
                onClick={onAddReminder}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> New Goal
              </button>
            </div>

            {pendingHighPriority.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-zinc-900 rounded-xl">
                <p className="text-sm text-zinc-550">No pending goals mapped today.</p>
                <button
                  type="button"
                  id="dash-add-rem-empty"
                  onClick={onAddReminder}
                  className="mt-3 inline-flex items-center gap-1 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-805"
                >
                  Create Goal
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingHighPriority.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-zinc-950/70 border border-zinc-900/80 rounded-xl flex items-center justify-between transition-all hover:bg-zinc-950/100"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        id={`dash-complete-${item.id}`}
                        onClick={() => onToggleReminder(item.id)}
                        className="h-5 w-5 rounded-md border border-zinc-800 hover:border-[#6366f1] hover:bg-indigo-600/5 transition-all text-zinc-650 flex items-center justify-center cursor-pointer"
                      >
                        {item.completed && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                      </button>
                      <span className={`text-xs ${item.completed ? 'line-through text-zinc-650' : 'text-zinc-200 font-medium'}`}>
                        {item.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono">{item.dueDate}</span>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                        item.priority === 'high' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/10' 
                          : item.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                            : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights panel */}
          <div className="bg-[#0c0c0f] border border-zinc-900 rounded-2xl p-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6366f1] font-bold block mb-4">Autonomous Recommendations</span>
            <div className="space-y-4">
              {insights.map(insight => (
                <div 
                  key={insight.id}
                  className="p-4 bg-zinc-950/40 border border-zinc-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs font-bold text-zinc-150 flex items-center gap-1.5 leading-none">
                      <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> {insight.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1.5 font-light leading-relaxed max-w-lg">
                      {insight.description}
                    </p>
                  </div>
                  {insight.actionLabel && (
                    <button
                      type="button"
                      id={`dash-insight-${insight.id}`}
                      onClick={() => {
                        const matchingNote = notes.find(n => n.title.toLowerCase().includes('seed') || n.title.toLowerCase().includes('legal'));
                        if (matchingNote) {
                          onSelectNote(matchingNote);
                          onSelectTab('notes');
                        } else if (notes[0]) {
                          onSelectNote(notes[0]);
                          onSelectTab('notes');
                        } else {
                          onAddNote();
                          onSelectTab('notes');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-80 w-auto self-start sm:self-auto rounded-lg font-mono text-[10px] uppercase font-semibold text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="h-3 w-3 text-indigo-400" /> {insight.actionLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Core Recent Pinned Notes Section */}
          <div className="bg-[#0c0c0f] border border-zinc-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" /> Recent Digital Outlines
              </span>
              <button
                type="button"
                id="dash-add-note"
                onClick={onAddNote}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> New Outline
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-zinc-900 rounded-xl">
                <p className="text-sm text-zinc-550">Memory store is dry. Create your first note.</p>
                <button
                  type="button"
                  id="dash-add-note-empty"
                  onClick={onAddNote}
                  className="mt-3 inline-flex items-center gap-1 text-xs bg-zinc-900 border border-zinc-800 text-zinc-305 font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-805"
                >
                  Write Outline
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.slice(0, 4).map(note => (
                  <div
                    key={note.id}
                    onClick={() => {
                      onSelectNote(note);
                      onSelectTab('notes');
                    }}
                    className="p-4 bg-zinc-950/45 hover:bg-zinc-950/90 border border-zinc-900/80 hover:border-zinc-800 rounded-xl cursor-pointer transition-all group flex flex-col justify-between min-h-[110px]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-150 group-hover:text-white truncate font-sans">
                          {note.title || 'Untitled Note'}
                        </h4>
                        {note.isPinned && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500/10 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {note.content || 'No content...'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900/60 text-[9px] text-zinc-500">
                      <span className="font-mono">{note.updatedAt}</span>
                      <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-805 rounded text-zinc-400 font-mono">
                        {note.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Column 2: Document Extractor Dashboard (5 cols) */}
        <div className="xl:col-span-5">
          <div className="bg-[#0c0c0f] border border-zinc-900 rounded-2xl p-6 h-full flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-900/80 pb-3 mb-4">
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                  <Files className="h-5 w-5 text-indigo-400" /> Ingested Docs
                </span>
                
                {/* Upload button */}
                <button
                  type="button"
                  id="dashboard-upload-trigger"
                  onClick={handleSimulatedUpload}
                  className="bg-indigo-600 hover:bg-indigo-505 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </button>
              </div>

              {/* Upload dynamic progress loader */}
              {uploadProgress !== null && (
                <div className="bg-zinc-950/80 border border-zinc-900 p-3 rounded-lg mb-4 text-xs">
                  <div className="flex justify-between font-medium text-zinc-200 mb-1">
                    <span>Extracting PDF metadata & vectors...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${uploadProgress}%` }} className="bg-indigo-505 h-full transition-all" />
                  </div>
                </div>
              )}

              {/* Doc Selection List */}
              <div className="space-y-1.5">
                {documents.map(doc => {
                  const isActive = doc.id === (selectedDocId || documents[0]?.id);
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      id={`doc-btn-${doc.id}`}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                        isActive 
                          ? 'bg-zinc-950 border-indigo-500/20 shadow-[0_4px_25px_rgba(99,102,241,0.02)]' 
                          : 'bg-zinc-950/30 border-zinc-900 hover:bg-zinc-950/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-[#6366f1]/10 text-indigo-405' : 'bg-zinc-905 text-zinc-500'
                        }`}>
                          <Files className="h-4.5 w-4.5" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-semibold text-zinc-150 truncate font-sans">{doc.name}</h4>
                          <span className="text-[9px] text-zinc-500 block font-mono mt-0.5">{doc.type} &bull; {doc.size}</span>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-zinc-650 transition-transform ${isActive ? 'rotate-90 text-indigo-400' : ''}`} />
                    </button>
                  );
                })}
              </div>

              {/* Extracted Insight card */}
              {activeDoc && (
                <motion.div 
                  key={activeDoc.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-zinc-950/70 border border-zinc-900/80 p-5 rounded-2xl relative"
                >
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-405 font-medium">Auto Highlights</span>
                    <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded">PDF EXTRACT</span>
                  </div>
                  <h5 className="text-xs font-bold text-zinc-200 mb-1">{activeDoc.name}</h5>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light mt-2 bg-[#09090C] border border-[#14141d]/85 p-3 rounded-xl whitespace-pre-wrap">
                    {activeDoc.parsedInsights}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Integrity: {activeDoc.isVerified ? 'Verified' : 'Pending'}</span>
                    <span>{activeDoc.dateAdded}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick action insight */}
            <div className="bg-[#121215] border border-zinc-900 rounded-xl p-4 flex gap-3 text-xs">
              <span className="text-indigo-400 text-base flex-shrink-0 font-bold font-mono">🔮</span>
              <p className="text-zinc-400 font-light leading-relaxed">
                Nexa automatically parses multi-page draft PDF materials and maps action items instantly into your Today Goals checklists.
              </p>
            </div>
          </div>
        </div>

       </div>

    </div>
  );
}
