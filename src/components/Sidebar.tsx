import { 
  Sparkles, LayoutDashboard, FileText, 
  Bell, LogOut, Search, User, ShieldCheck, TrendingUp, Bookmark, Award, CreditCard
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onSearchClick: () => void;
  onSignOut: () => void;
  user: UserProfile;
}

export default function Sidebar({ 
  currentTab, 
  onChangeTab, 
  onSearchClick, 
  onSignOut, 
  user 
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Smart Documents', icon: ShieldCheck },
    { id: 'notes', label: 'Notes & Brain', icon: FileText },
    { id: 'reminders', label: 'Goals & Tasks', icon: Bell },
    { id: 'subscriptions', label: 'Subscription Hub', icon: CreditCard },
    { id: 'hub', label: 'Knowledge Hub', icon: Bookmark },
    { id: 'assistant', label: 'Brain Assistant', icon: Sparkles },
    { id: 'review', label: 'Daily Review', icon: Award },
    { id: 'settings', label: 'Settings', icon: User },
  ];

  return (
    <div className="w-64 border-r border-[#18181b] bg-[#09090c] flex flex-col justify-between h-screen fixed top-0 left-0 z-40">
      
      {/* Brand & User Header */}
      <div>
        <div className="p-6 border-b border-zinc-900">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onChangeTab('dashboard')}>
            <div className="h-8 w-8 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent font-sans">
              Nexa<span className="text-zinc-500 font-medium text-xs ml-1 font-mono uppercase">OS</span>
            </span>
          </div>

          {/* Quick Search trigger */}
          <button
            type="button"
            id="sidebar-search-trigger"
            onClick={onSearchClick}
            className="w-full flex items-center justify-between gap-2 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-450 hover:text-zinc-200 border border-zinc-900 hover:border-zinc-805 text-xs rounded-xl px-3.5 py-2.5 transition-all text-left group"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
              <span>Spotlight query...</span>
            </span>
            <span className="font-mono text-[9px] bg-zinc-904 border border-zinc-850 text-zinc-500 px-1.5 py-0.5 rounded">⌘K</span>
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`sidebar-tab-${item.id}`}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-505/20 shadow-[0_2px_10px_rgba(99,102,241,0.02)]' 
                    : 'text-zinc-450 hover:text-white hover:bg-zinc-950 border border-transparent hover:border-[#131317]/50'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-405' : 'text-zinc-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Status, Activity Score & Signout */}
      <div className="p-4 border-t border-zinc-900 space-y-4">
        
        {/* Productivity micro metric */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-3.5">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium mb-1.5 font-mono">
            <span className="flex items-center gap-1 uppercase"><TrendingUp className="h-3 w-3 text-emerald-400 animate-pulse" /> Brain Output</span>
            <span className="font-mono text-zinc-300">{user.productivityScore}%</span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${user.productivityScore}%` }} 
              className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full transition-all duration-1000 ease-out" 
            />
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between bg-zinc-950/20 p-2.5 rounded-xl border border-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-9 w-9 rounded-xl border border-zinc-800 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#09090c]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-200 truncate max-w-[110px]">{user.name}</span>
              <span className="text-[10px] text-zinc-500 flex items-center gap-0.5 mt-0.5">
                <ShieldCheck className="h-3 w-3 text-indigo-400" /> {user.tier} Plan
              </span>
            </div>
          </div>
          <button
            type="button"
            id="sidebar-btn-signout"
            onClick={onSignOut}
            title="Log out"
            className="p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
