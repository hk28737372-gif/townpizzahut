import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Brain, Zap, Files, CheckCircle2, 
  ArrowRight, Shield, Activity, ChevronDown, 
  Layers, Lock, Globe, Calendar, Check, ArrowLeft,
  Clock, Search, Bookmark, FileText, Landmark, Users, HelpCircle
} from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  key?: any;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-900 py-4">
      <button
        type="button"
        id={`faq-${question.replace(/\s+/g, '-').toLowerCase()}`}
        className="flex w-full items-center justify-between text-left font-medium text-zinc-100 hover:text-white transition-colors py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base sm:text-lg">{question}</span>
        <ChevronDown 
          className={`h-5 w-5 text-zinc-400 transition-transform duration-350 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 pt-1 text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface LandingPageProps {
  onLaunchApp: () => void;
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [activePage, setActivePage] = useState<'home' | 'features' | 'benefits' | 'pricing' | 'faq'>('home');
  const [isAnnual, setIsAnnual] = useState(true);

  // Features Page Interactive Sandbox state
  const [currSandboxTab, setCurrSandboxTab] = useState<'notes' | 'reminders' | 'links' | 'docs' | 'ai'>('notes');

  // Benefits Page Savior Tracker inputs
  const [dailyNotesCount, setDailyNotesCount] = useState<number>(5);
  const [dailyRemindersCount, setDailyRemindersCount] = useState<number>(4);
  const [dailySearchMinutes, setDailySearchMinutes] = useState<number>(20);

  // Pricing Page Team Licences seats slider
  const [seatCount, setSeatCount] = useState<number>(5);

  // FAQ search text
  const [faqSearch, setFaqSearch] = useState<string>('');

  const faqData = [
    {
      question: "What is a personal digital operating system?",
      answer: "Nexa OS is more than just a note-taking application; it is a unified digital second brain. By consolidating notes, reminders, files, intellectual links, and an autonomous AI assistant, it eliminates the need to jump between separate disjointed apps."
    },
    {
      question: "Can I log in using Google and retrieve my data?",
      answer: "Yes, absolutely! Nexa includes high-fidelity Google Authentication integration. Simply click 'Sign In with Google', select your Gmail account, and Nexa will restore your operators dashboard, notes history, activity logs, and personal collections instantly."
    },
    {
      question: "How secure is Nexa with my private PDFs and documents?",
      answer: "We support industry-standard zero-knowledge file structure encryption parameters. Your notes, books, CVs, startup pitch decks, and receipts are bound directly to your authenticated user ID and served securely."
    },
    {
      question: "How does the AI assistant help organize my memory?",
      answer: "Instead of staring at a blank chatbot, the Nexa Assistant is closely coupled with your context. You can command it to search across startup notes, analyze newly uploaded contracts, synthesize upcoming weekly reminders, or format professional drafts with a single command."
    },
    {
      question: "Is there an interactive companion browser extension planned?",
      answer: "Yes, Phase 2 features include a native Chrome / Firefox browser extension for instant bookmark captures, visual page screenshot snapshots, and a global command bar accessible from any viewport."
    }
  ];

  const filteredFaqs = faqData.filter(
    faq => faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
           faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Time Savin estimation algorithm (minutes saved/week)
  const calcMinutesSavedPerWeek = () => {
    // each daily note save saves 3 mins of cataloging
    // each daily reminder saves 4 mins of scheduling
    // search minutes represents daily waste that Nexa reduces to 1 min.
    const dailySaving = (dailyNotesCount * 3) + (dailyRemindersCount * 4) + (dailySearchMinutes - 1);
    return Math.round((dailySaving * 7) / 60 * 10) / 10;
  };

  const calculateLicensePrice = () => {
    const baseCost = isAnnual ? 16 : 20;
    const rawCost = seatCount * baseCost;
    // Apply bulk volume discount above 10 seats
    const finalCost = seatCount >= 10 ? rawCost * 0.9 : rawCost;
    return Math.round(finalCost);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 selection:bg-indigo-500/30 overflow-x-hidden font-sans antialiased">
      
      {/* Dynamic Ambient Background Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none opacity-40 z-0" />
      <div className="absolute top-[800px] left-10 w-[400px] h-[400px] bg-teal-505/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[1800px] right-10 w-[500px] h-[500px] bg-indigo-505/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* FIXED NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070709]/75 backdrop-blur-xl border-b border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 text-left outline-none group"
          >
            <div className="h-9.5 w-9.5 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
                Nexa<span className="text-indigo-400 text-xs font-semibold ml-1 bg-indigo-950/40 border border-indigo-900 px-1.5 py-0.5 rounded-md">OS</span>
              </span>
              <span className="text-[9px] text-zinc-550 tracking-widest font-mono uppercase">Mind Control Center</span>
            </div>
          </button>

          {/* Page Directory Actions */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950/60 p-1 border border-zinc-900 rounded-xl">
            <button
              onClick={() => setActivePage('home')}
              className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-all ${
                activePage === 'home' ? 'bg-zinc-900 text-indigo-400 border border-zinc-805' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActivePage('features')}
              className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-all ${
                activePage === 'features' ? 'bg-zinc-900 text-indigo-400 border border-zinc-805' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActivePage('benefits')}
              className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-all ${
                activePage === 'benefits' ? 'bg-zinc-900 text-indigo-400 border border-zinc-805' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Benefits
            </button>
            <button
              onClick={() => setActivePage('pricing')}
              className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-all ${
                activePage === 'pricing' ? 'bg-zinc-900 text-indigo-400 border border-zinc-805' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setActivePage('faq')}
              className={`px-4 py-2 text-xs font-medium rounded-lg cursor-pointer transition-all ${
                activePage === 'faq' ? 'bg-zinc-900 text-indigo-400 border border-zinc-805' : 'text-zinc-400 hover:text-white'
              }`}
            >
              FAQ
            </button>
          </nav>

          <button
            type="button"
            id="header-btn-launch"
            onClick={onLaunchApp}
            className="relative inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold py-2.5 px-4.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
          >
            Launch Platform
            <ArrowRight className="h-3.5 w-3.5 text-zinc-950" />
          </button>
        </div>
      </header>

      {/* MAIN VIEW CONTROLLER */}
      <main className="relative z-10 pt-28">
        <AnimatePresence mode="wait">
          
          {/* ==================== SCREEN 1: HOME ==================== */}
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
              {/* BRAND PROMO HEADER */}
              <div className="text-center pt-10 sm:pt-16 pb-16">
                <div className="inline-flex items-center gap-2 bg-indigo-950/40 border border-indigo-805 px-3 py-1.5 rounded-full text-[11px] font-semibold text-indigo-350 mb-6 font-mono tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Tumhari poori digital zindagi ka control center
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7.5xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
                  Everything Important <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-indigo-200 bg-clip-text text-transparent">
                    In One Secure Place
                  </span>
                </h1>

                <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2.5xl mx-auto font-light leading-relaxed">
                  Stop managing disjointed apps for files, tasks, reminders, and notes. Nexa OS threads them beautifully together with a secure, proactive AI second brain.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={onLaunchApp}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:opacity-95 shadow-xl shadow-indigo-600/10 text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Enter My Workspace for Free
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePage('features')}
                    className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-900 text-zinc-200 border border-zinc-900 font-bold py-3.5 px-8 rounded-xl transition-all text-sm inline-flex items-center justify-center cursor-pointer"
                  >
                    Explore Features Catalog
                  </button>
                </div>

                <div className="mt-6 text-xs text-zinc-550 flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-indigo-400/80" /> Auto-Mapped Cloud Backup</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-800" />
                  <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-teal-400/80" /> One-Click Google Recovery</span>
                </div>
              </div>

              {/* DYNAMIC APP PREVIEW MODULE */}
              <div className="relative max-w-5.5xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/20 p-4 shadow-3xl backdrop-blur-2xl mb-24">
                <div className="absolute top-4 left-5 flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-6 flex items-center justify-center text-zinc-650 text-[10px] font-mono tracking-widest uppercase">
                  nexa.os / user-brain-node
                </div>

                <div className="mt-4 bg-[#08080a] rounded-2xl border border-zinc-900 overflow-hidden text-left grid grid-cols-12 min-h-[440px]">
                  {/* Left Sidebar Layout */}
                  <div className="hidden md:block col-span-3 border-r border-zinc-900 p-4 bg-zinc-950/20">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs border border-indigo-500/20">
                        NX
                      </div>
                      <span className="text-xs font-semibold text-zinc-300">Nexa Universe</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-6 bg-zinc-900 text-indigo-400 rounded px-2.5 flex items-center gap-1.5 text-[10px] uppercase font-bold"><Activity className="h-3.5 w-3.5" /> Dashboard</div>
                        <div className="h-6 text-zinc-500 rounded px-2.5 flex items-center gap-1.5 text-[10px] font-mono"><Files className="h-3.5 w-3.5" /> Knowledge Hub</div>
                        <div className="h-6 text-zinc-500 rounded px-2.5 flex items-center gap-1.5 text-[10px] font-mono"><Calendar className="h-3.5 w-3.5" /> Reminders</div>
                      </div>
                      <div className="pt-24">
                        <div className="bg-[#0e0e12] border border-zinc-900 rounded-xl p-3">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">AI Assistant <Sparkles className="h-2.5 w-2.5 text-yellow-500" /></span>
                          <p className="text-[10px] text-zinc-500 mt-1.5 leading-normal">"Welcome! I am ready to summarize your startup ideas or catalog bills."</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Work Area Layout */}
                  <div className="col-span-12 md:col-span-9 p-4 sm:p-6.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest">Active Neural Session</span>
                          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2 mt-0.5">Welcome Back, Operator <Sparkles className="h-4 w-4 text-amber-500" /></h3>
                        </div>
                        <button onClick={onLaunchApp} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-lg font-mono">
                          Launch Live OS
                        </button>
                      </div>

                      {/* Overviews */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#0f0f13] border border-zinc-900 rounded-xl p-4">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                            <Brain className="h-3.5 w-3.5" /> Global Summary
                          </span>
                          <h4 className="mt-2 text-xs font-semibold text-zinc-200">Everything is in alignment</h4>
                          <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
                            You have saved 15 business ideas, 4 essential PDFs, and have 3 alerts scheduled for tomorrow.
                          </p>
                        </div>

                        <div className="bg-[#0f0f13] border border-zinc-900 rounded-xl p-4 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest block">Cognitive Productivity</span>
                            <div className="flex items-baseline gap-1.5 mt-2">
                              <span className="text-xl font-bold font-mono">96%</span>
                              <span className="text-[10px] text-teal-400 font-medium">Optimal Status</span>
                            </div>
                          </div>
                          <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-3">
                            <div className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full w-[96%]" />
                          </div>
                        </div>
                      </div>

                      {/* Recent Elements */}
                      <div className="mt-6">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block mb-2.5">Your Unified Memory Vault</span>
                        <div className="space-y-2">
                          <div className="bg-[#0c0c10] border border-zinc-900/60 rounded-xl p-3 flex items-center justify-between text-xs transition-all hover:border-zinc-800">
                            <div className="flex items-center gap-2">
                              <div className="h-5.5 w-5.5 bg-red-500/10 rounded flex items-center justify-center text-red-400 text-[10px] font-bold">📄</div>
                              <span className="text-zinc-300 font-medium truncate max-w-sm">Burger Shop Startup Idea & Cost Matrix</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">Notes</span>
                          </div>
                          <div className="bg-[#0c0c10] border border-zinc-900/60 rounded-xl p-3 flex items-center justify-between text-xs transition-all hover:border-zinc-800">
                            <div className="flex items-center gap-2">
                              <div className="h-5.5 w-5.5 bg-yellow-500/10 rounded flex items-center justify-center text-yellow-400 text-[10px] font-bold">⏰</div>
                              <span className="text-zinc-300 font-medium truncate max-w-sm">Pay SaaS & cloud hosting server bills</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">Reminders</span>
                          </div>
                          <div className="bg-[#0c0c10] border border-zinc-900/60 rounded-xl p-3 flex items-center justify-between text-xs transition-all hover:border-zinc-800">
                            <div className="flex items-center gap-2">
                              <div className="h-5.5 w-5.5 bg-blue-500/10 rounded flex items-center justify-center text-blue-400 text-[10px] font-bold">🌐</div>
                              <span className="text-zinc-300 font-medium truncate max-w-sm">https://github.com/nexa-os/core</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">Links</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-end gap-3">
                      <button onClick={() => setActivePage('features')} className="text-[11px] text-indigo-400 hover:text-white font-medium transition-colors cursor-pointer">
                        View Interactive Sandbox →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE QUICK PILLAR TEASERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-5xl mx-auto">
                <div onClick={() => setActivePage('features')} className="bg-[#09090c] border border-zinc-900 rounded-2xl p-6.5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <div className="h-10 w-10 bg-indigo-550/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-all">
                    <Brain className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">1. Memory Capture</h3>
                  <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                    Notes, tasks, code repositories, screenshots, and complex raw drafts are filed instantly under an intelligent directory.
                  </p>
                </div>

                <div onClick={() => setActivePage('benefits')} className="bg-[#09090c] border border-zinc-900 rounded-2xl p-6.5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <div className="h-10 w-10 bg-teal-550/10 rounded-xl flex items-center justify-center text-teal-400 mb-4 group-hover:scale-105 transition-all">
                    <Zap className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">2. Smart Scheduling</h3>
                  <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                    Proactive triggers analyze priority structures, tracking cloud subscriptions, homework targets, and startup milestones contextually.
                  </p>
                </div>

                <div onClick={() => setActivePage('faq')} className="bg-[#09090c] border border-zinc-900 rounded-2xl p-6.5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <div className="h-10 w-10 bg-indigo-550/10 rounded-xl flex items-center justify-center text-indigo-300 mb-4 group-hover:scale-105 transition-all">
                    <Sparkles className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">3. Integrated AI</h3>
                  <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                    Query your entire stored digital universe instantly. Say farewell to losing track of links, ideas, and contracts forever.
                  </p>
                </div>
              </div>

              {/* QUICK SIGNUP CONVINCER CTA */}
              <div className="bg-gradient-to-r from-zinc-950 to-[#0e0e12] border border-zinc-900 rounded-2.5xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Need seamless cross-device syncing?</h3>
                  <p className="text-xs text-zinc-400 mt-1 font-light">Sign in secure with your Google account to restore and persist databases instantly.</p>
                </div>
                <button
                  onClick={onLaunchApp}
                  className="bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10 uppercase tracking-widest font-mono"
                >
                  Map Google ID Now
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 2: FEATURES ==================== */}
          {activePage === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
              {/* Features Hero */}
              <div className="text-center pt-10 pb-12">
                <button 
                  onClick={() => setActivePage('home')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-full mb-4"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
                </button>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono block">Ecosystem Mapping</span>
                <h1 className="text-3xl sm:text-5xl font-bold mt-2">Nexa OS Core Features</h1>
                <p className="mt-4 text-sm text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                  Five core components working in unison to eliminate digital memory loss and organize raw data.
                </p>
              </div>

              {/* INTERACTIVE COGNITIVE SIMULATOR SANDBOX */}
              <div className="bg-[#09090c] border border-zinc-900 rounded-3xl p-6 sm:p-8 max-w-4.5xl mx-auto mb-16 shadow-2xl">
                <div className="text-center sm:text-left mb-6">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Interactive Demonstration</span>
                  <h3 className="text-base font-bold text-white mt-1">Nexa Memory Simulator Sandbox</h3>
                  <p className="text-xs text-zinc-400 mt-1">Click the tabs below to preview how different items are captured and queried by the AI assistant.</p>
                </div>

                {/* Tabs selection */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-900 mb-6">
                  <button 
                    onClick={() => setCurrSandboxTab('notes')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${currSandboxTab === 'notes' ? 'bg-zinc-900 text-[#6366f1] border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    <Files className="h-3.5 w-3.5" /> Notes
                  </button>
                  <button 
                    onClick={() => setCurrSandboxTab('reminders')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${currSandboxTab === 'reminders' ? 'bg-zinc-900 text-[#6366f1] border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    <Calendar className="h-3.5 w-3.5" /> Reminders
                  </button>
                  <button 
                    onClick={() => setCurrSandboxTab('links')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${currSandboxTab === 'links' ? 'bg-zinc-900 text-[#6366f1] border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    <Bookmark className="h-3.5 w-3.5" /> Links
                  </button>
                  <button 
                    onClick={() => setCurrSandboxTab('docs')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${currSandboxTab === 'docs' ? 'bg-zinc-900 text-[#6366f1] border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    <FileText className="h-3.5 w-3.5" /> Documents
                  </button>
                  <button 
                    onClick={() => setCurrSandboxTab('ai')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${currSandboxTab === 'ai' ? 'bg-zinc-900 text-[#6366f1] border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-spin" /> AI Copilot
                  </button>
                </div>

                {/* Sub-container */}
                <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-5 min-h-[220px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    
                    {/* Sandbox: Notes */}
                    {currSandboxTab === 'notes' && (
                      <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                          <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900 px-2.5 py-0.5 rounded font-mono uppercase font-bold">1. Capture Type: Note</span>
                          <span className="text-zinc-550 text-[10px]">Title: Burger Shop Cost Matrix</span>
                        </div>
                        <div className="bg-[#0b0b0e] border border-zinc-900 p-4 rounded-xl text-xs font-mono leading-relaxed text-zinc-350">
                          "Burger shop startup idea: Gourmet food, customized menu options, locate target shop near university district. Initial licensing estimate: $2,500. Equipment budget: $12,000."
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal font-light">
                          💾 Nexa secures notes with standard offline-first states, indexing every term semantically for search retrieval.
                        </p>
                      </motion.div>
                    )}

                    {/* Sandbox: Reminders */}
                    {currSandboxTab === 'reminders' && (
                      <motion.div key="reminders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                          <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-2.5 py-0.5 rounded font-mono uppercase font-bold">2. Capture Type: Reminder</span>
                          <span className="text-zinc-550 text-[10px]">Priority: High</span>
                        </div>
                        <div className="flex items-center justify-between bg-[#0b0b0e] border border-zinc-900 p-4.5 rounded-xl">
                          <div>
                            <p className="text-xs text-zinc-200 font-bold">Renew annual server hosting subscription</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-1">Due Date: June 15, 2026</p>
                          </div>
                          <span className="text-[9px] bg-red-450/10 text-red-400 border border-red-500/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">2 Days Left</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal font-light">
                          ⏰ Proactive scheduling schedules warnings and flags so bills and assignments never pass the due date unaddressed.
                        </p>
                      </motion.div>
                    )}

                    {/* Sandbox: Links */}
                    {currSandboxTab === 'links' && (
                      <motion.div key="links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                          <span className="text-[10px] bg-[#1d3557] text-[#457b9d] border border-[#457b9d]/30 px-2.5 py-0.5 rounded font-mono uppercase font-bold">3. Capture Type: Bookmark</span>
                          <span className="text-zinc-550 text-[10px]">Category: Research</span>
                        </div>
                        <div className="bg-[#0b0b0e] border border-zinc-900 p-4 rounded-xl flex items-center justify-between">
                          <div className="truncate">
                            <span className="text-[10px] text-indigo-400 block font-mono">https://github.com/google/gemma.cpp</span>
                            <span className="text-xs text-zinc-250 font-bold truncate mt-0.5 block">Google Gemma Lightweight LLM C++ Framework</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 hover:text-white transition-colors cursor-pointer ml-3">Open Link ↗</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal font-light">
                          🌐 Universal bookmarks lets you parse repositories, YouTube videos, and research papers, keeping links bound with associated contextual notes.
                        </p>
                      </motion.div>
                    )}

                    {/* Sandbox: Docs */}
                    {currSandboxTab === 'docs' && (
                      <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-2.5 py-0.5 rounded font-mono uppercase font-bold">4. Capture Type: Document</span>
                          <span className="text-zinc-550 text-[10px]">Size: 2.1 MB</span>
                        </div>
                        <div className="bg-[#0b0b0e] border border-zinc-900 p-4 rounded-xl flex items-center gap-3">
                          <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-red-400 font-bold text-xs font-mono">PDF</div>
                          <div>
                            <p className="text-xs text-zinc-200 font-semibold">Artificial_Intelligence_Startup_Pitch_Deck.pdf</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Parsed & Organized Successfully</p>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal font-light">
                          📂Baad mein search karein: <strong className="text-indigo-400 font-mono font-normal">"Meri AI wali PDF dikhao"</strong> and Nexa's search retrieves this instantly.
                        </p>
                      </motion.div>
                    )}

                    {/* Sandbox: AI */}
                    {currSandboxTab === 'ai' && (
                      <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
                          <span className="text-[10px] bg-yellow-950 text-yellow-400 border border-yellow-900 px-2.5 py-0.5 rounded font-mono uppercase font-bold">5. Intelligent Action: Assistant</span>
                          <span className="text-zinc-550 text-[10px]">Model: Gemini OS Agent</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-right"><span className="inline-block bg-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-200">"Mere startup burger notes summarize karo"</span></div>
                          <div className="text-left"><span className="inline-block bg-indigo-950/20 text-indigo-300 border border-indigo-900/40 rounded-xl px-3.5 py-2 text-xs leading-relaxed max-w-lg">
                            "Summary of Gourmet Burger Idea: Focuses on university districts with customized menus. Key budget targets include $2,500 licensing and $12,000 cookware allocations."
                          </span></div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>

              {/* CORE BENTO FEATURES SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4.5xl mx-auto">
                <div className="bg-[#09090c] border border-zinc-900 p-6.5 rounded-2.5xl flex flex-col justify-between">
                  <div>
                    <span className="h-9 w-9 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-4 font-bold text-sm">01</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Unified Capture Layer</h3>
                    <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                      Say goodbye to context shuffling! Easily map ideas, startup concepts, homework files, bookmarks, or contracts directly under a centralized, beautiful operator dashboard.
                    </p>
                  </div>
                </div>

                <div className="bg-[#09090c] border border-zinc-900 p-6.5 rounded-2.5xl flex flex-col justify-between">
                  <div>
                    <span className="h-9 w-9 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-400 mb-4 font-bold text-sm">02</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Cognitive Score Engine</h3>
                    <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                      Monitor your daily output dynamically! Nexa tracks completed reminders, archived notes, page checks, and active logs to present a visual score showing daily attention efficiency.
                    </p>
                  </div>
                </div>

                <div className="bg-[#09090c] border border-zinc-900 p-6.5 rounded-2.5xl flex flex-col justify-between">
                  <div>
                    <span className="h-9 w-9 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 mb-4 font-bold text-sm">03</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Global Command search</h3>
                    <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                      Type 'startup' or 'homework' anywhere on your Nexa workspace to instantly locate related documents, scheduled reminders, bookmark entries, and structured folders.
                    </p>
                  </div>
                </div>

                <div className="bg-[#09090c] border border-zinc-900 p-6.5 rounded-2.5xl flex flex-col justify-between">
                  <div>
                    <span className="h-9 w-9 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-300 mb-4 font-bold text-sm">04</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">One-click Generative AI edits</h3>
                    <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                      Refactor draft content cleanly! Instantly summarize, rewrite to business correspondence prose, generate structured tasks, or double-check language formatting.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BACK */}
              <div className="mt-16 text-center">
                <button
                  onClick={onLaunchApp}
                  className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3.5 px-8 rounded-xl transition-all shadow-xl hover:shadow-indigo-505/10 text-xs uppercase tracking-widest font-mono cursor-pointer"
                >
                  Configure My OS Now
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 3: BENEFITS ==================== */}
          {activePage === 'benefits' && (
            <motion.div
              key="benefits"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
              {/* Benefits Hero */}
              <div className="text-center pt-10 pb-12">
                <button 
                  onClick={() => setActivePage('home')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-full mb-4"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
                </button>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest font-mono block">Why Nexa OS</span>
                <h1 className="text-3xl sm:text-5xl font-bold mt-2">The Proactive Difference</h1>
                <p className="mt-4 text-sm text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                  How persistent memory layers free up hours of cognitive energy every week.
                </p>
              </div>

              {/* TIME SAVIOR CALCULATOR */}
              <div className="bg-[#09090c] border border-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2.5xl mx-auto mb-16 shadow-2xl">
                <div className="text-center mb-6 border-b border-zinc-900 pb-5">
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">Savior Tracking Tool</span>
                  <h3 className="text-base font-bold text-white mt-1">Mental Energy & Time Saver Calculator</h3>
                  <p className="text-xs text-zinc-400 mt-1">Estimate how many hours you save per week letting Nexa auto-sort, schedule, and search your digital files.</p>
                </div>

                <div className="space-y-6">
                  {/* Slider 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                      <span>Daily Captured Notes/Ideas</span>
                      <span className="text-teal-400 font-mono">{dailyNotesCount} elements</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={dailyNotesCount} 
                      onChange={(e) => setDailyNotesCount(parseInt(e.target.value))}
                      className="w-full accent-teal-400 cursor-pointer h-1.5 bg-zinc-950 rounded-full" 
                    />
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                      <span>Daily Scheduled Reminders/Bills</span>
                      <span className="text-teal-400 font-mono">{dailyRemindersCount} elements</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={dailyRemindersCount} 
                      onChange={(e) => setDailyRemindersCount(parseInt(e.target.value))}
                      className="w-full accent-teal-400 cursor-pointer h-1.5 bg-zinc-950 rounded-full" 
                    />
                  </div>

                  {/* Slider 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                      <span>Daily minutes spent searching for links/PDFs</span>
                      <span className="text-teal-400 font-mono">{dailySearchMinutes} minutes</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="120" 
                      value={dailySearchMinutes} 
                      onChange={(e) => setDailySearchMinutes(parseInt(e.target.value))}
                      className="w-full accent-teal-400 cursor-pointer h-1.5 bg-zinc-950 rounded-full" 
                    />
                  </div>

                  {/* Result Panel */}
                  <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-5 text-center mt-6">
                    <span className="text-zinc-[10px] text-zinc-550 font-mono uppercase tracking-widest block">Nexa Estimator Result</span>
                    <div className="flex items-baseline justify-center gap-2 mt-2">
                      <span className="text-3xl sm:text-4.5xl font-extrabold font-mono text-white">{calcMinutesSavedPerWeek()}</span>
                      <span className="text-sm font-medium text-teal-400 font-mono">Hours Saved / Week</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2 font-light max-w-md mx-auto leading-normal">
                      By allowing Nexa to semantically index folders and contextually group calendar reminders, you prevent context-switching leak and keep your focus pure.
                    </p>
                  </div>
                </div>
              </div>

              {/* THREE PROFILE PERSONAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5.5xl mx-auto">
                <div className="bg-[#09090c] border border-zinc-900 rounded-2.5xl p-6.5">
                  <h3 className="text-sm font-bold text-indigo-400 font-mono uppercase">💼 For Startup Founders</h3>
                  <p className="text-xs text-zinc-400 mt-3 font-light leading-relaxed">
                    Map startup cost lists, burger startup brainstorming summaries, legal contracts, and vendor notes contextually. Instantly retrieve records by typing simple queries without looking through folders.
                  </p>
                  <p className="text-[11px] text-indigo-350/80 mt-4 italic">"Everything important in one place."</p>
                </div>

                <div className="bg-[#09090c] border border-zinc-900 rounded-2.5xl p-6.5">
                  <h3 className="text-sm font-bold text-teal-400 font-mono uppercase">🎓 For Busy Organizers</h3>
                  <p className="text-xs text-zinc-400 mt-3 font-light leading-relaxed">
                    Set high-priority student assignments, bill payment calendars, homework deadlines, or monthly storage subscriptions. Get automated proactive checklists before reviews.
                  </p>
                  <p className="text-[11px] text-teal-350/80 mt-4 italic">"Zero cognitive cataloging decay."</p>
                </div>

                <div className="bg-[#09090c] border border-zinc-900 rounded-2.5xl p-6.5">
                  <h3 className="text-sm font-bold text-indigo-300 font-mono uppercase">📝 For Thought-Collectors</h3>
                  <p className="text-xs text-zinc-400 mt-3 font-light leading-relaxed">
                    Assemble intellectual articles, YouTube tutorials, and custom password clues. Rest assured that everything is locked with password-hashed browser indexes or recoverable via secure Google IDs.
                  </p>
                  <p className="text-[11px] text-indigo-250/80 mt-4 italic">"Seamless second brain sync."</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 4: PRICING ==================== */}
          {activePage === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
              {/* Pricing Hero */}
              <div className="text-center pt-10 pb-12">
                <button 
                  onClick={() => setActivePage('home')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-full mb-4"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
                </button>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono block">Operator Access</span>
                <h1 className="text-3xl sm:text-5xl font-bold mt-2">Pragmatic Pricing Structure</h1>
                <p className="mt-4 text-sm text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                  Full secure indexing and proactive memory layers without high entry barriers.
                </p>

                {/* Billing toggle switcher */}
                <div className="mt-6 inline-flex items-center gap-3 bg-zinc-950/80 border border-zinc-900 p-1.5 rounded-full text-xs font-semibold">
                  <button 
                    onClick={() => setIsAnnual(false)}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${!isAnnual ? 'bg-zinc-90 w text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Monthly Rate
                  </button>
                  <button 
                    onClick={() => setIsAnnual(true)}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${isAnnual ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400'}`}
                  >
                    Yearly Billing <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">Save 20%</span>
                  </button>
                </div>
              </div>

              {/* THREE COLUMN PRICING PLANS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                
                {/* Plan 1 */}
                <div className="bg-[#09090c]/80 border border-zinc-900 rounded-3xl p-6.5 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-sm text-zinc-400 font-semibold font-mono">Standard Starter</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold font-mono text-zinc-100">$0</span>
                      <span className="text-xs text-zinc-500 font-light font-mono">/ seat</span>
                    </div>
                    <p className="mt-4 text-xs text-zinc-400 font-light leading-relaxed">
                      Experience Nexa's core memory indexing and calendar checklists in single-operator spaces.
                    </p>
                    <ul className="mt-8 space-y-4 text-xs text-zinc-500 font-light border-t border-zinc-900 pt-6">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400/80" /> Up to 50 active notes</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400/80" /> Up to 50 reminders</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400/80" /> Standard query search</li>
                    </ul>
                  </div>
                  <button onClick={onLaunchApp} className="mt-8 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest font-mono cursor-pointer transition-colors">
                    Deploy Free
                  </button>
                </div>

                {/* Plan 2 - Promoted */}
                <div className="bg-[#0b0b10] border-2 border-indigo-600 rounded-3xl p-6.5 sm:p-8 flex flex-col justify-between relative shadow-[0_0_40px_rgba(99,102,241,0.08)]">
                  <span className="absolute top-0 right-8 translate-y-[-50%] bg-indigo-600 text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full font-mono">Active Choice</span>
                  <div>
                    <span className="text-sm text-indigo-350 font-bold font-mono">Pro Operator 💪</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold font-mono text-white">
                        {isAnnual ? '$16' : '$20'}
                      </span>
                      <span className="text-xs text-zinc-500 font-light font-mono">/ seat</span>
                    </div>
                    <p className="mt-4 text-xs text-zinc-200 font-light leading-relaxed">
                      Full persistent storage, document analysis, and complete AI features for creators and builders.
                    </p>
                    <ul className="mt-8 space-y-4 text-xs text-zinc-350 font-light border-t border-zinc-900 pt-6">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-400" /> <strong className="text-white font-medium">Unlimited</strong> cognitive notes</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-400" /> <strong className="text-white font-medium">Unlimited</strong> scheduled alerts</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-400" /> Complete Gemini AI workspace edits</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-400" /> Custom Google Login Data persistence</li>
                    </ul>
                  </div>
                  <button onClick={onLaunchApp} className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-bold uppercase tracking-widest font-mono cursor-pointer transition-colors shadow-lg shadow-indigo-600/20">
                    Get Pro Access
                  </button>
                </div>

                {/* Plan 3 */}
                <div className="bg-[#09090c]/80 border border-zinc-900 rounded-3xl p-6.5 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-sm text-zinc-400 font-semibold font-mono">Enterprise Node</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold font-mono text-zinc-105">$48</span>
                      <span className="text-xs text-zinc-500 font-light font-mono">/ seat</span>
                    </div>
                    <p className="mt-4 text-xs text-zinc-400 font-light leading-relaxed">
                      Custom dedicated virtual environments for team collaboration, SSO frameworks, and advanced compliance.
                    </p>
                    <ul className="mt-8 space-y-4 text-xs text-zinc-500 font-light border-t border-zinc-900 pt-6">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400/80" /> Multi-user shared collections</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400/80" /> Tailored API quota bounds</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-400/80" /> Direct Slack & communication logs</li>
                    </ul>
                  </div>
                  <button onClick={onLaunchApp} className="mt-8 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest font-mono cursor-pointer transition-colors">
                    Deploy Enterprise
                  </button>
                </div>
              </div>

              {/* DYNAMIC TEAM SEAT COST ESTIMATOR */}
              <div className="bg-[#09090c] border border-zinc-900 rounded-3xl p-6.5 sm:p-8 max-w-2.5xl mx-auto shadow-xl">
                <div className="text-center mb-6">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Interactive Calculator</span>
                  <h3 className="text-base font-bold text-white mt-0.5">Team Seat License Estimator</h3>
                  <p className="text-xs text-zinc-400 mt-1">Adjust the operator seat count to estimate your team licensing costs with Nexa OS.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
                    <span>Operator Seat Count:</span>
                    <span className="text-indigo-400">{seatCount} seats {seatCount >= 10 && <span className="text-[10px] text-emerald-400 font-semibold">(10% volume discount applied!)</span>}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={seatCount} 
                    onChange={(e) => setSeatCount(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-950 rounded-full" 
                  />

                  <div className="bg-[#050507] border border-zinc-900 p-5 rounded-2xl flex items-center justify-between mt-6">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Estimated Cost</span>
                      <span className="text-[10px] text-zinc-450 mt-1 block">Billed {isAnnual ? 'annually' : 'monthly'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3.5xl font-extrabold font-mono text-white">${calculateLicensePrice()}</span>
                      <span className="text-xs text-zinc-500 font-mono ml-1">/ month</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 5: FAQ ==================== */}
          {activePage === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
              {/* FAQ Hero */}
              <div className="text-center pt-10 pb-12">
                <button 
                  onClick={() => setActivePage('home')}
                  className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-full mb-4"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
                </button>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono block">Knowledge Directory</span>
                <h1 className="text-3xl sm:text-5xl font-bold mt-2">Frequently Addressed Queries</h1>
                <p className="mt-4 text-sm text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                  Search through common FAQs detailing browser tools, privacy benchmarks, features, and roadmaps.
                </p>
              </div>

              {/* SEARCH FAQ FILTER BOX */}
              <div className="mb-8 relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-500" />
                </div>
                <input 
                  type="text" 
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search FAQ articles (e.g. Google, secure, AI...)"
                  className="w-full bg-zinc-950 border border-zinc-900 pl-11 pr-4 py-3.5 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-indigo-505/50 transition-all font-mono"
                />
              </div>

              <div className="bg-[#09090c] border border-zinc-900 rounded-3xl p-6.5 sm:p-8 shadow-xl">
                {filteredFaqs.length > 0 ? (
                  <div className="divide-y divide-zinc-900">
                    {filteredFaqs.map((faq, idx) => (
                      <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <HelpCircle className="h-8 w-8 text-zinc-650 mx-auto mb-3" />
                    <span className="text-xs font-mono text-zinc-500">No matching questions found in directory.</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#070709] py-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button 
            type="button"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2 bg-transparent border-0 cursor-pointer text-left outline-none"
          >
            <div className="h-6 w-6 bg-indigo-600 rounded-md flex items-center justify-center font-bold text-white text-[10px]">
              NX
            </div>
            <span className="font-semibold text-zinc-300">Nexa OS</span>
          </button>
          <div className="flex items-center gap-6 font-mono text-[10px]">
            <button onClick={() => setActivePage('features')} className="text-zinc-550 hover:text-zinc-300 transition-colors uppercase">Features</button>
            <button onClick={() => setActivePage('benefits')} className="text-zinc-550 hover:text-zinc-300 transition-colors uppercase">Benefits</button>
            <button onClick={() => setActivePage('pricing')} className="text-zinc-550 hover:text-zinc-300 transition-colors uppercase">Pricing</button>
            <button onClick={() => setActivePage('faq')} className="text-zinc-550 hover:text-zinc-300 transition-colors uppercase">FAQ</button>
          </div>
          <p className="text-zinc-650 text-[10px]">
            &copy; 2026 Nexa Technologies, Inc. All rights reserved. Your ultimate digital second brain.
          </p>
        </div>
      </footer>
    </div>
  );
}
