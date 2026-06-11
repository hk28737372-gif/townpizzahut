import { useMemo } from 'react';
import { motion } from 'motion/react';

import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar
} from 'recharts';

import { 
  Sparkles as SparklesIcon, TrendingUp as TrendingUpIcon, 
  CheckCircle2 as CheckCircleIcon, FileText as FileTextIcon, 
  Award as AwardIcon, Calendar as CalendarIcon, 
  Layers as LayersIcon, ChevronRight as ChevronRightIcon,
  Activity as ActivityIcon, Hourglass
} from 'lucide-react';

import { Reminder, Note, CaptureItem, ActivityLog } from '../types';

interface DailyReviewViewProps {
  reminders: Reminder[];
  notes: Note[];
  captureItems: CaptureItem[];
  activityLogs: ActivityLog[];
  productivityScore: number;
}

export default function DailyReviewView({
  reminders,
  notes,
  captureItems,
  activityLogs,
  productivityScore
}: DailyReviewViewProps) {
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalReminders = reminders.length;
    const completedReminders = reminders.filter(r => r.completed).length;
    const itemsCapturedToday = captureItems.length + notes.length;
    
    return {
      totalReminders,
      completedReminders,
      itemsCapturedToday,
      completionRate: totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0
    };
  }, [reminders, notes, captureItems]);

  // Weekly Progress Data for Recharts
  const weeklyData = useMemo(() => {
    return [
      { name: 'Mon', score: 72, tasks: 3, brainSize: 12 },
      { name: 'Tue', score: 85, tasks: 4, brainSize: 14 },
      { name: 'Wed', score: 80, tasks: 2, brainSize: 15 },
      { name: 'Thu', score: 91, tasks: 6, brainSize: 17 },
      { name: 'Fri', score: 88, tasks: 5, brainSize: 19 },
      { name: 'Sat', score: 94, tasks: 3, brainSize: 20 },
      { name: 'Sun', score: productivityScore, tasks: stats.completedReminders, brainSize: 22 },
    ];
  }, [productivityScore, stats.completedReminders]);

  // Recharts custom tooltips for premium alignment
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c0c0f] border border-[#1e1c2a] p-3 rounded-xl text-[11px] font-mono text-zinc-300 shadow-xl space-y-1">
          <p className="font-semibold text-white">{payload[0].payload.name} Review</p>
          <p className="text-indigo-400">Score: {payload[0].value}%</p>
          <p className="text-teal-400">Completed tasks: {payload[0].payload.tasks}</p>
          <p className="text-zinc-500">Brain records: {payload[0].payload.brainSize}</p>
        </div>
      );
    }
    return null;
  };

  const getLogIcon = (type: string) => {
    switch(type) {
      case 'note_created':
      case 'note_updated':
        return <FileTextIcon className="h-4 w-4 text-emerald-400" />;
      case 'reminder_completed':
        return <CheckCircleIcon className="h-4 w-4 text-indigo-400" />;
      case 'reminder_created':
        return <CalendarIcon className="h-4 w-4 text-zinc-500" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header section */}
      <div>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Performance Insights</span>
        <h2 className="text-3xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
          Daily Review <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 font-mono">Operator scorecard</span>
        </h2>
        <p className="text-sm text-zinc-400 font-light leading-relaxed mt-2 max-w-xl">
          Visual metrics tracking your digital second brain output, complete capture history, task velocity, and proactive score indicators.
        </p>
      </div>

      {/* Grid: Main Score & Weekly Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Daily Productivity Score card */}
        <div className="bg-gradient-to-b from-[#0e0e14] to-[#0a0a0d] border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Ambient light */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-indigo-500/15 transition-all" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Agency Score</span>
              <AwardIcon className="h-4 w-4 text-indigo-400 animate-pulse" />
            </div>

            <div className="mt-8 flex items-baseline gap-2">
              <h3 className="text-5xl font-black font-mono tracking-tight bg-gradient-to-r from-white via-zinc-100 to-indigo-400 bg-clip-text text-transparent">
                {productivityScore}%
              </h3>
              <span className="text-xs text-emerald-400 font-medium font-mono">+8.4% velocity</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light mt-4">
              Your overall operability indicator measures completed captures, task response, pinned memory focus, and proactive reviews.
            </p>
          </div>

          <div className="border-t border-zinc-900/80 pt-5 mt-6 space-y-3 text-[11px]">
            <div className="flex justify-between text-zinc-400">
              <span className="font-light">Task completion velocity</span>
              <span className="font-mono text-emerald-400">Excellent</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span className="font-light">Universal capture velocity</span>
              <span className="font-mono text-indigo-400">{stats.itemsCapturedToday} added</span>
            </div>
          </div>
        </div>

        {/* Weekly Area Progress Chart */}
        <div className="lg:col-span-2 bg-[#09090c]/80 border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Weekly Performance Trend</span>
              <span className="text-xs text-zinc-300 font-medium">Last 7 calendar rounds</span>
            </div>
          </div>

          <div className="h-44 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-zinc-900/80 pt-3 mt-4 text-[11px] flex justify-between text-zinc-500 font-light">
            <span>Operating range: 70% - 94% score index</span>
            <span className="font-mono flex items-center gap-1 text-zinc-400"><TrendingUpIcon className="h-3.5 w-3.5 text-emerald-500" /> +12% relative growth</span>
          </div>
        </div>

      </div>

      {/* Double Column: Quick Analytics cards vs. Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Stats Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-2">Today's scorecard</span>

          {/* Cards */}
          <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Tasks Completed</span>
              <h4 className="text-2xl font-bold text-white font-mono">
                {stats.completedReminders} <span className="text-xs text-zinc-500">/ {stats.totalReminders}</span>
              </h4>
            </div>
            <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Universal Captures Added</span>
              <h4 className="text-2xl font-bold text-emerald-400 font-mono">
                {stats.itemsCapturedToday} <span className="text-xs text-zinc-500">records</span>
              </h4>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
              <LayersIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#09090c]/80 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Commit Velocity</span>
              <h4 className="text-2xl font-bold text-amber-500 font-mono">
                {stats.completionRate}%
              </h4>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
              <Hourglass className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Right timeline section */}
        <div className="lg:col-span-7 bg-[#09090c]/80 border border-zinc-900 rounded-3xl p-6">
          <div className="flex items-center justify-between border-b border-zinc-900/80 pb-4 mb-4">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Brain Logging Stream</span>
            <span className="text-[10px] font-mono text-zinc-550">Streaming indicators live</span>
          </div>

          {activityLogs.length === 0 ? (
            <div className="py-12 text-center text-zinc-550 border border-dashed border-zinc-900 rounded-2xl">
              <ActivityIcon className="h-5 w-5 text-zinc-700 mx-auto mb-2" />
              <span className="text-xs">No active streams monitored in past 24 hrs.</span>
            </div>
          ) : (
            <div className="space-y-5 relative pl-4 before:absolute before:left-1.5 before:top-1.5 before:bottom-1 before:w-px before:bg-zinc-900">
              {activityLogs.map((log) => (
                <div key={log.id} className="relative flex items-start gap-4 text-xs group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[14.5px] h-2 w-2 rounded-full bg-zinc-800 group-hover:bg-indigo-400 border border-zinc-950 transition-colors mt-1.5" />
                  
                  {/* Log contents */}
                  <div className="p-1 flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="h-7 w-7 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                      {getLogIcon(log.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-zinc-200 tracking-tight truncate max-w-[210px]">{log.title}</h5>
                        <span className="text-[9px] font-mono text-zinc-500">{log.timestamp}</span>
                      </div>
                      {log.details && (
                        <p className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-sm font-light">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
