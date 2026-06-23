import Link from 'next/link';

export const metadata = {
  title: 'Fair Say NZ — Everyone gets a fair say.',
};

const HISTORY_MOMENTS = [
  { year: '1840', title: 'Treaty of Waitangi', note: 'Founding document of NZ' },
  { year: '1893', title: "Women's Suffrage", note: 'First country in the world' },
  { year: '1975', title: 'Land March', note: 'Māori land rights movement' },
  { year: '1987', title: 'Nuclear Free NZ', note: 'NZ bans nuclear ships' },
];

function KoruSvg() {
  return (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Stem */}
      <path d="M55,105 C55,105 52,85 55,70" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Spiral body */}
      <path
        d="M55,70 C55,70 42,65 38,52 C34,39 42,28 54,30 C66,32 70,44 62,52 C54,60 44,55 44,47 C44,39 52,37 56,42 C60,47 57,53 53,53"
        stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" fill="none"
      />
      {/* Tip circle */}
      <circle cx="53" cy="54" r="3" fill="#10b981" opacity="0.7"/>
      {/* Decorative fronds */}
      <path d="M55,80 Q65,76 68,70" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M55,88 Q45,84 42,78" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function KiwiBirdSvg() {
  return (
    <svg viewBox="0 0 210 185" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <ellipse cx="88" cy="108" rx="60" ry="52" fill="#059669" opacity="0.85"/>
      {/* Feather texture */}
      <path d="M38,102 Q68,88 108,102" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.35" fill="none"/>
      <path d="M32,114 Q64,100 112,114" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.35" fill="none"/>
      <path d="M36,126 Q68,112 112,126" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.3" fill="none"/>
      {/* Head */}
      <circle cx="136" cy="82" r="31" fill="#059669" opacity="0.85"/>
      {/* Eye */}
      <circle cx="147" cy="74" r="5.5" fill="#022c22"/>
      <circle cx="148.5" cy="72.5" r="2" fill="white" opacity="0.75"/>
      {/* Long bill */}
      <path d="M164,78 Q182,73 205,67" stroke="#34d399" strokeWidth="5" strokeLinecap="round"/>
      <path d="M164,81 Q182,76 205,70" stroke="#059669" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      {/* Legs */}
      <line x1="73" y1="157" x2="62" y2="178" stroke="#059669" strokeWidth="6" strokeLinecap="round"/>
      <line x1="98" y1="157" x2="109" y2="178" stroke="#059669" strokeWidth="6" strokeLinecap="round"/>
      {/* Toes left */}
      <line x1="62" y1="178" x2="45" y2="173" stroke="#059669" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="62" y1="178" x2="50" y2="184" stroke="#059669" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="62" y1="178" x2="68" y2="185" stroke="#059669" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Toes right */}
      <line x1="109" y1="178" x2="126" y2="173" stroke="#059669" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="109" y1="178" x2="121" y2="184" stroke="#059669" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="109" y1="178" x2="103" y2="185" stroke="#059669" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  );
}

function NZMapSvg() {
  return (
    <svg viewBox="0 0 90 185" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* North Island */}
      <path
        d="M46,4 L56,10 L62,22 L58,36 L65,52 L62,67 L54,77 L43,82 L32,77 L26,64 L20,50 L18,38 L26,24 L34,13 Z"
        fill="#10b981" opacity="0.55" stroke="#6ee7b7" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* Cook Strait (gap) */}
      {/* South Island */}
      <path
        d="M54,97 L64,94 L72,102 L74,118 L70,136 L62,152 L50,162 L36,165 L24,157 L17,141 L16,124 L22,108 L34,97 L46,94 Z"
        fill="#10b981" opacity="0.48" stroke="#6ee7b7" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* Stewart Island */}
      <ellipse cx="38" cy="175" rx="7" ry="5" fill="#10b981" opacity="0.4" stroke="#6ee7b7" strokeWidth="1"/>
      {/* Southern Cross stars */}
      <circle cx="14" cy="18" r="1.5" fill="#6ee7b7" opacity="0.7"/>
      <circle cx="8" cy="28" r="1.2" fill="#6ee7b7" opacity="0.6"/>
      <circle cx="80" cy="12" r="1.5" fill="#6ee7b7" opacity="0.7"/>
      <circle cx="84" cy="22" r="1.2" fill="#6ee7b7" opacity="0.6"/>
      <circle cx="76" cy="24" r="1" fill="#6ee7b7" opacity="0.5"/>
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      {/* Tagline */}
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Everyone gets a fair say.
        </h1>
        <p className="mt-3 text-sm text-slate-400">100% neutral · NZ-focused · No party affiliation · No spin</p>
      </div>

      {/* Two-panel layout */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* ── LEFT: Empower Your Say ── */}
        <section className="card flex flex-col rounded-2xl overflow-hidden">
          {/* Historical image collage */}
          <div className="bg-gradient-to-br from-amber-950/50 via-slate-900/60 to-stone-900/40 p-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-amber-400/70">Significant NZ History</p>
            <div className="grid grid-cols-2 gap-2">
              {HISTORY_MOMENTS.map((m) => (
                <div
                  key={m.year}
                  className="group relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-900/15 p-3.5 transition hover:border-amber-400/40 hover:bg-amber-900/25"
                >
                  <p className="text-base font-bold text-amber-400">{m.year}</p>
                  <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-200">{m.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-slate-500">{m.note}</p>
                  <div className="absolute right-2 top-2 h-12 w-12 rounded-full bg-amber-500/5 blur-xl"/>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6 pt-5">
            <h2 className="text-xl font-bold text-white">Empower Your Say</h2>
            <p className="mt-1 mb-5 text-sm text-slate-400">
              Understand NZ civics and the history behind today's issues.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/civics" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 transition hover:border-emerald-500/40 hover:bg-emerald-500/8">
                <span className="text-lg">🏛️</span>
                <div>
                  <p className="text-sm font-medium text-white">Civics</p>
                  <p className="text-xs text-slate-400">How NZ government works</p>
                </div>
                <span className="ml-auto text-emerald-400">→</span>
              </Link>
              <Link href="/history" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 transition hover:border-emerald-500/40 hover:bg-emerald-500/8">
                <span className="text-lg">📜</span>
                <div>
                  <p className="text-sm font-medium text-white">History</p>
                  <p className="text-xs text-slate-400">NZ political history</p>
                </div>
                <span className="ml-auto text-emerald-400">→</span>
              </Link>
              <Link href="/news" className="flex items-center gap-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3.5 transition hover:border-emerald-500/60 hover:bg-emerald-500/18">
                <span className="text-lg">📰</span>
                <div>
                  <p className="text-sm font-medium text-emerald-100">Grounded News</p>
                  <p className="text-xs text-emerald-300/60">NZ news, neutral sources only</p>
                </div>
                <span className="ml-auto text-emerald-400">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── RIGHT: Have Your Say ── */}
        <section className="card flex flex-col rounded-2xl overflow-hidden">
          {/* NZ Imagery */}
          <div className="flex items-end justify-center gap-2 bg-gradient-to-br from-emerald-950/50 via-slate-900/60 to-teal-950/40 px-6 pb-4 pt-6">
            <p className="sr-only">Koru, New Zealand map, and kiwi bird</p>
            {/* Koru */}
            <div className="w-20 h-20 shrink-0" aria-hidden>
              <KoruSvg />
            </div>
            {/* NZ Map */}
            <div className="w-14 h-28 shrink-0" aria-hidden>
              <NZMapSvg />
            </div>
            {/* Kiwi */}
            <div className="w-32 h-28 shrink-0" aria-hidden>
              <KiwiBirdSvg />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6 pt-5">
            <h2 className="text-xl font-bold text-white">Have Your Say</h2>
            <p className="mt-1 mb-5 text-sm text-slate-400">
              Your voice is anonymous. Your impact is real.
            </p>

            <Link href="/polls" className="flex items-center gap-4 rounded-xl border border-emerald-500/40 bg-emerald-500/12 px-5 py-4 transition hover:border-emerald-400/60 hover:bg-emerald-500/20">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-white">Polls</p>
                <p className="text-xs text-emerald-300/70">Have your anonymous say on the issues that matter</p>
              </div>
              <span className="ml-auto text-xl text-emerald-400">→</span>
            </Link>

            <div className="mt-4 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4">
              <p className="text-xs leading-relaxed text-slate-400">
                <span className="text-emerald-400 font-medium">Fully anonymous</span> — poll results are community-wide aggregates only. No individual tracking. No login required.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Newsletter strip */}
      <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/3 px-6 py-4 sm:flex-row">
        <p className="text-sm text-slate-300">Stay informed — get our weekly NZ political briefing.</p>
        <Link href="/newsletter" className="whitespace-nowrap rounded-lg border border-emerald-500/30 px-5 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/10">
          Subscribe to newsletter →
        </Link>
      </div>

      {/* Pledge */}
      <section className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
        <h3 className="mb-2 text-sm font-semibold text-white">Our pledge to you</h3>
        <ul className="grid gap-3 text-xs leading-relaxed text-slate-300 sm:grid-cols-3">
          <li className="flex gap-2"><span className="mt-0.5 text-emerald-400">✓</span><span>We never endorse a party, candidate, or ideology.</span></li>
          <li className="flex gap-2"><span className="mt-0.5 text-emerald-400">✓</span><span>Every claim is sourced. Multiple sources always shown.</span></li>
          <li className="flex gap-2"><span className="mt-0.5 text-emerald-400">✓</span><span>Poll results are anonymous and community-wide aggregates only.</span></li>
        </ul>
      </section>
    </main>
  );
}
