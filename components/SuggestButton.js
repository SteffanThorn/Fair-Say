'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function SuggestButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const openModal = useCallback(() => {
    setStatus('idle');
    setErrorMsg('');
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setSuggestion('');
    setEmail('');
    setStatus('idle');
    setErrorMsg('');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestion,
          contact_email: email || undefined,
          page: pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg('Network error — please try again.');
      setStatus('error');
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        onClick={openModal}
        aria-label="Suggest an update"
        data-tutorial="suggest"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-500/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 10c0 3.866-3.582 7-8 7a8.84 8.84 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
        </svg>
        Suggest
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: '#0d1627', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">Suggest an update</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Spotted something wrong, missing, or worth adding? Let us know.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {status === 'success' ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-5 py-6 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-sm font-semibold text-emerald-300">Thanks — suggestion received!</p>
                <p className="mt-1 text-xs text-slate-400">We review all suggestions and update the site regularly.</p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-4 rounded-lg bg-white/8 px-4 py-2 text-sm text-slate-300 hover:bg-white/12"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300" htmlFor="suggestion-text">
                    Your suggestion
                  </label>
                  <textarea
                    id="suggestion-text"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="e.g. The Green Party housing policy is outdated — their 2024 announcement changed it to…"
                    rows={5}
                    maxLength={2000}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/4 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
                  />
                  <p className="mt-1 text-right text-[10px] text-slate-600">
                    {suggestion.length}/2000
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300" htmlFor="suggestion-email">
                    Email <span className="text-slate-500 font-normal">(optional — if you'd like a reply)</span>
                  </label>
                  <input
                    id="suggestion-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/4 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400">{errorMsg}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'submitting' || !suggestion.trim()}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send suggestion'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
