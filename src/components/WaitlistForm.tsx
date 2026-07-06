'use client';

import { useState } from 'react';

export default function WaitlistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.error || 'Failed to join waitlist');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
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
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
        {/* Name Input */}
        <div className="relative flex w-full bg-white border-2 border-gray-200 rounded-2xl focus-within:border-[#5C4FFF] focus-within:shadow-[0_8px_20px_rgba(92,79,255,0.15)] transition-all duration-300 overflow-hidden shadow-sm">
          <div className="pl-5 pr-2 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            disabled={status === 'loading'}
            className="w-full bg-transparent text-[#181059] px-2 py-2 sm:py-2.5 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-sm sm:text-base"
          />
        </div>

        {/* Email Input */}
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
            placeholder="Email Address"
            required
            disabled={status === 'loading'}
            className="w-full bg-transparent text-[#181059] px-2 py-2 sm:py-2.5 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-sm sm:text-base"
          />
        </div>

        {/* Phone Input */}
        <div className="relative flex w-full bg-white border-2 border-gray-200 rounded-2xl focus-within:border-[#5C4FFF] focus-within:shadow-[0_8px_20px_rgba(92,79,255,0.15)] transition-all duration-300 overflow-hidden shadow-sm">
          <div className="pl-5 pr-2 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number (Optional)"
            disabled={status === 'loading'}
            className="w-full bg-transparent text-[#181059] px-2 py-2 sm:py-2.5 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-sm sm:text-base"
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#5C4FFF] text-white px-6 py-2.5 sm:py-3 mt-1 rounded-2xl font-black tracking-wide hover:bg-[#4b40e6] hover:shadow-[0_8px_20px_rgba(92,79,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-w-[140px] text-sm sm:text-base"
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'JOIN WAITLIST'
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-500 text-sm mt-2 px-2 text-center font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
