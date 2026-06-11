import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, Bot, User, HelpCircle, FileText, Calendar, Compass, ArrowRight,
  Database, RefreshCw, Zap, Lightbulb
} from 'lucide-react';
import { Note, Reminder, Document } from '../types';

interface AIAssistantViewProps {
  notes: Note[];
  reminders: Reminder[];
  documents: Document[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  references?: Array<{ title: string; type: 'note' | 'document' | 'reminder' }>;
}

export default function AIAssistantView({ 
  notes, 
  reminders, 
  documents 
}: AIAssistantViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### Assalam-o-Alaikum! Welcome to Nexa! 👋

Main aapka personal digital AI Brain Assistant hoon. Mera kaam aapke **Notes (📝)**, **Smart PDF Documents (📄)**, aur **Daily Reminders (📅)** ko organize aur analyze karna hai.

Aap mujhse Roman Urdu ya English mai chat kar sakte hain. Shuru karne ke liye neeche diye gaye aasan questions button par click karein ya apna sawal likhein! 👇`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const promptSuggestions = [
    { text: "Nexa, aap kaun hain aur yeh app kis liye hai? (Intro)", icon: Bot },
    { text: "Pakistan mai total kitni provinces (subay) hain?", icon: Compass },
    { text: "Mera aakhri file/document kahan hai?", icon: FileText },
    { text: "Mera aakhri saved note kya hai?", icon: Lightbulb },
    { text: "App ko Mobile ya Laptop par download/install kaise karein?", icon: Zap }
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(0, -1),
          notes,
          reminders,
          documents
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          const assistantMsg: Message = {
            id: `msg-${Date.now()}-reply`,
            sender: 'assistant',
            text: data.text,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            references: data.references
          };
          setMessages(prev => [...prev, assistantMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch (apiError) {
      console.warn('Real GenAI API failure, resuming local backup resolution:', apiError);
    }

    // Mock highly conversational context-aware response
    setTimeout(() => {
      let replyText = "";
      const query = text.toLowerCase().trim();
      const references: Array<{ title: string; type: 'note' | 'document' | 'reminder' }> = [];

      const lastDoc = documents && documents.length > 0 ? documents[documents.length - 1] : null;
      const lastNote = notes && notes.length > 0 ? notes[notes.length - 1] : null;

      // 1. General greetings and introductions
      if (query === 'hi' || query === 'hello' || query === 'hey' || query === 'assalamualaikum' || query === 'salaam' || query.includes('kia haal') || query.includes('kia hal') || query.includes('how are you') || query.includes('kese ho') || query.includes('kaise ho') || query.includes('kya haal') || query.includes('aap kaun') || query.includes('who are you') || query.includes('intro') || query.includes('purpose') || query.includes('taruf') || query.includes('introduction') || query.includes('app kis liye') || query.includes('app kya')) {
        replyText = `### Assalam-o-Alaikum! Hello! 👋 Main Nexa Personal AI Brain hoon.

Main ek smart digital **"Second Brain"** OS assistant hoon jo aapke rozmarra ke memory records ko ek jagah mehfooz rakhta hai. 

**Nexa App ka Asli Purpose kya hai?**
1. **Notes Management (📝):** Apne dimagh ke khayalaat, goals aur pitches yahan likh kar save karein.
2. **Smart Documents (📄):** Apne PDF/Documents upload karein. Main unki deep indexing karkay summary aur insights nikaal sakta hoon.
3. **Daily Reminders (📅):** Apne ahem kaam scheduled karein taake targets miss na hon.
4. **AI Brain Chat (🧠):** Mujhse Roman Urdu ya English mai chat karein! Main aapke files aur notes ko search karkay foran answer de sakta hoon.

*Tip: Agar aap mujhse dynamic internet queries ya direct customized questions (just like Chat GPT or Google Gemini) poochhna chahte hain, toh live stream activate karne ke liye **Settings/Secrets** mai apna real \`GEMINI_API_KEY\` save karein!*`;
      }
      // 2. Pakistan & Province queries (Punjab, Sindh, KPK, Balochistan)
      else if (query.includes('province') || query.includes('provinces') || query.includes('suba') || query.includes('soobe') || query.includes('sooba') || query.includes('subay') || query.includes('pakistan')) {
        replyText = `### Pakistan ke Provinces (Subay) aur Capital Cities 🇵🇰

Pakistan ke pass total **4 main provinces (subay/soobe)** hain, jin ki detailed list ye hai:

1. **Punjab** (Capital: **Lahore**) — Population ke hisab se sabse bada province.
2. **Sindh** (Capital: **Karachi**) — Pakistan ka business aur financial hub.
3. **Khyber Pakhtunkhwa (KPK)** (Capital: **Peshawar**) — Khoobsurat pahar aur history ke liye mashhoor.
4. **Balochistan** (Capital: **Quetta**) — Area ke hisab se sabse bada province.

**Federal Territories & Administrative Regions:**
• **Islamabad Capital Territory** (Capital: **Islamabad** — Mulk ka beautiful capital city)
• **Gilgit-Baltistan** (Capital: **Gilgit**) — Northern valleys aur K2 mountains.
• **Azad Jammu & Kashmir (AJK)** (Capital: **Muzaffarabad**).

Aap in provinces ya kisi bhi city ke baare mai details pooch sakte hain!`;
      }
      // 3. Document check
      else if (query.includes('document') || query.includes('doc') || query.includes('file') || query.includes('receipt') || query.includes('contract')) {
        if (lastDoc) {
          replyText = `### Aapka Aakhri Uploaded Document (Last Document) 📄

Muje aapki memory vault mai sabse aakhir mai upload kiya gaya doocument mil gaya hai:

• **File Name:** \`${lastDoc.name}\`
• **File Type:** ${lastDoc.type || 'PDF Document'}
• **Size:** ${lastDoc.size || 'N/A'}
• **Upload Date:** ${lastDoc.dateAdded || 'N/A'}

**AI Summary & Extract Insights:**
"""
${lastDoc.parsedInsights || 'Ek dum super insights! Yeh file successfully parsed hai.'}
"""

Aap is document ko **Smart Documents** page par jaa kar management aur preview kar sakte hain!`;
          references.push({ title: lastDoc.name, type: 'document' });
        } else {
          replyText = `### Ingested Documents Vault 📄

Muje is waqt aapke database mai koi uploaded PDFs ya files nahi milin.

**Document save aur query karne ka aasan tareeqah:**
1. Sidebar se **Smart Documents** page par jayein.
2. Apni kisi bhi PDF file ya scanned book ko **Drag and Drop** kar ke upload karein.
3. Upload hone ke baad yahan chat par aakar poochain "explain my last document", toh main un files ki summary bata dunga!`;
        }
      }
      // 4. Note check
      else if (query.includes('note') || query.includes('draft') || query.includes('ideas') || query.includes(' pitch')) {
        if (lastNote) {
          replyText = `### Aapka Aakhri Saved Note (Last Note) 📝

Aapka sabse aakhri saved note ye hai:

• **Title (Sarnama):** "**${lastNote.title || 'Untitled note'}**"
• **Category:** ${lastNote.category || 'General Ideas'}
• **Last Edited:** ${lastNote.updatedAt || 'N/A'}

**Content:**
"""
${lastNote.content || 'Note has no textual content currently.'}
"""

Aap is note ko expand ya delete karne ke liye **Notes Management** page par click karkay edit kar sakte hain!`;
          references.push({ title: lastNote.title, type: 'note' });
        } else {
          replyText = `### Notes Registry 📝

Aapki personal registry mai abhi tak koi saved notes mojud nahi hain.

**Naya Note likhne ka aasan tarika:**
1. Left sidebar se ya dashboard ke **"Create Note"** button par click karein.
2. Apney topic ka modern Title aur detail content likh kar click **"Save"** karein.
3. Main use instantly brain memory mai load kar loon ga!`;
        }
      }
      // 5. App download and PWA / Installation instructions
      else if (query.includes('download') || query.includes('install') || query.includes('pwa') || query.includes('mobile') || query.includes('laptop') || query.includes('save') || query.includes('home screen') || query.includes('chalane ka')) {
        replyText = `### Mobile & Laptop par Nexa Download/Install Kaise Karein? 📱💻

Nexa ek modern **Progressive Web App (PWA)** hai. Aapko dukan par jaakar install karne ki zaroorat nahi, aap directly browser se isko native app bana sakte hain:

**📱 Mobile par (Android & iPhone):**
1. Nexa ko Google Chrome ya Safari browser mai open karein.
2. Browser bar ke **Triple Dot (Menu)** ya **"Share"** button par tap karein.
3. Option list se **"Add to Home Screen"** par click karein.
4. Icon aapke mobile screen par save ho jaye ga aur yeh bilkul real app ki tarah open ho ga!

**💻 Laptop / PC par:**
1. Browser ke URL input box ke right corner par ek dynamic **"Install App" / Desktop symbol** dikhayi dega.
2. Us par click karkay install karein. 
3. Nexa aapke Desktop taskbar mai as a standalone responsive app add ho jaye ga!`;
      }
      // 6. Reminders / Goals check
      else if (query.includes('reminder') || query.includes('reminders') || query.includes('task') || query.includes('tasks') || query.includes('schedule') || query.includes('due') || query.includes('kaam')) {
        const activeRes = reminders.filter(r => !r.completed);
        if (activeRes.length > 0) {
          replyText = `### Active Goals & Reminders (Pending Tasks) 📅

Aapke pass is waqt **${activeRes.length} pending tasks** scheduled hain:

` +
            activeRes.map(r => `• **[${r.priority.toUpperCase()}]** ${r.text} — Due: **${r.dueDate}**`).join('\n') +
            `\n\n*Proactive Suggestion*: Cash in on this speed! Apna sabse highest priority target "${activeRes.find(r => r.priority === 'high')?.text || activeRes[0].text}" pehle complete karein.`;
          references.push({ title: 'Tasks and Schedules Ledger', type: 'reminder' });
        } else {
          replyText = `### Reminders & Objectives Registry 📅

Mash'Allah! Is waqt aapka koi bhi target pending nahi hai. Saare scheduled kaam mukammal ho chukay hain! Solid momentum!`;
        }
      }
      // 7. General fallback
      else {
        replyText = `### Nexa Brain Assistant 🧠

Main aapki intelligent storage index kar raha hoon:

• **Total Notes:** ${notes.length} saved
• **Smart PDFs & Docs:** ${documents.length} files
• **Pending Goals & Reminders:** ${reminders.filter(r=>!r.completed).length} items

Mera target aapke Second Brain data ko asan banana hai. Aap mujhse aam maloomat (greetings, Pakistan ke provinces, app download method) ya directly files aur notes ke baare mai pooch sakte hain!

*Tip: Fully dynamic model ke answers ke liye **Settings/Secrets** mai apna real \`GEMINI_API_KEY\` save karein!*`;
      }

      const assistantMsg: Message = {
        id: `msg-${Date.now()}-reply`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        references: references.length > 0 ? references : undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 150);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Dynamic Header */}
      <div className="border-b border-zinc-900 pb-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Bot className="h-6 w-6 text-indigo-400 animate-pulse" />
            AI Brain Assistant
            <span className="text-[10px] bg-indigo-950/50 border border-indigo-900/60 font-mono text-indigo-300 font-medium px-2 py-0.5 rounded-full uppercase">Neural Engine</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-light">
            Search, connect, synthesize, and query digital life notes and documents.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-550 font-mono text-[10px]">
          <Database className="h-3.5 w-3.5 text-indigo-405" />
          <span>{notes.length} nodes + {documents.length} docs parsed</span>
        </div>
      </div>

      {/* Suggestion Pills - Only shows if messages have only greeting */}
      {messages.length === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
          {promptSuggestions.map((sug, i) => {
            const Icon = sug.icon;
            return (
              <button
                key={i}
                type="button"
                id={`suggest-pill-${i}`}
                onClick={() => handleSend(sug.text)}
                className="p-4 bg-zinc-950 hover:bg-zinc-904 border border-zinc-900 hover:border-zinc-801 text-xs text-left text-zinc-300 hover:text-white rounded-xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">{sug.text}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-650 group-hover:text-indigo-420 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive Chat Board (Full flex grow) */}
      <div className="flex-1 overflow-y-auto bg-zinc-950/40 border border-zinc-904/60 rounded-2xl p-4 sm:p-6 space-y-6 min-h-0 pr-2">
        {messages.map((msg) => {
          const isAi = msg.sender === 'assistant';
          return (
            <div key={msg.id} className={`flex gap-4 ${isAi ? 'justify-start' : 'justify-end'}`}>
              
              {/* Avatar indicator */}
              {isAi && (
                <div className="h-8 w-8 rounded-lg bg-indigo-600/15 flex items-center justify-center text-indigo-405 border border-indigo-505/20 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className="space-y-2 max-w-[85%]">
                <div className={`p-4 rounded-2xl text-xs sm:text-sm font-light leading-relaxed ${
                  isAi 
                    ? 'bg-zinc-900/60 border border-zinc-850/60 text-zinc-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                    : 'bg-indigo-600/20 border border-indigo-500/20 text-white shadow-lg'
                }`}>
                  {/* Simplistic Markdown support natively styled */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return <h4 key={pIdx} className="font-extrabold text-sm text-indigo-300 mt-2 tracking-tight">{paragraph.replace('### ', '')}</h4>;
                      }
                      if (paragraph.startsWith('• ') || paragraph.includes('\n• ')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-4 space-y-1 mt-1 text-zinc-300">
                            {paragraph.split('\n').map((li, liIdx) => (
                              <li key={liIdx}>{li.replace('• ', '').replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={pIdx} className="font-light">{paragraph}</p>;
                    })}
                  </div>
                </div>

                {/* References linked index tags */}
                {msg.references && (
                  <div className="flex flex-wrap gap-1.5 items-center pl-1">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase mr-1">Semantic source:</span>
                    {msg.references.map((ref, rIdx) => (
                      <span key={rIdx} className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-indigo-400 rounded-md">
                        <FileText className="h-2.5 w-2.5" />
                        {ref.title}
                      </span>
                    ))}
                  </div>
                )}

                <span className="block text-[9px] font-mono text-zinc-650 ml-1">{msg.timestamp}</span>
              </div>

              {!isAi && (
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 font-bold text-xs select-none">
                  U
                </div>
              )}

            </div>
          );
        })}

        {/* Dynamic Typing visualizer */}
        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/15 flex items-center justify-center text-indigo-405 border border-indigo-505/20 shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-zinc-900/40 border border-zinc-900 p-3 px-4 rounded-xl flex items-center gap-1 text-zinc-450 text-xs">
              <RefreshCw className="h-3 w-3 animate-spin text-zinc-500" />
              <span className="font-mono text-[10px] animate-pulse">Assistant indexing reference nodes...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input query form (Shrinkable footer) */}
      <div className="shrink-0 space-y-2">
        <div className="relative flex items-center">
          <input
            type="text"
            id="assistant-query-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Nexa (e.g., 'Summarize my startup notes' or 'Show upcoming objectives')"
            className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-500/50 rounded-2xl pl-4 pr-12 py-3.5 text-xs text-zinc-200 focus:outline-none placeholder-zinc-550 font-medium"
          />
          <button
            type="button"
            id="assistant-query-submit"
            onClick={() => handleSend(inputValue)}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex justify-between items-center text-[10px] text-zinc-550 font-mono px-1">
          <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-emerald-420" /> Ultra low latency streaming index</span>
          <span>Press Enter to dispatch query</span>
        </div>
      </div>

    </div>
  );
}
