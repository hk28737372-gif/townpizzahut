import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Mail, Lock, User, ArrowRight, Loader2, Key } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Google OAuth message dispatcher handler
  useEffect(() => {
    const handleGoogleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Accept origin matching current page secure protocol or localhost
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { user: authUser, token: authToken } = event.data;
        if (authUser && authToken) {
          onSuccess(authUser, authToken);
          onClose();
        }
      }
    };

    window.addEventListener('message', handleGoogleMessage);
    return () => window.removeEventListener('message', handleGoogleMessage);
  }, [onSuccess, onClose]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) {
        throw new Error('Failed to retrieve secure Google authentication URL endpoint.');
      }
      const { url } = await response.json();
      
      const authWindow = window.open(
        url,
        'google_oauth_popup',
        'width=500,height=600'
      );

      if (!authWindow) {
        setError('Popup was blocked. Please enable popups in your browser settings to authenticate.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google SSO protocol.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError('Please fill in all core credentials.');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Please provide your name to register your profile.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignUp 
        ? { email: email.trim(), name: name.trim(), password }
        : { email: email.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server validation error. Please check parameters.');
      }

      // Success callback
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Connecting to Nexa core ledger failed. Ensure backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in" 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-md bg-[#0a0a0d] border border-[#1d1c25] rounded-2.5xl shadow-2xl relative overflow-hidden p-6 sm:p-8 z-10"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-mono tracking-widest uppercase font-bold text-zinc-400">
              {isSignUp ? 'REGISTER PLATFORM' : 'LAUNCH KEY'}
            </span>
          </div>
          <button
            type="button"
            id="auth-modal-close"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {isSignUp ? 'Create your Nexa OS brain' : 'Welcome back to Nexa'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-light leading-normal">
            {isSignUp 
              ? 'Begin mapping your digital second brain assets, goals, and outline structures securely.' 
              : 'Supply your personal executive credentials to unlock the digital dashboard.'
            }
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="auth-name" className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1.5 font-bold">Your Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-zinc-550" />
                <input
                  type="text"
                  id="auth-name"
                  placeholder="e.g. Founder Operator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950/70 border border-zinc-900 focus:border-indigo-505/40 text-xs rounded-xl pl-11 pr-4 py-3 placeholder-zinc-600 text-zinc-250 focus:outline-none focus:ring-0"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1.5 font-bold">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-550" />
              <input
                type="email"
                id="auth-email"
                placeholder="operator@lifeadmin.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950/70 border border-zinc-900 focus:border-indigo-505/40 text-xs rounded-xl pl-11 pr-4 py-3 placeholder-zinc-600 text-zinc-250 focus:outline-none focus:ring-0"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-1.5 font-bold">Secret Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-550" />
              <input
                type="password"
                id="auth-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/70 border border-zinc-900 focus:border-indigo-505/40 text-xs rounded-xl pl-11 pr-4 py-3 placeholder-zinc-600 text-zinc-250 focus:outline-none focus:ring-0"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-650/10 cursor-pointer disabled:opacity-50 transition-all font-mono tracking-wider uppercase mt-6"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                {isSignUp ? 'Register Account' : 'Authenticate Security'}
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-5 block">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-900"></div>
          </div>
          <span className="relative px-3 bg-[#0a0a0d] text-[10px] font-mono tracking-widest text-[#52525b] uppercase font-bold">OR CONTINUE WITH GOOGLE</span>
        </div>

        <button
          type="button"
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-zinc-950/40 hover:bg-zinc-900 border border-zinc-900 text-zinc-350 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 transition-all font-mono tracking-wider uppercase"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          ) : (
            <>
              <svg className="h-4 w-4 mr-0.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.516 5.516 0 0 1 8.5 13c0-3.037 2.463-5.5 5.5-5.5c1.4 0 2.67.525 3.642 1.383l3.073-3.073C18.847 3.992 16.59 3 14 3C8.5 3 4 7.5 4 13s4.5 10 10 10c5.5 0 10-4.5 10-10c0-.682-.078-1.343-.223-1.983L12.24 10.285z" />
              </svg>
              Sign In with Google
            </>
          )}
        </button>

        <div className="mt-6 pt-5 border-t border-zinc-900 flex justify-between items-center text-xs font-light">
          <span className="text-zinc-500">
            {isSignUp ? 'Already mapped?' : 'New operator?'}
          </span>
          <button
            type="button"
            id="auth-toggle-btn"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline decoration-indigo-400/30 underline-offset-4"
          >
            {isSignUp ? 'Sign in here' : 'Sign up for free'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
