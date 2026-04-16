import Link from 'next/link';

export const metadata = {
  title: 'Polls',
  description: 'Community polls and pairwise civic rankings for New Zealand.',
};

export default function PollsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-emerald-400">CivicEchoNZ</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">📊 Polls</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
        This section is coming next. It will include neutral election polling, local council polling,
        and pairwise event ranking so users can compare what matters most.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="card rounded-2xl p-5">
          <h2 className="font-semibold text-white">Election Vote Poll</h2>
          <p className="mt-2 text-sm text-slate-400">Anonymous aggregate polling for the 2026 NZ general election.</p>
        </section>
        <section className="card rounded-2xl p-5">
          <h2 className="font-semibold text-white">Pairwise Event Ranking</h2>
          <p className="mt-2 text-sm text-slate-400">Compare two NZ civic events and choose which matters more.</p>
        </section>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
