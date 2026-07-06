import Link from 'next/link';
import { Fraunces } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';
import HomeMobileNav from '@/components/HomeMobileNav';
import styles from './page.module.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const metadata = {
  title: 'Fair Say NZ — Everyone gets a fair say.',
  description:
    'Fair Say NZ: 100% neutral, NZ-focused civic platform. Understand the issues, cut through the spin, and have your say — anonymously.',
};

const NAV_LINKS = [
  ['Grounded News', '/news'],
  ['Parties', '/parties'],
  ['Policies', '/policies'],
  ['MPs', '/mps'],
  ['Civics', '/civics'],
  ['History', '/history'],
  ['Polls', '/polls'],
  ['Learn', '/learn'],
  ['Events', '/events'],
];

const PROBLEMS = [
  {
    problem: "It's hard to know what to trust.",
    context:
      "Every outlet has a slant. Ownership matters. Funding matters. Most NZers have no easy way to compare sources or see who's behind what they're reading.",
    response:
      'Grounded News maps NZ political sources by bias, funding model, and claim validity — so you can read informed, not just informed-feeling.',
    cta: ['Explore sources →', '/news'],
  },
  {
    problem: 'Party policies are written for insiders, not voters.',
    context:
      "Manifestos are dense PDFs. Party websites bury the details. Comparing what different parties actually believe on the same issue takes hours — if you can find it at all.",
    response:
      "Our Policies section translates every major party's position on key topics into plain English, side-by-side, with source links — no spin, no summary written by the party itself.",
    cta: ['View parties →', '/parties'],
  },
  {
    problem: "Online polls don't reflect what NZ actually thinks.",
    context:
      "Anyone can vote, from anywhere, multiple times. Results get skewed by organised groups, offshore accounts, or just whoever sees it first. It's noise, not signal.",
    response:
      'Fair Say polls are fully anonymous and structurally private — but results can be filtered to show only verified NZ citizens, so you can see what New Zealanders actually think, separately from everyone else.',
    cta: ['See current polls →', '/polls'],
  },
  {
    problem: "Too many people don't know enough to engage.",
    context:
      "How does MMP actually work? What did the Treaty actually say — in both versions? Why does the Reserve Bank set interest rates? Civic participation needs a foundation.",
    response:
      "Civics, History, and our Learn courses give you the context behind today's debates — written for ordinary New Zealanders, not political science students.",
    cta: ['Start learning →', '/civics'],
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Read clearly',
    body: 'Use Grounded News to find NZ political reporting with source transparency shown — bias, ownership, funding model.',
  },
  {
    num: '02',
    title: 'Understand the context',
    body: "Civics and History give you the background behind what you're reading — the policy, the people, the history.",
  },
  {
    num: '03',
    title: 'Have your say',
    body: 'Vote anonymously in polls. No account required. Optionally verify as an NZ citizen to make your voice count in the citizen-only filter.',
  },
  {
    num: '04',
    title: 'See what NZ thinks',
    body: 'Poll results are public and broken down by verification level — so you can compare all responses against NZ citizens specifically.',
  },
];

const PLEDGES = [
  'We never endorse a party, candidate, or ideology.',
  'Every claim is sourced. Multiple sources always shown.',
  'Poll results are anonymous — no individual tracking, ever.',
  "We tell you what we store, what we don't, and what third-party providers see.",
  'Verification is optional and an upgrade — never a gate.',
  'If we get something wrong, we correct it publicly.',
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={fraunces.variable}>

      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between gap-2 border-b border-slate-400/15 bg-[#080f1e]/90 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-100">
          🌿 <span className="text-green-400">Fair Say</span> NZ
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="whitespace-nowrap rounded-md px-2.5 py-2 text-xs text-slate-400 transition hover:bg-slate-400/15 hover:text-slate-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-green-400 px-3.5 py-2 text-xs font-semibold text-[#080f1e] transition hover:bg-green-300"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="rounded-md border border-slate-400/15 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-400/40 hover:text-slate-100"
              >
                Sign in
              </Link>
              <Link
                href="/auth"
                className="rounded-md bg-green-400 px-3.5 py-2 text-xs font-semibold text-[#080f1e] transition hover:bg-green-300"
              >
                Join free
              </Link>
            </>
          )}

          <HomeMobileNav links={NAV_LINKS} />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-2xl px-6 pb-16 pt-20 text-center">
        <div
          className={`mb-6 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-green-400 ${styles.eyebrow}`}
        >
          New Zealand · 100% neutral · No spin
        </div>

        <h1
          className={`mb-6 text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-slate-100 ${styles.serif}`}
        >
          NZ politics is loud.
          <br />
          <em className="font-medium italic text-slate-400">
            Your voice shouldn&apos;t get lost in it.
          </em>
        </h1>

        <p className="mx-auto mb-10 max-w-lg text-[1.05rem] leading-[1.7] text-slate-400">
          Most New Zealanders care about what happens to this country — but feel locked out
          of the conversation. Fair Say is the civic platform built to change that: clear
          information, no agenda, and a real way to be heard.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/polls"
            className="rounded-lg bg-green-400 px-6 py-3 text-[0.95rem] font-semibold text-[#080f1e] transition hover:bg-green-300"
          >
            Have your say →
          </Link>
          <Link
            href="/news"
            className="rounded-lg border border-slate-400/15 px-6 py-3 text-[0.95rem] font-medium text-slate-100 transition hover:border-slate-400/40 hover:bg-slate-400/15"
          >
            See what&apos;s happening
          </Link>
        </div>
      </section>

      <hr className="mx-auto max-w-2xl border-slate-400/15 px-6" />

      {/* ── Problems + Solutions ── */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <p className="mb-10 text-[0.7rem] font-semibold uppercase tracking-widest text-slate-400">
          What we&apos;re solving
        </p>

        {PROBLEMS.map(({ problem, context, response, cta }, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 gap-6 border-t border-slate-400/15 py-8 sm:grid-cols-2 sm:gap-12 ${
              i === PROBLEMS.length - 1 ? 'border-b' : ''
            }`}
          >
            <div>
              <h3 className={`mb-2 text-[1.2rem] font-bold leading-[1.3] text-slate-100 ${styles.serif}`}>
                {problem}
              </h3>
              <p className="text-sm leading-[1.65] text-slate-400">{context}</p>
            </div>
            <div className="rounded-[10px] border border-slate-400/15 bg-[#0d1729] p-5">
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-green-400">
                Our response
              </p>
              <p className="text-[0.85rem] leading-[1.6] text-slate-400">{response}</p>
              <Link
                href={cta[1]}
                className="mt-3 inline-block text-[0.8rem] font-medium text-green-400 hover:underline"
              >
                {cta[0]}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-slate-400/15 bg-[#0d1729] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className={`mb-2 text-[1.75rem] font-bold text-slate-100 ${styles.serif}`}>
            How it works
          </h2>
          <p className="mb-10 text-[0.9rem] text-slate-400">
            You don&apos;t need to be a political nerd to use Fair Say. Here&apos;s the shape of it.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ num, title, body }) => (
              <div
                key={num}
                className="rounded-[10px] border border-slate-400/15 bg-[#132040] p-5"
              >
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-green-400">
                  Step {num}
                </p>
                <h4 className="mb-1.5 text-[0.95rem] font-semibold text-slate-100">{title}</h4>
                <p className="text-[0.8rem] leading-[1.55] text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h2 className={`mb-2 text-[1.75rem] font-bold text-slate-100 ${styles.serif}`}>
          Built for trust, not traffic.
        </h2>
        <p className="mb-8 text-[0.9rem] text-slate-400">
          The decisions behind how Fair Say works — and why we made them.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-[10px] border border-slate-400/15 bg-[#0d1729] p-5">
            <div className="mb-2 text-xl">🔒</div>
            <h4 className="mb-1.5 text-[0.9rem] font-semibold text-slate-100">
              Anonymous by design
            </h4>
            <p className="text-[0.8rem] leading-[1.55] text-slate-400">
              Poll votes are structurally separated from your identity. Even we can&apos;t link a
              vote to a person — that&apos;s the architecture, not just a policy.
            </p>
          </div>

          <div className="rounded-[10px] border border-slate-400/15 bg-[#0d1729] p-5">
            <div className="mb-2 text-xl">🇳🇿</div>
            <h4 className="mb-1.5 text-[0.9rem] font-semibold text-slate-100">
              NZ citizen verification
            </h4>
            <p className="text-[0.8rem] leading-[1.55] text-slate-400">
              Optional. Verify with your NZ passport to tag your votes as citizen-verified.
              Results show both all-respondent and citizen-only views.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-amber-400/25 bg-amber-400/15 px-2.5 py-0.5 text-[0.7rem] font-semibold text-amber-400">
                Email account
              </span>
              <span className="rounded-full border border-green-400/20 bg-green-400/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-green-400">
                NZ Passport verified
              </span>
            </div>
          </div>

          <div className="col-span-1 rounded-[10px] border border-slate-400/15 bg-[#0d1729] p-5 sm:col-span-2">
            <div className="mb-2 text-xl">⚖️</div>
            <h4 className="mb-1.5 text-[0.9rem] font-semibold text-slate-100">
              No party. No funder. No agenda.
            </h4>
            <p className="text-[0.8rem] leading-[1.55] text-slate-400">
              Fair Say is not affiliated with any political party, lobby group, or government
              body. We have no advertising. Every editorial decision is made independently.
              The founder is not yet an NZ citizen — and we think that&apos;s worth saying
              publicly, because this platform was built for New Zealanders, not for us.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pledge ── */}
      <section className="border-y border-slate-400/15 bg-[#0d1729] px-6 py-12">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className={`mb-2 text-[1.5rem] font-bold text-slate-100 ${styles.serif}`}>
              Our pledge to you
            </h2>
            <p className="text-[0.85rem] leading-[1.6] text-slate-400">
              Not fine print. The actual commitments that shape every decision on this platform.
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {PLEDGES.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[0.875rem] leading-normal text-slate-400">
                <span className="mt-0.5 shrink-0 font-bold text-green-400">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2
          className={`mb-3 text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-[1.2] text-slate-100 ${styles.serif}`}
        >
          Ready to have your say?
        </h2>
        <p className="mx-auto mb-8 max-w-sm text-[0.95rem] text-slate-400">
          No account needed to vote or read. Join free if you want to verify as an NZ citizen
          and track your activity.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/polls"
            className="rounded-lg bg-green-400 px-6 py-3 text-[0.95rem] font-semibold text-[#080f1e] transition hover:bg-green-300"
          >
            See current polls →
          </Link>
          <Link
            href="/auth"
            className="rounded-lg border border-slate-400/15 px-6 py-3 text-[0.95rem] font-medium text-slate-100 transition hover:border-slate-400/40 hover:bg-slate-400/15"
          >
            Join free
          </Link>
        </div>
      </section>

      {/* ── Site footer ── */}
      <footer className="border-t border-slate-400/15 px-6 py-6 text-center">
        <p className="text-xs text-slate-400">
          🌿 Fair Say NZ ·{' '}
          <Link href="/privacy" className="transition hover:text-slate-100">
            Privacy Policy
          </Link>{' '}
          · No party affiliation · No spin · Built for New Zealanders
        </p>
      </footer>

    </div>
  );
}
