'use client';

import { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { axiosHomePublic } from '@/services/axiosHomeService';
import { toast } from 'sonner';
import { X, Eye, EyeOff, Loader2, CheckCircle2, XCircle, ArrowLeft, MailCheck } from 'lucide-react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { forgotPasswordApi } from '@/lib/api/auth';

// Must match backend registerSchema password rules
const PWD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$%^&*)', test: (p: string) => /[!@#$%^&*()]/.test(p) },
];

function extractError(err: any): string {
  const data = err?.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (Array.isArray(data.details) && data.details.length > 0) {
    return data.details.map((d: any) => d.message).join(' · ');
  }
  return data.message || data.error || 'Request failed';
}

export default function AuthModal() {
  const { modalType, closeModal, openModal } = useModal();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPwdHints, setShowPwdHints] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot-password flow (within the login view)
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupContact, setSignupContact] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  if (!modalType) return null;

  const pwdValid = PWD_RULES.every((r) => r.test(signupPassword));

  const handleGoogleSuccess = async (credential: string) => {
    setLoading(true);
    try {
      const { data } = await axiosHomePublic.post('/accounts/google-login', { credential });
      if (data.accessToken) {
        login(data.accessToken, data.user, data.refreshToken);
        toast.success('Welcome!');
        closeModal();
      } else {
        toast.error('Google login failed');
      }
    } catch (err: any) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosHomePublic.post('/accounts/login', {
        email: loginEmail,
        password: loginPassword,
      });
      if (data.accessToken) {
        login(data.accessToken, data.user, data.refreshToken);
        toast.success('Welcome back!');
        closeModal();
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err: any) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdValid) {
      toast.error('Password does not meet all requirements');
      setShowPwdHints(true);
      return;
    }
    // Normalise contact: strip spaces/dashes, prepend +91 if bare 10 digits
    let contact = signupContact.replace(/[\s\-]/g, '');
    if (/^\d{10}$/.test(contact)) contact = `+91${contact}`;

    setLoading(true);
    try {
      await axiosHomePublic.post('/accounts/register/customer', {
        name: signupName,
        email: signupEmail,
        contact,
        password: signupPassword,
        role: 'CUSTOMER',
      });
      toast.success('Account created! Please sign in.');
      setSignupName(''); setSignupEmail(''); setSignupContact(''); setSignupPassword('');
      openModal('login');
    } catch (err: any) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(forgotEmail.trim());
      setForgotSent(true);
    } catch (err: any) {
      toast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const switchTo = (type: 'login' | 'signup') => {
    setShowPassword(false);
    setShowPwdHints(false);
    setForgotMode(false);
    setForgotSent(false);
    openModal(type);
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <button onClick={closeModal} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 z-10">
          <X size={18} />
        </button>
        <div className="p-8">
          <div className="mb-6">
            <Image src="/logo.png" width={160} height={50} alt="Skillocraft" className="h-10 w-auto" />
            <p className="text-sm text-gray-500 mt-2">
              {modalType === 'login' ? 'Welcome back! Sign in to continue learning.' : 'Join Skillocraft and start your learning journey.'}
            </p>
          </div>

          {modalType === 'login' ? (
            forgotMode ? (
              <div className="space-y-4">
                {forgotSent ? (
                  <div className="text-center py-4">
                    <MailCheck className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
                    <h3 className="font-semibold text-gray-800">Check your email</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      If an account exists for <span className="font-medium">{forgotEmail}</span>, we&apos;ve sent a password reset link. It expires in 60 minutes.
                    </p>
                    <button type="button" onClick={() => { setForgotMode(false); setForgotSent(false); }} className="mt-4 inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
                      <ArrowLeft size={14} /> Back to sign in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <button type="button" onClick={() => setForgotMode(false)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-800">Reset your password</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Enter your account email and we&apos;ll send you a reset link.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {loading ? 'Sending…' : 'Send reset link'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Your password" className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="text-right -mt-1">
                <button type="button" onClick={() => { setForgotMode(true); setForgotSent(false); setForgotEmail(loginEmail); }} className="text-xs text-primary font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors mt-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <GoogleSignInButton onCredential={handleGoogleSuccess} disabled={loading} />
              <p className="text-center text-sm text-gray-500 pt-1">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => switchTo('signup')} className="text-primary font-semibold hover:underline">Sign up free</button>
              </p>
            </form>
            )
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Your full name" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" required value={signupContact} onChange={(e) => setSignupContact(e.target.value)} placeholder="10-digit mobile number" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Enter 10-digit number — +91 is added automatically</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => { setSignupPassword(e.target.value); setShowPwdHints(true); }}
                    placeholder="Create a strong password"
                    className={`${inputClass} pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {showPwdHints && (
                  <ul className="mt-2 space-y-1">
                    {PWD_RULES.map((rule) => {
                      const ok = rule.test(signupPassword);
                      return (
                        <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors mt-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <GoogleSignInButton onCredential={handleGoogleSuccess} disabled={loading} />
              <p className="text-center text-sm text-gray-500 pt-1">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTo('login')} className="text-primary font-semibold hover:underline">Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Google Sign-In button ─────────────────────────────────────────────────────
// Renders a native Google One-Tap / popup button via the GSI library.
// Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local and the Google script.
function GoogleSignInButton({
  onCredential,
  disabled,
}: {
  onCredential: (credential: string) => void;
  disabled: boolean;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleClick = () => {
    if (!clientId) {
      alert('Google login is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local');
      return;
    }
    // Load the Google Identity Services script if not already loaded
    if (!(window as any).google?.accounts) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => initGooglePrompt(clientId, onCredential);
      document.head.appendChild(script);
    } else {
      initGooglePrompt(clientId, onCredential);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>
  );
}

function initGooglePrompt(clientId: string, onCredential: (c: string) => void) {
  (window as any).google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: { credential: string }) => {
      onCredential(response.credential);
    },
  });
  (window as any).google.accounts.id.prompt();
}
