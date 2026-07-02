'use client';

import { useState } from 'react';

export default function BroadcastPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successCount, setSuccessCount] = useState(0);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send broadcast');
      }

      setSuccessCount(data.count || 0);
      setStatus('success');
      setSubject('');
      setBody('');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
          Broadcast Email
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Compose and send an email to everyone on the waitlist.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl overflow-hidden p-6 sm:p-8">
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Broadcast Sent Successfully!</h3>
            <p className="text-gray-500 mb-6">Your message was sent to {successCount} subscribers.</p>
            <button
              onClick={() => setStatus('idle')}
              className="bg-gray-100 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="flex flex-col gap-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                id="subject"
                required
                disabled={status === 'loading'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Exciting news from Koyitech Africa!"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#5C4FFF] focus:border-[#5C4FFF] outline-none disabled:opacity-60 transition-all"
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-semibold text-gray-900 mb-2">
                Message Body
              </label>
              <textarea
                id="body"
                required
                disabled={status === 'loading'}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email content here. You can use multiple paragraphs..."
                rows={10}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#5C4FFF] focus:border-[#5C4FFF] outline-none disabled:opacity-60 transition-all resize-y"
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
                {errorMessage}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#5C4FFF] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#4b40e6] transition-all flex items-center justify-center min-w-[150px] disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Broadcast'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
