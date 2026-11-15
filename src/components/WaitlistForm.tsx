'use client';

import { useState, useEffect } from 'react';

const DEFAULT_LOGIN_URL =
  process.env.NEXT_PUBLIC_CLASSROOM_LOGIN_URL || 'https://koyitech.africa/login';

export default function WaitlistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [classroomLoginUrl, setClassroomLoginUrl] = useState(DEFAULT_LOGIN_URL);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_CLASSROOM_LOGIN_URL &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ) {
      setClassroomLoginUrl('http://localhost:3000/login');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(
          errorData.error || `Failed to join Cohort I (HTTP ${response.status})`
        );
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } catch (error: any) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full py-2 animate-fade-in-up">
        <div className="p-5 rounded-2xl bg-[#5C4FFF]/10 border-2 border-[#5C4FFF]/20 text-[#181059] flex flex-col items-center text-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#5C4FFF] flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-black text-lg leading-tight text-[#181059]">
              Account Created &amp; Seat Reserved!
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1.5 leading-relaxed">
              Your Cohort I student account is ready. Log in with your email and password to enter the Koyitech Africa classroom and attend classes.
            </p>
          </div>

          <a
            href={classroomLoginUrl}
            className="w-full bg-[#5C4FFF] text-white px-6 py-3 mt-1 rounded-2xl font-black tracking-wide hover:bg-[#4b40e6] hover:shadow-[0_8px_20px_rgba(92,79,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>LOGIN &amp; ATTEND CLASSES</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-xs font-bold text-gray-500 hover:text-[#5C4FFF] transition-colors mt-1"
          >
            Register another student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
        {/* Name Input */}
        <div className="relative flex w-full bg-white border-2 border-gray-200 rounded-xl focus-within:border-[#5C4FFF] focus-within:shadow-[0_6px_16px_rgba(92,79,255,0.15)] transition-all duration-300 overflow-hidden shadow-sm">
          <div className="pl-3.5 pr-1.5 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="w-full bg-transparent text-[#181059] px-2 py-2 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-sm"
          />
        </div>

        {/* Email Input */}
        <div className="relative flex w-full bg-white border-2 border-gray-200 rounded-xl focus-within:border-[#5C4FFF] focus-within:shadow-[0_6px_16px_rgba(92,79,255,0.15)] transition-all duration-300 overflow-hidden shadow-sm">
          <div className="pl-3.5 pr-1.5 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="w-full bg-transparent text-[#181059] px-2 py-2 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-sm"
          />
        </div>

        {/* Phone Input */}
        <div className="relative flex w-full bg-white border-2 border-gray-200 rounded-xl focus-within:border-[#5C4FFF] focus-within:shadow-[0_6px_16px_rgba(92,79,255,0.15)] transition-all duration-300 overflow-hidden shadow-sm">
          <div className="pl-3.5 pr-1.5 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number (Optional)"
            disabled={status === 'loading'}
            className="w-full bg-transparent text-[#181059] px-2 py-2 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-sm"
          />
        </div>

        {/* Password Input */}
        <div className="relative flex w-full bg-white border-2 border-gray-200 rounded-xl focus-within:border-[#5C4FFF] focus-within:shadow-[0_6px_16px_rgba(92,79,255,0.15)] transition-all duration-300 overflow-hidden shadow-sm">
          <div className="pl-3.5 pr-1.5 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password (min. 6 chars)"
            required
            minLength={6}
            disabled={status === 'loading'}
            className="w-full bg-transparent text-[#181059] px-2 py-2 outline-none placeholder:text-gray-400 font-bold focus:ring-0 disabled:opacity-50 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="pr-3.5 pl-1.5 flex items-center text-gray-400 hover:text-[#5C4FFF] transition-colors"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#5C4FFF] text-white px-6 py-2.5 mt-0.5 rounded-xl font-black tracking-wide hover:bg-[#4b40e6] hover:shadow-[0_8px_20px_rgba(92,79,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-w-[140px] text-sm"
        >
          {status === 'loading' ? (
            <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            'JOIN COHORT I'
          )}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-red-500 text-xs mt-1.5 px-2 text-center font-medium leading-tight">
          {errorMessage}
        </p>
      )}

      <p className="text-center text-xs text-gray-500 font-semibold mt-2">
        Already registered?{' '}
        <a
          href={classroomLoginUrl}
          className="text-[#5C4FFF] font-black hover:underline"
        >
          Login to Classroom &rarr;
        </a>
      </p>
    </div>
  );
}
