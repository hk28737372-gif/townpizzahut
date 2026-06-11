import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, TrendingUp, Calendar, AlertCircle, Plus, Sparkles, 
  Trash2, DollarSign, ArrowRight, Eye, Play, Sparkle, Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell
} from 'recharts';
import { Subscription } from '../types';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  onAddSubscription: (sub: Omit<Subscription, 'id'>) => void;
  onDeleteSubscription: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Productivity: '#6366f1', // Indigo
  Entertainment: '#ec4899', // Pink
  Creative: '#14b8a6', // Teal
  Infrastructure: '#f59e0b', // Amber
  Other: '#64748b' // Slate
};

export default function SubscriptionsView({
  subscriptions,
  onAddSubscription,
  onDeleteSubscription,
  onToggleStatus
}: SubscriptionsViewProps) {
  // Add Sub modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCost, setSubCost] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subCategory, setSubCategory] = useState('Productivity');
  const [nextBillingDate, setNextBillingDate] = useState('');

  // Computations
  const totalMonthlyCost = useMemo(() => {
    return subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        const cost = s.cost;
        return sum + (s.billingCycle === 'monthly' ? cost : cost / 12);
      }, 0);
  }, [subscriptions]);

  const upcomingCharges = useMemo(() => {
    return [...subscriptions]
      .filter(s => s.status === 'active')
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
      .slice(0, 3);
  }, [subscriptions]);

  const categoryBreakdown = useMemo(() => {
    const map: { [key: string]: number } = {};
    subscriptions.filter(s => s.status === 'active').forEach(s => {
      const cost = s.billingCycle === 'monthly' ? s.cost : s.cost / 12;
      map[s.category] = (map[s.category] || 0) + cost;
    });
    return Object.keys(map).map(cat => ({
      name: cat,
      value: Math.round(map[cat])
    }));
  }, [subscriptions]);

  const spendTrendData = useMemo(() => {
    // Generate simple projected 6-month spend
    return [
      { month: 'Jan', amount: Math.round(totalMonthlyCost * 0.9) },
      { month: 'Feb', amount: Math.round(totalMonthlyCost * 0.9) },
      { month: 'Mar', amount: Math.round(totalMonthlyCost * 0.95) },
      { month: 'Apr', amount: Math.round(totalMonthlyCost) },
      { month: 'May', amount: Math.round(totalMonthlyCost * 1.05) },
      { month: 'Jun', amount: Math.round(totalMonthlyCost) }
    ];
  }, [totalMonthlyCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCost || !nextBillingDate) return;

    onAddSubscription({
      name: subName,
      cost: parseFloat(subCost),
      billingCycle,
      category: subCategory,
      nextBillingDate,
      status: 'active'
    });

    // Reset fields
    setSubName('');
    setSubCost('');
    setBillingCycle('monthly');
    setSubCategory('Productivity');
    setNextBillingDate('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-indigo-400" />
            Subscription Tracker
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track and optimize recurring cloud and service expenses. Review active billing dates and optimize productivity spending.
          </p>
        </div>

        <button
          type="button"
          id="btn-add-subscription"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-indigo-505/10 inline-flex self-start"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cost Indicator Card */}
        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
          <div>
            <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase flex items-center gap-1.5"><DollarSign className="h-3 w-3 text-indigo-450" /> Projected Spending</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-sans tracking-tight">
              ${totalMonthlyCost.toFixed(2)}
              <span className="text-zinc-500 text-xs font-normal font-mono ml-1.5">/ mo</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <span>●</span> Optimized Premium Ratio Included
            </p>
          </div>
          <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-light">
            Calculated across {subscriptions.filter(s => s.status === 'active').length} active subscription elements. Annual structures normalizes to monthly models.
          </p>
        </div>

        {/* Categories breakdown graph */}
        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 md:col-span-2 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Operational Cost Trends</span>
            <div className="h-28 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131317" vertical={false} />
                  <XAxis dataKey="month" stroke="#4b5563" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090c', border: '1px solid #1f2937', borderRadius: '12px' }}
                    labelStyle={{ color: '#9ca3af', fontSize: '10px' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories mini list summary */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] font-mono text-zinc-550 uppercase block">Category Index</span>
            <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
              {categoryBreakdown.length === 0 ? (
                <span className="text-xs text-zinc-500 italic block">No active metrics found</span>
              ) : (
                categoryBreakdown.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#64748b' }} />
                      <span className="text-zinc-300 font-medium">{cat.name}</span>
                    </div>
                    <span className="font-mono text-zinc-400 font-semibold">${cat.value}/mo</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Active Subscriptions List (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-300">Monitored Expense Ledger</span>
            <span className="text-[10px] font-mono text-zinc-500">{subscriptions.length} listed</span>
          </div>

          <div className="space-y-2">
            {subscriptions.map((sub) => {
              const billingColor = CATEGORY_COLORS[sub.category] || '#64748b';
              const daysLeft = Math.round((new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={sub.id}
                  className="bg-[#09090c]/40 border border-zinc-900/85 hover:border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border" 
                      style={{ borderColor: `${billingColor}20`, backgroundColor: `${billingColor}08` }}
                    >
                      <Tag className="h-5 w-5" style={{ color: billingColor }} />
                    </div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-100 truncate">{sub.name}</span>
                        <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border border-zinc-805 bg-zinc-900/50 text-zinc-400">
                          {sub.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 mt-1 text-[10px] text-zinc-500 font-mono">
                        <span>Cost: ${sub.cost.toFixed(2)} / {sub.billingCycle}</span>
                        <span>•</span>
                        <span className={daysLeft <= 3 ? 'text-amber-400' : 'text-zinc-500'}>
                          {daysLeft > 0 ? `Renews in ${daysLeft} days` : 'Renews today'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                      sub.status === 'active' 
                        ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' 
                        : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                    }`}
                      onClick={() => onToggleStatus(sub.id)}
                    >
                      {sub.status === 'active' ? 'Active' : 'Paused'}
                    </span>

                    <button
                      type="button"
                      id={`delete-sub-${sub.id}`}
                      onClick={() => onDeleteSubscription(sub.id)}
                      className="p-2 text-zinc-650 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Proactive AI Optimization Insights (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Optimizer Card */}
          <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-600/15 flex items-center justify-center">
                <Sparkle className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-zinc-150">Nexa Spend Intelligence</span>
            </div>

            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              We parsed subscription categories and detected multiple cloud service elements. Here are proactive recommendations to streamline cost indexes:
            </p>

            <div className="space-y-2.5">
              <div className="bg-[#09090c] border border-zinc-900 p-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="block font-bold text-zinc-200">Optimal Billing Cycle Upgrade</span>
                  <p className="text-zinc-500 font-light mt-0.5">Upgrading ChatGPT Plus to annual payment plan would save $45.00/yr.</p>
                </div>
              </div>

              <div className="bg-[#09090c] border border-zinc-900 p-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="block font-bold text-zinc-200">Creative Feature Duplication</span>
                  <p className="text-zinc-500 font-light mt-0.5">Found active Canva & Adobe licenses. We suggest evaluating feature overlaps to save $12.99/mo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming renewal alert timeline */}
          <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Renewal Timeline Alerts</span>
            
            <div className="space-y-4">
              {upcomingCharges.map((sub, idx) => (
                <div key={sub.id} className="relative pl-6 pb-2 last:pb-0">
                  {/* Timeline bullet line helper */}
                  {idx < upcomingCharges.length - 1 && (
                    <span className="absolute left-2 top-3 bottom-0 w-px bg-zinc-850" />
                  )}
                  <span className="absolute left-1 top-2.5 h-2 w-2 rounded-full bg-indigo-500" />
                  
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-zinc-200 block">{sub.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Renews {sub.nextBillingDate}</span>
                    </div>
                    <span className="font-mono text-zinc-300 font-semibold">${sub.cost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Expense Modal popup (Simulated) */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/75 z-[80] backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-md md:mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl p-6 z-[90] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-indigo-400" />
                  Track New Expense
                </span>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-zinc-500 hover:text-white text-xs cursor-pointer font-mono"
                >
                  ESC
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-zinc-500">Service Title</label>
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="e.g. Netflix, Vercel Pro, AWS"
                    className="w-full bg-[#09090c] border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Monthly/Yearly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={subCost}
                      onChange={(e) => setSubCost(e.target.value)}
                      placeholder="19.99"
                      className="w-full bg-[#09090c] border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Billing Cycle</label>
                    <select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                      className="w-full bg-[#09090c] border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Category</label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full bg-[#09090c] border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="Productivity">Productivity</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Creative">Creative</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Next Due Date</label>
                    <input
                      type="date"
                      required
                      value={nextBillingDate}
                      onChange={(e) => setNextBillingDate(e.target.value)}
                      className="w-full bg-[#09090c] border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 hover:bg-zinc-900 rounded-xl text-zinc-400 font-medium text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-xs cursor-pointer"
                  >
                    Save Expense Record
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
