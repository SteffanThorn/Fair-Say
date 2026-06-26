'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import MemberMark from './MemberMark';

const NAV_LINKS = [
  { href: '/',           label: 'Home',         icon: '🏠' },
  { href: '/news',       label: 'Grounded News', icon: '📰' },
  { href: '/parties',   label: 'Parties',       icon: '🗳️'  },
  { href: '/policies',  label: 'Policies',      icon: '📋' },
  { href: '/mps',        label: 'MPs',           icon: '🏛️' },
  { href: '/civics',     label: 'Civics',        icon: '📚' },
  { href: '/learn',      label: 'Learn',         icon: '🎓', showDot: true },
  { href: '/polls',      label: 'Polls',         icon: '📊' },
  { href: '/events',     label: 'Events',        icon: '📅' },
  { href: '/newsletter', label: 'Newsletter',    icon: '✉️'  },
];

function NavLink({ href, label, icon, onClick, showIndicator }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="flex-1">{label}</span>
      {showIndicator && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" aria-label="New" />
      )}
    </Link>
  );
}

export default function Sidebar({ session }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnDot, setLearnDot] = useState(false);
  const pathname = usePathname();

  // Fetch account state to determine whether to show the Learn indicator dot.
  // Re-fetches on pathname change so navigating away from /learn clears the dot.
  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/account/state')
      .then((r) => r.json())
      .then((data) => {
        const isVerified = data.credentialTier === 'verified_nz_citizen';
        const unseen = !data.learnSneakPeekViewedAt;
        setLearnDot(isVerified && unseen);
      })
      .catch(() => {});
  }, [session?.user?.id, pathname]);

  const closeMobile = () => setMobileOpen(false);

  // Landing page has its own nav — hide sidebar there
  if (pathname === '/') return null;

  const navContent = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          {...link}
          onClick={closeMobile}
          showIndicator={link.showDot && learnDot}
        />
      ))}

      <div className="mt-4 border-t border-white/10 pt-4">
        {session?.user ? (
          <div className="space-y-2">
            <Link
              href="/dashboard"
              onClick={closeMobile}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="text-base leading-none">⚙️</span>
              <span className="flex-1">My Account</span>
              {session.user.authMethod && (
                <MemberMark authMethod={session.user.authMethod} />
              )}
            </Link>
            {session.user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-300 hover:bg-amber-500/10 transition-colors"
              >
                <span className="text-base leading-none">🛡️</span>
                Admin
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2 px-3">
            <Link
              href="/auth/signin"
              onClick={closeMobile}
              className="block rounded-lg border border-white/15 px-4 py-2 text-center text-sm text-white hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              onClick={closeMobile}
              className="block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-500"
            >
              Join free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-55 flex-col border-r border-white/8 bg-[#080f1e]/95 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <span className="text-xl">🌿</span>
          <div>
            <p className="text-sm font-bold tracking-wide text-white">Fair Say NZ</p>
            <p className="text-[10px] text-slate-400 leading-tight">Better civic info</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">{navContent}</div>
        <div className="border-t border-white/8 px-5 py-3">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Everyone gets a fair say. · NZ-focused
          </p>
          <Link href="/privacy" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/8 bg-[#080f1e]/95 px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌿</span>
          <span className="text-sm font-bold text-white">Fair Say NZ</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-slate-300 hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-72 border-r border-white/8 bg-[#080f1e] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <p className="text-sm font-bold text-white">Fair Say NZ</p>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}
