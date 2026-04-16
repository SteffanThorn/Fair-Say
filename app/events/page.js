import Link from 'next/link';

export const metadata = {
  title: 'Events',
  description: 'Recent NZ government, Parliament, and council happenings.',
};

export default function EventsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-emerald-400">CivicEchoNZ</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">📅 Events</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
        This section is coming next. It will track parliamentary events, local council decisions,
        budgets, and official NZ public-interest videos.
      </p>

      <section className="card mt-6 rounded-2xl p-6">
        <h2 className="font-semibold text-white">Planned features</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>• Recent Parliament and council events</li>
          <li>• Neutral summaries with source links</li>
          <li>• YouTube video embeds from official NZ channels</li>
          <li>• Event selection for pairwise polls</li>
        </ul>
      </section>

      <div className="mt-6">
        <Link href="/" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
