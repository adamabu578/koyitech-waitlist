'use client';

import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="w-full">
      {status === 'success' && (
        <div className="p-4 mb-4 rounded-2xl bg-[#5C4FFF]/10 border-2 border-[#5C4FFF]/20 text-[#181059] animate-fade-in-up flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#5C4FFF] flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-black text-base leading-tight">Application Received!</p>
            <p className="text-xs font-medium opacity-70">You are on the priority list. Watch your inbox.</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center w-full gap-3">
        <div className="relative flex w-full bg-white border-2 border-gray-200 rounded-2xl focus-within:border-[#5C4FFF] focus-within:shadow-[0_8px_20px_rgba(92,79,255,0.15)] transition-all duration-300 overflow-hidden shadow-sm">
          <div className="pl-5 pr-2 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            required
            disabled={status === 'loading'}
            className="w-full bg-transparent text-[#181059] px-2 py-3 sm:py-4 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-base sm:text-lg"
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto bg-[#5C4FFF] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black tracking-wide hover:bg-[#4b40e6] hover:shadow-[0_8px_20px_rgba(92,79,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-w-[140px] text-sm sm:text-base"
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'JOIN WAITLIST'
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-500 text-sm mt-2 px-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
