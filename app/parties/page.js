import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Party from '@/lib/models/Party';

export const metadata = {
  title: 'Parties',
  description: 'Neutral overview of New Zealand political parties represented in Parliament.',
};

export const revalidate = 3600;

async function getParties() {
  await dbConnect();
  return Party.find({ isParliamentary: true })
    .sort({ currentSeats: -1, name: 1 })
    .lean();
}

export default async function PartiesPage() {
  const parties = await getParties();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">CivicEchoNZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">🗳️ Parliamentary Parties</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 leading-relaxed">
          Neutral, factual summaries only. CivicEchoNZ does not endorse any party, MP, or ideology.
          Compare values and policy framing across multiple sources.
        </p>
      </header>

      {parties.length === 0 ? (
        <section className="card rounded-2xl p-8 text-center">
          <p className="text-slate-300">No party data yet. Run <span className="text-emerald-400">npm run seed</span>.</p>
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {parties.map((party) => (
            <article key={party._id.toString()} className="card rounded-2xl p-5 hover:border-white/20 transition-colors">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: party.color || '#6b7280' }}
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-semibold text-white">{party.name}</h2>
                </div>
                <span className="badge badge-blue">{party.currentSeats || 0} seats</span>
              </div>

              {party.ideologyDescription ? (
                <p className="line-clamp-4 text-sm text-slate-300">{party.ideologyDescription}</p>
              ) : (
                <p className="text-sm text-slate-400">No summary available yet.</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {(party.coreValues || []).slice(0, 4).map((value) => (
                  <span key={value} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                    {value}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Link href={`/parties/${party.slug}`} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                  View full profile →
                </Link>
                {party.website ? (
                  <a
                    href={party.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-300"
                  >
                    Website ↗
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
