// NZ at a glance — sourced from Stats NZ, OECD, UN World Happiness Report, World Bank.
// Numbers reflect the most recent available data (noted per stat).

const STAT_GROUPS = [
  {
    id: 'equality',
    icon: '⚖️',
    label: 'Equality',
    color: '#2B6CB0',
    headline: '0.33',
    headlineLabel: 'Gini coefficient (2022)',
    headlineNote: 'Higher = more unequal. OECD average ≈ 0.31.',
    trend: 'up',
    trendLabel: 'Up from 0.27 in 1984',
    subGroups: [
      {
        label: 'General Inequality',
        stats: [
          { label: 'Top 10% wealth share', value: '57%', note: 'of all household wealth — Stats NZ 2021' },
          { label: 'Top 1% wealth share', value: '18%', note: 'of all household wealth — Stats NZ 2021' },
          { label: 'Child poverty rate', value: '13.6%', note: 'material hardship measure — MSD 2023' },
          { label: 'Gender pay gap', value: '9.1%', note: 'median hourly earnings — Stats NZ 2023' },
        ],
      },
      {
        label: 'Unemployment by Ethnicity',
        stats: [
          { label: 'European / Pākehā', value: '3.4%', note: 'Q4 2023 — Stats NZ HLFS' },
          { label: 'Asian', value: '4.5%', note: 'Q4 2023 — Stats NZ HLFS' },
          { label: 'Pacific Peoples', value: '7.8%', note: 'Q4 2023 — Stats NZ HLFS' },
          { label: 'Māori', value: '8.3%', note: 'Q4 2023 — Stats NZ HLFS (2.4× European)' },
        ],
      },
      {
        label: 'Median Personal Income',
        stats: [
          { label: 'European / Pākehā', value: 'NZ$37,100', note: 'Stats NZ 2023 Census' },
          { label: 'Asian', value: 'NZ$29,400', note: 'Stats NZ 2023 Census' },
          { label: 'Māori', value: 'NZ$28,800', note: 'Stats NZ 2023 Census' },
          { label: 'MELAA', value: 'NZ$24,500', note: 'Middle Eastern / Latin American / African — Stats NZ 2023 Census' },
          { label: 'Pacific Peoples', value: 'NZ$25,300', note: 'Stats NZ 2023 Census' },
        ],
      },
      {
        label: 'Home Ownership',
        stats: [
          { label: 'European / Pākehā', value: '63%', note: 'Stats NZ 2023 Census' },
          { label: 'Asian', value: '52%', note: 'Stats NZ 2023 Census' },
          { label: 'Māori', value: '29%', note: 'Stats NZ 2023 Census' },
          { label: 'MELAA', value: '27%', note: 'Middle Eastern / Latin American / African — Stats NZ 2023 Census' },
          { label: 'Pacific Peoples', value: '22%', note: 'Stats NZ 2023 Census' },
        ],
      },
    ],
    context:
      'NZ\'s Gini coefficient roughly doubled between 1982 and 1991 — one of the steepest rises ever recorded in an OECD country — driven primarily by the "Rogernomics" restructuring. It has plateaued since but never returned to pre-1984 levels. Ethnic disparities in employment, income, and home ownership are among the largest inequality gaps in the data.',
    source: { label: 'Stats NZ Household Income and Housing 2023', url: 'https://www.stats.govt.nz/topics/income' },
  },
  {
    id: 'wealth',
    icon: '💰',
    label: 'Wealth as a Nation',
    color: '#276749',
    headline: '$370B',
    headlineLabel: 'GDP (NZD, 2023)',
    headlineNote: 'NZ ranks ~53rd globally by nominal GDP.',
    trend: 'up',
    trendLabel: 'Roughly doubled since 2000',
    stats: [
      { label: 'GDP per capita', value: 'NZ$73,000', note: '~USD 44,000 — World Bank 2023' },
      { label: 'Median household income', value: 'NZ$107,100', note: 'per year — Stats NZ 2023 Census' },
      { label: 'Household net worth', value: '~$2.1T NZD', note: 'total — RBNZ 2023' },
      { label: 'Median house price', value: 'NZ$770,000', note: 'national — REINZ Jan 2025' },
      { label: 'Government net debt', value: '20% of GDP', note: 'net core Crown debt — Treasury 2024' },
    ],
    context:
      'New Zealand is a high-income nation but its wealth is heavily concentrated in residential property — housing makes up around 60% of household net worth. This means a large share of "national wealth" is locked in assets rather than productive investment, and access to that wealth is increasingly determined by when you were born.',
    source: { label: 'Stats NZ & Reserve Bank of NZ — National Accounts 2023', url: 'https://www.stats.govt.nz/topics/national-accounts' },
  },
  {
    id: 'happiness',
    icon: '😊',
    label: 'Happiness & Wellbeing',
    color: '#2C7A7B',
    headline: '#10',
    headlineLabel: 'World Happiness Report 2024',
    headlineNote: 'Score: 7.15 / 10. NZ peaked at #5 in 2012.',
    trend: 'stable',
    trendLabel: 'Broadly stable since 2015',
    stats: [
      { label: 'Life satisfaction score', value: '7.15 / 10', note: 'UN World Happiness Report 2024' },
      { label: 'Life expectancy', value: '82.5 years', note: 'at birth, 2022 — Stats NZ' },
      { label: 'Mental health disorders', value: '1 in 5', note: 'adults in any year — Te Whatu Ora 2023' },
      { label: 'Youth wellbeing', value: '25% struggle', note: 'youth aged 15–24 report poor wellbeing — OCC 2023' },
      { label: 'Loneliness', value: '18%', note: 'adults often or always lonely — Stats NZ 2021' },
    ],
    context:
      'NZ consistently ranks in the global top 10 for happiness, driven by high scores on social support, freedom, and low corruption. However, beneath the headline figure are significant disparities: Māori and Pasifika wellbeing scores are substantially lower, youth mental health has deteriorated since 2015, and housing costs are a growing driver of stress.',
    source: { label: 'UN World Happiness Report 2024', url: 'https://worldhappiness.report/' },
  },
  {
    id: 'identity',
    icon: '🇳🇿',
    label: 'NZ Identity',
    color: '#553C9A',
    headline: '5.1M',
    headlineLabel: 'Population (2024 estimate)',
    headlineNote: 'Percentages add to more than 100% — people can identify with multiple ethnicities.',
    trend: 'up',
    trendLabel: '+1.1M since 2001',
    subGroups: [
      {
        label: 'Population by Ethnicity',
        stats: [
          { label: 'European / Pākehā', value: '70.2%', note: '~3.56M people — 2023 Census' },
          { label: 'Māori', value: '17.8%', note: '~903,000 people — 2023 Census' },
          { label: 'Asian', value: '17.3%', note: '~879,000 people — 2023 Census' },
          { label: 'Pacific Peoples', value: '8.9%', note: '~452,000 people — 2023 Census' },
          { label: 'MELAA', value: '2.6%', note: 'Middle Eastern / Latin American / African — ~132,000 — 2023 Census' },
          { label: 'Other ethnicities', value: '1.7%', note: '~86,000 people — 2023 Census' },
        ],
      },
      {
        label: 'Pacific Peoples Breakdown',
        stats: [
          { label: 'Samoan', value: '4.0%', note: 'largest Pacific group — 2023 Census' },
          { label: 'Tongan', value: '1.8%', note: '2023 Census' },
          { label: 'Cook Island Māori', value: '1.8%', note: '2023 Census' },
          { label: 'Fijian', value: '0.7%', note: '2023 Census' },
          { label: 'Niuean', value: '0.4%', note: '2023 Census' },
        ],
      },
      {
        label: 'Asian Breakdown',
        stats: [
          { label: 'Indian', value: '5.8%', note: 'largest Asian group — 2023 Census' },
          { label: 'Chinese', value: '4.9%', note: '2023 Census' },
          { label: 'Filipino', value: '2.4%', note: '2023 Census' },
          { label: 'Korean', value: '1.0%', note: '2023 Census' },
          { label: 'Sri Lankan', value: '0.6%', note: '2023 Census' },
        ],
      },
      {
        label: 'Other Identity Stats',
        stats: [
          { label: 'Born overseas', value: '27.9%', note: '~1.4M residents — 2023 Census' },
          { label: 'No religion', value: '48.5%', note: 'up from 30% in 2001 — 2023 Census' },
          { label: 'Te reo speakers', value: '4%', note: 'conversational Māori — 2023 Census' },
          { label: 'Urban population', value: '86%', note: 'live in urban areas — Stats NZ 2023' },
        ],
      },
    ],
    context:
      'New Zealand is undergoing rapid demographic change. Asian and Pasifika populations have grown significantly since 2001, nearly 1 in 3 residents was born overseas, and for the first time a majority of New Zealanders identify with no religion. Māori remain the tangata whenua (people of the land) and te reo Māori is an official language. All five major ethnic groups — European/Pākehā, Māori, Pasifika, Asian, and MELAA — contribute to NZ\'s official multicultural identity.',
    source: { label: 'Stats NZ 2023 Census — National population estimates', url: 'https://www.stats.govt.nz/2023-census' },
  },
];

function TrendBadge({ trend, label }) {
  const cfg = {
    up:     { arrow: '↑', bg: 'rgba(239,68,68,0.12)',  text: '#fca5a5' },
    down:   { arrow: '↓', bg: 'rgba(52,211,153,0.12)', text: '#6ee7b7' },
    stable: { arrow: '→', bg: 'rgba(148,163,184,0.12)', text: '#94a3b8' },
  }[trend] || { arrow: '→', bg: 'rgba(148,163,184,0.12)', text: '#94a3b8' };

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.arrow} {label}
    </span>
  );
}

function StatCard({ s, color }) {
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ background: `${color}0c`, border: `1px solid ${color}20` }}
    >
      <p className="text-xs text-slate-400">{s.label}</p>
      <p className="mt-0.5 text-base font-bold" style={{ color }}>
        {s.value}
      </p>
      <p className="text-[10px] text-slate-600 mt-0.5">{s.note}</p>
    </div>
  );
}

function StatGroup({ group, open, onToggle }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(8,15,30,0.85)',
        border: `1px solid ${group.color}30`,
        borderTop: `3px solid ${group.color}`,
      }}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 text-left"
        style={{ background: `linear-gradient(135deg, ${group.color}18 0%, transparent 60%)` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">{group.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white">{group.label}</p>
              <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-black tabular-nums" style={{ color: group.color }}>
                  {group.headline}
                </span>
                <span className="text-xs text-slate-400">{group.headlineLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs text-slate-500">{open ? '▲ less' : '▼ more'}</span>
            <TrendBadge trend={group.trend} label={group.trendLabel} />
          </div>
        </div>
      </button>

      {/* Expandable detail */}
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-white/5">
          <p className="mb-4 text-xs text-slate-500 italic">{group.headlineNote}</p>

          {/* Stats — either flat list or grouped sub-sections */}
          {group.subGroups ? (
            <div className="space-y-5 mb-4">
              {group.subGroups.map((sub) => (
                <div key={sub.label}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    {sub.label}
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {sub.stats.map((s) => (
                      <StatCard key={s.label} s={s} color={group.color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.stats.map((s) => (
                <StatCard key={s.label} s={s} color={group.color} />
              ))}
            </div>
          )}

          {/* Context paragraph */}
          <p className="text-xs leading-relaxed text-slate-400 mb-3">{group.context}</p>

          <a
            href={group.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            Source: {group.source.label} ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function StatsSection({ openIds, onToggle }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">NZ by the Numbers</h2>
        <p className="text-xs text-slate-500">Tap a card to expand</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {STAT_GROUPS.map((group) => (
          <StatGroup
            key={group.id}
            group={group}
            open={openIds.has(group.id)}
            onToggle={() => onToggle(group.id)}
          />
        ))}
      </div>
    </section>
  );
}
