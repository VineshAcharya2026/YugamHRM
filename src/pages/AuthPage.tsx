import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  School, 
  ArrowRight, 
  Mail, 
  Lock, 
  Globe, 
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';

type AuthRole = 'admin' | 'candidate' | 'alumnus';

export const AuthPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<AuthRole | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const roles = [
    { 
      id: 'admin' as AuthRole, 
      title: 'HR Portal', 
      desc: 'Manage candidates, see reports, and use hiring tools.', 
      icon: ShieldCheck, 
      color: 'text-blue-600',
      tag: 'ADMIN'
    },
    { 
      id: 'candidate' as AuthRole, 
      title: 'Candidates', 
      desc: 'Build resumes, apply for roles, and track your jobs.', 
      icon: Briefcase, 
      color: 'text-windows-accent',
      tag: 'CANDIDATE'
    },
    { 
      id: 'alumnus' as AuthRole, 
      title: 'Alumni', 
      desc: 'Working with us? Track your job status and referrals.', 
      icon: School, 
      color: 'text-green-600',
      tag: 'PLACED'
    }
  ];

  return (
    <div className="min-h-screen bg-windows-bg flex flex-col items-center justify-center p-4 selection:bg-windows-accent selection:text-white font-sans">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          <motion.div 
            key="role-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-6xl w-full"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-windows-accent text-white flex items-center justify-center shadow-xl rotate-3">
                  <LayoutDashboard size={24} />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-[#1f1f1f]">YugamCloud <span className="opacity-40 font-medium">HRM</span></h1>
              </div>
              <p className="text-sm font-semibold text-black/40 uppercase tracking-[0.3em]">Smart Career Tools for Everyone</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {roles.map((role, idx) => (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role.id)}
                  className="windows-card p-10 text-left group transition-all hover:ring-4 hover:ring-windows-accent/10"
                >
                  <div className={cn("p-4 rounded-2xl mb-8 w-fit shadow-sm", role.color.replace('text', 'bg').replace('600', '50'))}>
                    <role.icon className={role.color} size={32} />
                  </div>
                  <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-2">{role.tag}</p>
                  <h3 className="text-2xl font-bold text-[#1f1f1f] mb-4 group-hover:text-windows-accent transition-colors">{role.title}</h3>
                  <p className="text-sm leading-relaxed text-black/50 mb-8">{role.desc}</p>
                  <div className="flex items-center space-x-2 text-xs font-bold text-windows-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>GO TO PORTAL</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-20 text-center text-[10px] font-bold text-black/20 uppercase tracking-widest">
              Secure Login System
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <div className="windows-card p-10 bg-white/70 backdrop-blur-xl border-white shadow-2xl">
              <button 
                onClick={() => setSelectedRole(null)}
                className="mb-8 text-xs font-bold text-black/40 hover:text-windows-accent flex items-center space-x-2 transition-all"
              >
                <div className="rotate-180"><ArrowRight size={14} /></div>
                <span>GO BACK</span>
              </button>

              <div className="flex items-center space-x-3 mb-8">
                <div className={cn("p-2 rounded-xl bg-windows-accent/10 text-windows-accent")}>
                  {roles.find(r => r.id === selectedRole)?.icon && React.createElement(roles.find(r => r.id === selectedRole)!.icon, { size: 20 })}
                </div>
                <h2 className="text-2xl font-bold text-[#1f1f1f]">
                  {isLogin ? roles.find(r => r.id === selectedRole)?.title : 'Create Account'}
                </h2>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/40 px-1 uppercase tracking-tighter">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={18} />
                    <input 
                      type="email" 
                      required 
                      className="windows-input w-full !pl-12" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black/40 px-1 uppercase tracking-tighter">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={18} />
                    <input 
                      type="password" 
                      required 
                      className="windows-input w-full !pl-12" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <span>Access Denied: {error}</span>
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="windows-button-primary w-full py-3.5 flex items-center justify-center space-x-2 shadow-lg hover:translate-y-[-2px] transition-all"
                >
                  <Globe size={18} />
                  <span>{loading ? 'WAITING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
                </button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
                <div className="relative flex justify-center text-xs font-bold"><span className="bg-white/80 px-4 text-black/20">OR CONTINUITY</span></div>
              </div>

              <button 
                onClick={handleGoogleSignIn}
                className="windows-button-secondary w-full py-3 flex items-center justify-center space-x-3 text-xs"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa_loader/google.svg" className="w-4 h-4" alt="Google" />
                <span>SIGN IN WITH GOOGLE</span>
              </button>

              <p className="mt-10 text-center text-xs font-medium text-black/40">
                {isLogin ? "No access key?" : "Already verified?"}{' '}
                <button onClick={() => setIsLogin(!isLogin)} className="text-windows-accent font-bold hover:underline">
                  {isLogin ? 'Initialize Profile' : 'Access Portal'}
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
