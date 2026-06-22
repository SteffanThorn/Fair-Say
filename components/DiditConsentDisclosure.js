'use client';

import { useState } from 'react';
import Link from 'next/link';

// Disclosure version shown to the user — update this string when the disclosure text changes.
// The version is logged to consent_log alongside the acceptance timestamp.
const DISCLOSURE_VERSION = '2025-11-01';

export default function DiditConsentDisclosure({ onAccept, onCancel }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleAccept() {
    setSubmitting(true);
    setError('');
    try {
      await fetch('/api/consent/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentType: 'didit_biometric_disclosure',
          disclosureVersion: DISCLOSURE_VERSION,
        }),
      });
      // Proceed regardless of logging outcome — the user accepted, don't block them.
    } catch {
      // Non-fatal — consent logging failure should not prevent verification.
    }
    setSubmitting(false);
    onAccept();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1a2d] shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="p-6 sm:p-7">
          <h2 className="text-lg font-semibold text-white mb-1">
            Before you continue — what happens when you verify your NZ passport
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            You're about to scan your NZ passport and complete a short liveness check. Here's exactly what happens:
          </p>

          <ul className="space-y-2.5 mb-5">
            {[
              'Your passport scan is processed by Didit, our verification partner — not by Fair Say.',
              'Fair Say never receives your passport image, biometric data, or passport number.',
              'Didit returns only: "NZ passport verified" or "not verified."',
              'We store a one-way code (like a fingerprint of a fingerprint) that confirms you\'ve verified. It cannot identify you.',
              'Your verification cannot be linked to your votes or any activity on Fair Say.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="mt-0.5 text-emerald-400 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="space-y-3 text-xs text-slate-400 leading-relaxed border-t border-white/8 pt-4">
            <p>
              <span className="text-slate-300 font-medium">Why we ask for this:</span>{' '}
              Fair Say polls are for NZ citizens. A NZ passport is the only document that directly confirms citizenship — a driver's licence or proof-of-age card confirms residency only.
            </p>
            <p>
              <span className="text-slate-300 font-medium">Cost:</span>{' '}
              $2 NZD, charged only on successful verification. This covers Didit's fee, passed on at cost.
            </p>
            <p>
              <span className="text-slate-300 font-medium">Alternatives:</span>{' '}
              If you don't have a NZ passport, you can still use Fair Say with email and vote in any poll. Verification is optional — it means your responses are included in the Verified NZ Citizens filter on poll results, so your voice is counted as distinctly Kiwi.
            </p>
            <p>
              <span className="text-slate-300 font-medium">Your rights:</span>{' '}
              You can request deletion of your verification record at any time by deleting your account.
              Questions?{' '}
              <a href="mailto:privacy@fair-say.nz" className="text-cyan-400 hover:underline">
                privacy@fair-say.nz
              </a>
              {' · '}
              <Link href="/privacy" className="text-cyan-400 hover:underline" target="_blank">
                Privacy policy
              </Link>
            </p>
          </div>

          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 rounded-lg border border-white/15 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={submitting}
              className="flex-1 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-50"
            >
              {submitting ? 'Loading…' : 'I understand — continue to verification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
