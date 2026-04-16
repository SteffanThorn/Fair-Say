import Link from 'next/link';

export const metadata = {
  title: 'Civics',
  description: 'Neutral NZ civic education and practical participation guides.',
};

export default function CivicsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-emerald-400">CivicEchoNZ</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">📚 Civics</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
        This section is being built next. It will explain how NZ government works, how MMP works,
        and the real ways you can influence decisions beyond voting.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <section className="card rounded-2xl p-5">
          <h2 className="font-semibold text-white">How NZ Government Works</h2>
          <p className="mt-2 text-sm text-slate-400">Parliament, Cabinet, local councils, and law-making.</p>
        </section>
        <section className="card rounded-2xl p-5">
          <h2 className="font-semibold text-white">Ways to Influence</h2>
          <p className="mt-2 text-sm text-slate-400">Submissions, petitions, contacting MPs, OIA requests.</p>
        </section>
        <section className="card rounded-2xl p-5">
          <h2 className="font-semibold text-white">MMP Explained</h2>
          <p className="mt-2 text-sm text-slate-400">Electorate vote, party vote, thresholds, and overhang seats.</p>
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
