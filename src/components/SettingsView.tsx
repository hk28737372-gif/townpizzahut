import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Shield, Bell, Eye, Database, Check, RefreshCw, 
  Settings, Award, Lock, Sparkles, AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function SettingsView({ 
  user, 
  onUpdateProfile 
}: SettingsViewProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [tier, setTier] = useState(user.tier);
  const [avatar, setAvatar] = useState(user.avatar);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  // Interactive settings switches states
  const [notifSound, setNotifSound] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [cognitiveAggregation, setCognitiveAggregation] = useState(true);
  const [autoArchiveDays, setAutoArchiveDays] = useState('30');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name,
      email,
      tier,
      avatar
    });
    alert("Profile configurations saved successfully inside local system sandbox.");
  };

  const runVerificationSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 1500);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Settings Title */}
      <div className="border-b border-zinc-900 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
          <Settings className="h-7 w-7 text-indigo-400" />
          User Settings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Customize security protocols, notification streams, active theme settings, and brain optimization routines.
        </p>
      </div>

      {/* Grid Layout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Category Navigator List (4 Columns) */}
        <div className="md:col-span-4 space-y-3">
          <div className="bg-[#09090c]/40 border border-zinc-905 p-4 rounded-2xl">
            <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest block mb-4">Account Metadata</span>
            
            <div className="flex flex-col items-center text-center p-3 space-y-3">
              <div className="relative">
                <img 
                  src={avatar} 
                  alt={name} 
                  className="h-16 w-16 rounded-2xl border border-zinc-800 object-cover shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full bg-indigo-600 border-4 border-[#070709] flex items-center justify-center">
                  <Award className="h-2.5 w-2.5 text-white" />
                </span>
              </div>
              <div>
                <span className="font-extrabold text-sm text-zinc-150 block">{name}</span>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">{tier} Account Level</span>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-4 mt-2">
              <button
                type="button"
                onClick={runVerificationSync}
                disabled={syncStatus === 'syncing'}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-350 hover:text-white border border-zinc-900 text-xs rounded-xl font-medium transition cursor-pointer"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
                    Checking Nodes...
                  </>
                ) : syncStatus === 'synced' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    All Systems Operational
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    Manual DB Sync check
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-zinc-950/20 border border-zinc-900/40 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-indigo-450 mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold text-zinc-200">System Priority</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-light font-mono">
              Version: 1.14.0-Stable<br />
              Node Location: Local Sandbox Sandbox<br />
              Encryption: TLS 1.3 SHA-256 AES-XTS<br />
              Status: SECURE OK
            </p>
          </div>
        </div>

        {/* Right Side: Tab Forms (8 Columns) */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Profile form */}
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 space-y-6">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-2 border-b border-zinc-900 pb-3">
              <User className="h-4.5 w-4.5 text-indigo-400" />
              Personal Profile
            </span>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-zinc-500">First & Last Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#09090c] border border-zinc-900 focus:border-indigo-550/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none placeholder-zinc-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-zinc-500">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#09090c] border border-zinc-900 focus:border-indigo-550/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none placeholder-zinc-650 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-zinc-500">Tier Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full bg-[#09090c] border border-zinc-900 focus:border-indigo-555/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none font-medium"
                  >
                    <option value="Free">Free Plan</option>
                    <option value="Pro">Pro Plan ($15/mo)</option>
                    <option value="Enterprise">Enterprise Workspace ($45/mo)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-zinc-500">Avatar Image Link</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-[#09090c] border border-zinc-900 focus:border-indigo-550/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none placeholder-zinc-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-505/10"
                >
                  Save Personal Profile
                </button>
              </div>
            </form>
          </div>

          {/* Preferences and Theme controls */}
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 space-y-6">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Eye className="h-4.5 w-4.5 text-indigo-400" />
              Interface Preferences
            </span>

            <div className="space-y-4">
              {/* Theme selection toggle preview */}
              <div className="flex items-center justify-between p-1 bg-zinc-900/35 border border-zinc-900/70 rounded-xl p-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-200">Visual Core Workspace Mode</span>
                  <p className="text-[10px] text-zinc-500 font-light">Choose Nexa standard theme density.</p>
                </div>
                <div className="flex bg-[#09090c] border border-zinc-850 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('dark');
                      alert("Nexa is already displaying optimized Solar Eclipse Dark Mode. High-contrast Slate Black selected.");
                    }}
                    className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      themeMode === 'dark' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Dark Slate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Light Mode is simulated for standard accessibility. Visual assets are kept at optimized Solar Eclipse Dark Mode for eye safety.");
                    }}
                    className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      themeMode === 'light' ? 'bg-zinc-805 text-white' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Light Gray
                  </button>
                </div>
              </div>

              {/* Functional Toggles */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-200">Proactive Cognitive Suggestions</span>
                    <p className="text-[10px] text-zinc-500 font-light">Allow AI assistant to continuously parse notes links and construct dynamic daily targets.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCognitiveAggregation(!cognitiveAggregation)}
                    className={`w-10 h-5.5 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      cognitiveAggregation ? 'bg-indigo-600' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`bg-white h-3.5 w-3.5 rounded-full shadow-md transform duration-200 ease-in-out ${
                      cognitiveAggregation ? 'translate-x-[18px]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 pt-3.5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-200 font-sans">Notification reminders emails</span>
                    <p className="text-[10px] text-zinc-500 font-light">Receive automated email alerts 24 hours prior to subscription billing charges.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifEmail(!notifEmail)}
                    className={`w-10 h-5.5 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      notifEmail ? 'bg-indigo-600' : 'bg-zinc-800'
                    }`}
                  >
                    <div className={`bg-white h-3.5 w-3.5 rounded-full shadow-md transform duration-200 ease-in-out ${
                      notifEmail ? 'translate-x-[18px]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 pt-3.5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-200 font-sans">Automatic Archive Threshold</span>
                    <p className="text-[10px] text-zinc-500 font-light font-sans">Automatically move completed objective cards to the archive stack.</p>
                  </div>
                  <select
                    value={autoArchiveDays}
                    onChange={(e) => setAutoArchiveDays(e.target.value)}
                    className="bg-[#09090c] border border-zinc-900 font-mono text-[11px] rounded-lg px-2.5 py-1 text-zinc-300 focus:outline-none"
                  >
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated security and key vaults */}
          <div className="bg-zinc-905 border border-zinc-900/60 rounded-2xl p-6 space-y-4">
            <span className="text-xs font-extrabold text-zinc-200 flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-indigo-400" />
              Keys Security & Authentication
            </span>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-400 leading-relaxed font-light font-sans">
                You are currently logged in with simulated credentials linked to <strong className="text-zinc-200 font-mono">operator@lifeadmin.ai</strong>. Data values persist locally in browser cookies and local storage state nodes. You can export or trigger backups cleanly at any time.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
