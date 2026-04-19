import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Shield, Loader2, ArrowRight } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      if (loginMethod === 'google') {
        await signInWithPopup(auth, new GoogleAuthProvider());
      } else {
        if (!email || !password) {
          toast.error("Please enter credentials");
          setLoading(false);
          return;
        }
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      toast.success("Identity Verified");
      navigate('/admin');
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error("Account creation or provider is not enabled in Firebase Console.");
      } else if (error.code === 'auth/admin-restricted-operation') {
        toast.error(
          "Access Restricted: Your project settings block user registration. Please check 'User actions' in Firebase Console -> Identity Platform.",
          { duration: 8000 }
        );
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in popup was closed.");
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/5 to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-brand-secondary/5 to-transparent -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 mb-8">
            <Shield className="h-8 w-8 text-brand-primary" />
          </div>
          <h1 className="text-4xl font-serif mb-3 tracking-tight">Executive <span className="italic text-gray-400">Portal</span></h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.2em] opacity-60">Admin Authentication</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-50 relative">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-10 border border-gray-100">
            <button 
              onClick={() => setLoginMethod('google')}
              className={cn(
                "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                loginMethod === 'google' ? "bg-white shadow-md text-brand-primary" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Google Access
            </button>
            <button 
              onClick={() => setLoginMethod('email')}
              className={cn(
                "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                loginMethod === 'email' ? "bg-white shadow-md text-brand-primary" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Direct Login
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginMethod === 'email' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Email Principal</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nextgen.com"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none text-sm transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Access Token</label>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none text-sm transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full group py-5 bg-gray-900 text-white rounded-full font-bold flex items-center justify-center space-x-3 hover:bg-brand-primary transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>{loginMethod === 'google' ? "Continue with Google" : "Authorize Access"}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em] leading-relaxed">
            Proprietary Access Controlled by <br /> NextGen Security Protocols
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 text-xs font-semibold hover:text-brand-primary transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <span className="opacity-50">Return to</span>
            <span className="font-serif italic border-b border-gray-200">Public Site</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
