'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { resetPasswordApi } from '@/lib/api/auth';
import { useModal } from '@/context/ModalContext';

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { openModal } = useModal();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordApi(token, password);
      setDone(true);
      toast.success('Password reset successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {!token ? (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-3" />
            <h1 className="text-lg font-semibold text-gray-800">Invalid reset link</h1>
            <p className="text-sm text-gray-500 mt-1">This link is missing its token or is malformed. Please request a new password reset.</p>
            <Link href="/" className="mt-5 inline-block bg-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-primary/90">
              Back to Home
            </Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
            <h1 className="text-lg font-semibold text-gray-800">Password reset</h1>
            <p className="text-sm text-gray-500 mt-1">Your password has been updated. You can now sign in with your new password.</p>
            <button
              onClick={() => { router.push('/'); openModal('login'); }}
              className="mt-5 inline-block bg-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-primary/90"
            >
              Sign in
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-900">Set a new password</h1>
            <p className="text-sm text-gray-500 mt-1 mb-6">Choose a strong password you don&apos;t use elsewhere.</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-10`}
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
