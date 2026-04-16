import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Party from '@/lib/models/Party';
import MP from '@/lib/models/MP';

export const revalidate = 3600;

async function getParty(slug) {
  await dbConnect();
  const party = await Party.findOne({ slug }).lean();
  if (!party) return null;

  const mps = await MP.find({ party: party._id, isActive: true })
    .sort({ role: 1, fullName: 1 })
    .select('fullName slug role electorate photoUrl')
    .lean();

  return { party, mps };
}

export async function generateMetadata({ params }) {
  const { party } = (await getParty(params.slug)) || {};
  if (!party) return { title: 'Party not found' };
  return {
    title: party.name,
    description: `Neutral profile for ${party.name} in New Zealand politics.`,
  };
}

export default async function PartyDetailPage({ params }) {
  const data = await getParty(params.slug);
  if (!data) notFound();

  const { party, mps } = data;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/parties" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to parties</Link>

      <header className="mt-4 card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: party.color || '#6b7280' }} aria-hidden="true" />
          <h1 className="text-3xl font-bold text-white">{party.name}</h1>
          <span className="badge badge-blue ml-auto">{party.currentSeats || 0} seats</span>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-400">Founded</p>
            <p className="mt-1 font-medium text-white">{party.foundedYear || 'Unknown'}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-400">Parliamentary status</p>
            <p className="mt-1 font-medium text-white">{party.isParliamentary ? 'In Parliament' : 'Outside Parliament'}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-400">Official website</p>
            {party.website ? (
              <a href={party.website} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-medium text-emerald-400 hover:text-emerald-300">
                Visit ↗
              </a>
            ) : (
              <p className="mt-1 font-medium text-white">Not listed</p>
            )}
          </div>
        </div>
      </header>

      <section className="mt-6 card rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white">Ideology description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {party.ideologyDescription || 'No description available yet.'}
        </p>
      </section>

      <section className="mt-6 card rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white">Core values</h2>
        {(party.coreValues || []).length ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {party.coreValues.map((value) => (
              <li key={value} className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
                {value}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-400">No core values listed yet.</p>
        )}
      </section>

      <section className="mt-6 card rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-white">MPs in this party</h2>
        {mps.length ? (
          <ul className="mt-4 divide-y divide-white/10">
            {mps.map((mp) => (
              <li key={mp._id.toString()} className="py-3">
                <Link href={`/mps/${mp.slug}`} className="group flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white group-hover:text-emerald-300">{mp.fullName}</p>
                    <p className="text-sm text-slate-400">{mp.role || 'MP'}{mp.electorate ? ` · ${mp.electorate}` : ''}</p>
                  </div>
                  <span className="text-sm text-emerald-400">Profile →</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-400">No MPs linked yet.</p>
        )}
      </section>
    </main>
  );
}
