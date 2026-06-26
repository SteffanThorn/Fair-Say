import Link from 'next/link';

export const metadata = {
  title: 'Party Policies Compared',
  description:
    'NZ party policies on housing, climate, health, economy, Treaty, immigration and education — in plain English, side by side, no spin.',
};

// ─── Parliamentary parties ───────────────────────────────────────────────────
const PARTIES = [
  { id: 'national', name: 'National',        short: 'NAT', color: '#1a56a4', href: '/parties/national' },
  { id: 'labour',   name: 'Labour',           short: 'LAB', color: '#cc0000', href: '/parties/labour'   },
  { id: 'greens',   name: 'Green Party',      short: 'GRN', color: '#098137', href: '/parties/greens'   },
  { id: 'act',      name: 'ACT',              short: 'ACT', color: '#d4a017', href: '/parties/act'      },
  { id: 'nzfirst',  name: 'NZ First',         short: 'NZF', color: '#4b5563', href: '/parties/nzfirst'  },
  { id: 'tpm',      name: 'Te Pāti Māori',   short: 'TPM', color: '#b5281e', href: '/parties/maori'    },
];

// ─── Topic definitions ────────────────────────────────────────────────────────
const TOPICS = [
  { id: 'housing',     label: 'Housing',           icon: '🏠' },
  { id: 'climate',     label: 'Climate',            icon: '🌿' },
  { id: 'health',      label: 'Health',             icon: '🏥' },
  { id: 'economy',     label: 'Economy & Tax',      icon: '💰' },
  { id: 'treaty',      label: 'Treaty / Māori',    icon: '📜' },
  { id: 'immigration', label: 'Immigration',        icon: '✈️' },
  { id: 'education',   label: 'Education',          icon: '📚' },
];

// ─── Policy data ──────────────────────────────────────────────────────────────
// Sources: official party websites, parliamentary records, media reporting.
// All summaries are in plain English — no editorial slant added.
const POLICIES = {
  housing: {
    national: {
      summary:
        'Passed the Fast-track Approvals Act 2024 to speed up consenting for housing and infrastructure. Reformed the Resource Management Act (RMA) to remove barriers to building. Targets 1.5 million new homes over 30 years via deregulation rather than direct government building.',
      source: 'https://www.national.org.nz/our-policies/housing',
      sourceLabel: 'National housing policy',
    },
    labour: {
      summary:
        'Opposes the sale of Kāinga Ora (public housing) assets and the reduction of the public housing waitlist fund. Supports renters\' rights legislation and warrant-of-fitness standards for rental properties. Wants to reverse cuts to emergency housing funding.',
      source: 'https://www.labour.org.nz/housing',
      sourceLabel: 'Labour housing policy',
    },
    greens: {
      summary:
        'The Green Party\'s 2024 housing policy calls for 30,000 new public and community homes per year, a rent freeze followed by rent controls tied to inflation, and a Warrant of Fitness for all rental properties. Would fund this through a wealth tax on net assets above $2 million.',
      source: 'https://www.greens.org.nz/policies/housing',
      sourceLabel: 'Green Party housing policy',
    },
    act: {
      summary:
        'Advocates eliminating all zoning restrictions and density limits to allow the market to determine housing supply. Supports repealing the Urban Development Act and removing council power to restrict building height or density. Would also require councils to pay developers when restrictive rules reduce property value.',
      source: 'https://www.act.org.nz/housing',
      sourceLabel: 'ACT housing policy',
    },
    nzfirst: {
      summary:
        'Supports building more homes in regions, not just major cities. Wants to restrict foreign ownership of residential property and prioritise housing for New Zealand citizens and permanent residents. Has supported the government\'s fast-track consenting approach.',
      source: 'https://www.nzfirst.org.nz/housing',
      sourceLabel: 'NZ First housing policy',
    },
    tpm: {
      summary:
        'Focuses on the Māori housing crisis — an estimated 30,000+ Māori households need homes. Supports papakāinga housing (communal Māori land housing), hapū-led housing developments, and Treaty-based housing funding. Opposed Kāinga Ora cuts, which disproportionately affect Māori.',
      source: 'https://www.maoriparty.org.nz/housing',
      sourceLabel: 'Te Pāti Māori housing policy',
    },
  },

  climate: {
    national: {
      summary:
        'Committed to New Zealand\'s legislated net-zero by 2050 target but rescinded the previous government\'s Climate Emergency declaration. Reversed the ban on new offshore oil and gas exploration permits (2023). Supports the Emissions Trading Scheme (ETS) as the primary climate tool, with changes to reduce cost-of-living pressure on businesses.',
      source: 'https://www.national.org.nz/our-policies/environment',
      sourceLabel: 'National environment policy',
    },
    labour: {
      summary:
        'Originally declared a Climate Emergency (2020) and passed the Climate Change Response (Zero Carbon) Amendment Act. Supports 100% renewable electricity by 2030 and net-zero long-lived gases by 2050. In opposition, Labour is pushing to restore the ban on offshore oil and gas exploration and reverse National\'s ETS changes.',
      source: 'https://www.labour.org.nz/climate',
      sourceLabel: 'Labour climate policy',
    },
    greens: {
      summary:
        'The most ambitious climate platform in Parliament. Under updated 2024–2025 policies, the Greens call for net-zero carbon by 2035 (15 years ahead of the legislated target), a just transition fund for workers in fossil fuel industries, keeping all remaining coal and gas in the ground, and a climate tax on the agriculture sector. Strongly supports public transport and active travel funding.',
      source: 'https://www.greens.org.nz/policies/climate-and-energy',
      sourceLabel: 'Green Party climate policy (2024 update)',
    },
    act: {
      summary:
        'Wants to repeal the Zero Carbon Act and withdraw New Zealand from its 2030 Paris Agreement targets. Argues that NZ\'s 0.17% share of global emissions means domestic action has negligible climate impact while imposing real economic costs. Supports removing the ETS agriculture obligations.',
      source: 'https://www.act.org.nz/climate',
      sourceLabel: 'ACT climate policy',
    },
    nzfirst: {
      summary:
        'Sceptical of climate change policy that raises costs for farmers and businesses. Secured the repeal of the previous government\'s agricultural emissions pricing scheme as a coalition condition. Supports the offshore oil and gas permit reversal. Takes a "wait and see" approach on international climate commitments.',
      source: 'https://www.nzfirst.org.nz/environment',
      sourceLabel: 'NZ First environment policy',
    },
    tpm: {
      summary:
        'Frames climate change as a climate justice and indigenous rights issue. Supports an immediate moratorium on new fossil fuel extraction, Te Tiriti-based environmental governance, and reparations for Pacific communities bearing the brunt of climate impacts. Advocates moving NZ to 100% renewable energy.',
      source: 'https://www.maoriparty.org.nz/environment',
      sourceLabel: 'Te Pāti Māori environment policy',
    },
  },

  health: {
    national: {
      summary:
        'Abolished the Māori Health Authority (Manatū Hauora) and the Health New Zealand restructure created by Labour, replacing it with a single national health body. Focused on reducing surgical waitlists and investing in cancer treatment. Reversed free prescriptions (now $5 co-payment applies, except for under-14s and community services card holders).',
      source: 'https://www.national.org.nz/our-policies/health',
      sourceLabel: 'National health policy',
    },
    labour: {
      summary:
        'Introduced free prescriptions for all (2023), which National reversed. Supports rebuilding the public health system after years of underfunding. In opposition, advocates restoring the Māori Health Authority, reversing prescription co-payments, and increasing mental health funding. Opposes privatisation of health services.',
      source: 'https://www.labour.org.nz/health',
      sourceLabel: 'Labour health policy',
    },
    greens: {
      summary:
        'Supports universal free healthcare at point of use, including dental care (currently not covered by the public system). Calls for major increases in mental health funding and suicide prevention. Opposed the abolition of the Māori Health Authority and supports kaupapa Māori health services. Advocates free prescriptions for all.',
      source: 'https://www.greens.org.nz/policies/health',
      sourceLabel: 'Green Party health policy',
    },
    act: {
      summary:
        'Supports introducing more competition and consumer choice into health services, including expanding the role of private providers funded by the public system. Favours health savings accounts and wants to reduce bureaucracy in health administration. Supported abolishing the Māori Health Authority.',
      source: 'https://www.act.org.nz/health',
      sourceLabel: 'ACT health policy',
    },
    nzfirst: {
      summary:
        'Focuses on rural health access — clinics, ambulance services and GP access in provincial areas. Supported free prescriptions and has concerns about health service cuts in smaller communities. Pushed for the government to address nurse and doctor shortages in regional NZ.',
      source: 'https://www.nzfirst.org.nz/health',
      sourceLabel: 'NZ First health policy',
    },
    tpm: {
      summary:
        'Strongly opposed abolition of the Māori Health Authority, which was designed to close health outcome gaps between Māori and non-Māori. Supports kaupapa Māori health services, te reo Māori access to healthcare, and Treaty-based health funding. Advocates for holistic Māori wellbeing (hauora) approaches.',
      source: 'https://www.maoriparty.org.nz/health',
      sourceLabel: 'Te Pāti Māori health policy',
    },
  },

  economy: {
    national: {
      summary:
        'Delivered income tax cuts in May 2024 (adjusted tax bracket thresholds) and cut government spending to return to surplus by 2026/27. Reduced public sector headcount. Pro-business regulatory reforms including the Fast-track Approvals Act. Supports fiscal responsibility and reduced government debt.',
      source: 'https://www.national.org.nz/our-policies/economy',
      sourceLabel: 'National economic policy',
    },
    labour: {
      summary:
        'Opposes National\'s spending cuts, arguing they are harming public services. Supports a fairer tax system and would consider a capital gains tax or wealth tax on high earners. Wants to protect workers\' rights, raise the minimum wage, and restore collective bargaining. Grew the economy through COVID but also increased debt significantly.',
      source: 'https://www.labour.org.nz/economy',
      sourceLabel: 'Labour economic policy',
    },
    greens: {
      summary:
        'Proposes a Wealth Tax of 2.5% annually on net assets above $2 million, estimated to raise $10–14 billion per year. Advocates for a top income tax rate of 45% on incomes above $180,000. Wants to invest the revenue in housing, health and climate. Also supports taxing capital gains and inheritance above a threshold.',
      source: 'https://www.greens.org.nz/policies/economy',
      sourceLabel: 'Green Party tax and economy policy (2024 update)',
    },
    act: {
      summary:
        'Proposes a flat 17.5% income tax for all earners (removing higher brackets), with savings of ~$14 billion from cutting government spending. Wants to significantly shrink the public sector, remove minimum wage increases, and eliminate much of the regulatory state. Believes lower taxes will drive economic growth.',
      source: 'https://www.act.org.nz/economy',
      sourceLabel: 'ACT economic policy',
    },
    nzfirst: {
      summary:
        'Supports NZ manufacturing and domestic industry — wants to "buy NZ made" in government procurement. Opposes asset sales of strategic infrastructure. Wants to protect superannuation (NZ Super) and not raise the eligibility age. Supports regional economic development spending.',
      source: 'https://www.nzfirst.org.nz/economy',
      sourceLabel: 'NZ First economic policy',
    },
    tpm: {
      summary:
        'Advocates for economic justice and redistribution — a living wage, universal basic income trials, and ending child poverty. Wants Māori economic development backed by Treaty rights and asset returns. Opposes corporate tax avoidance. Supports a wealth tax and capital gains tax.',
      source: 'https://www.maoriparty.org.nz/economy',
      sourceLabel: 'Te Pāti Māori economic policy',
    },
  },

  treaty: {
    national: {
      summary:
        'Opposed the ACT-led Treaty Principles Bill at second reading (after supporting it to select committee). Has reduced co-governance in public services and health. Repealed some Treaty-related provisions in legislation. Describes its approach as "one standard of citizenship" while acknowledging Treaty obligations in narrow contexts.',
      source: 'https://www.national.org.nz/our-policies/maori-affairs',
      sourceLabel: 'National Treaty/Māori policy',
    },
    labour: {
      summary:
        'Strong Treaty of Waitangi commitments — supports co-governance as a Treaty obligation, not a political choice. Established the Māori Health Authority, He Puapua framework, and increased Crown-Māori partnership arrangements while in government (2017–2023). Opposed the Treaty Principles Bill.',
      source: 'https://www.labour.org.nz/maori',
      sourceLabel: 'Labour Treaty/Māori policy',
    },
    greens: {
      summary:
        'The Greens support full implementation of Te Tiriti o Waitangi and tino rangatiratanga (Māori self-determination). Co-governed with Māori co-leaders and has strong internal kaupapa Māori structures. Supported He Puapua and strongly opposed the Treaty Principles Bill. Supports Māori electorates.',
      source: 'https://www.greens.org.nz/policies/treaty-of-waitangi',
      sourceLabel: 'Green Party Treaty policy',
    },
    act: {
      summary:
        'ACT introduced the Treaty Principles Bill (2023), which sought to redefine Treaty principles as equal rights for all citizens. The Bill passed its first reading with National support but did not progress further. ACT wants to repeal all Treaty clauses from legislation and replace co-governance with equal citizenship.',
      source: 'https://www.act.org.nz/treaty',
      sourceLabel: 'ACT Treaty policy',
    },
    nzfirst: {
      summary:
        'Opposes co-governance and Treaty-based governance of public services. Wants a referendum on abolishing the seven Māori electorates. Secured the repeal of He Puapua and reduction of Māori-specific public services as a coalition condition. Supports a "one law for all" approach.',
      source: 'https://www.nzfirst.org.nz/treaty',
      sourceLabel: 'NZ First Treaty policy',
    },
    tpm: {
      summary:
        'Te Pāti Māori is built on the principle of tino rangatiratanga — full Māori self-determination under Te Tiriti. Wants the Treaty to be the constitutional foundation of Aotearoa New Zealand, with Māori having equal authority with the Crown. Supports expanding Māori electorates and opposed any moves to abolish them.',
      source: 'https://www.maoriparty.org.nz/treaty',
      sourceLabel: 'Te Pāti Māori Treaty policy',
    },
  },

  immigration: {
    national: {
      summary:
        'Increased the Accredited Employer Work Visa (AEWV) cap and streamlined skilled migrant pathways. Supports immigration for economic growth and filling skills shortages in health, construction, and tech. Has tightened requirements for lower-skilled temporary visa categories while keeping pathways open for high-value migrants.',
      source: 'https://www.national.org.nz/our-policies/immigration',
      sourceLabel: 'National immigration policy',
    },
    labour: {
      summary:
        'Supports managed immigration tied to skills shortages and regional needs. In government, Labour temporarily reduced immigration numbers during COVID, then reopened borders. In opposition, has criticised National\'s approach as creating exploitation risks for migrant workers and wants stronger protections.',
      source: 'https://www.labour.org.nz/immigration',
      sourceLabel: 'Labour immigration policy',
    },
    greens: {
      summary:
        'Supports a humane, rights-based immigration system. Wants to end immigration detention (or use it as an absolute last resort), restore appeal rights that were removed from deportees, and provide clearer pathways to residency for long-term migrants. Opposes deportation to unsafe countries.',
      source: 'https://www.greens.org.nz/policies/immigration',
      sourceLabel: 'Green Party immigration policy',
    },
    act: {
      summary:
        'Wants immigration driven purely by economic contribution — a points-based system with no family reunification or humanitarian intake beyond strict refugee quotas. Wants to reduce the overall immigration level and remove low-skill temporary work visas. Supports citizenship only after long-term residency and contributions.',
      source: 'https://www.act.org.nz/immigration',
      sourceLabel: 'ACT immigration policy',
    },
    nzfirst: {
      summary:
        'Calls for strict immigration controls and significant reductions in overall numbers. Prioritises NZ citizens and permanent residents for jobs. Opposes fast-track work visas in sectors where NZers could be trained. Wants tighter checks on student visa abuse and strengthened deportation powers.',
      source: 'https://www.nzfirst.org.nz/immigration',
      sourceLabel: 'NZ First immigration policy',
    },
    tpm: {
      summary:
        'Takes a humanitarian approach — supports robust refugee intake, family reunification, and an end to immigration detention. Wants recognition of Pacific peoples\' special relationship with NZ and simpler pathways for Pacific immigrants. Opposes exploitation of migrant workers in primary industries.',
      source: 'https://www.maoriparty.org.nz/immigration',
      sourceLabel: 'Te Pāti Māori immigration policy',
    },
  },

  education: {
    national: {
      summary:
        'Introduced a structured literacy and numeracy curriculum from 2025, mandating evidence-based phonics instruction in primary schools. Reversed the previous government\'s curriculum refresh to focus on "back to basics." Has made school lunches free for all primary students (extending Labour\'s programme). Supports charter schools.',
      source: 'https://www.national.org.nz/our-policies/education',
      sourceLabel: 'National education policy',
    },
    labour: {
      summary:
        'Introduced the free school lunches programme and extended it widely. Passed a new national curriculum and history curriculum (including NZ history as compulsory). In opposition, Labour opposes charter schools and the curriculum rollback. Supports early childhood education investment.',
      source: 'https://www.labour.org.nz/education',
      sourceLabel: 'Labour education policy',
    },
    greens: {
      summary:
        'Supports free early childhood education from age 2, free tertiary education, and cancellation of student loan debt. Wants teachers to be paid significantly more to address workforce shortages. Opposes charter schools. Advocates for te reo Māori immersion (kura kaupapa) funding and equity in school resourcing.',
      source: 'https://www.greens.org.nz/policies/education',
      sourceLabel: 'Green Party education policy',
    },
    act: {
      summary:
        'Supports charter schools (renamed Partnership Schools) and has overseen their return to NZ under the current government. Advocates for school choice, transparent school performance data, and parental rights in education. Opposes compulsory NZ history curriculum framing as politically motivated.',
      source: 'https://www.act.org.nz/education',
      sourceLabel: 'ACT education policy',
    },
    nzfirst: {
      summary:
        'Supports rural and regional school investment. Has backed the structured literacy approach and reducing curriculum overload. Wants tertiary vocational training expanded, particularly trades and technical skills. Supports the free school lunch programme. Generally supportive of National\'s education direction.',
      source: 'https://www.nzfirst.org.nz/education',
      sourceLabel: 'NZ First education policy',
    },
    tpm: {
      summary:
        'Prioritises te reo Māori immersion education — wants full government funding for kura kaupapa Māori and wharekura from early childhood through secondary. Supports free tertiary education and student loan cancellation. Wants the compulsory NZ history curriculum retained and strengthened to include Te Tiriti. Opposes charter schools.',
      source: 'https://www.maoriparty.org.nz/education',
      sourceLabel: 'Te Pāti Māori education policy',
    },
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

function PolicyCard({ party, position }) {
  if (!position) return null;
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{
        background: 'rgba(8,15,30,0.85)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `3px solid ${party.color}`,
      }}
    >
      <div
        className="px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${party.color}20 0%, transparent 70%)` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block rounded-md px-2 py-0.5 text-xs font-bold tracking-wide"
            style={{ background: `${party.color}25`, color: party.color }}
          >
            {party.short}
          </span>
          <Link
            href={party.href}
            className="text-sm font-semibold text-white hover:opacity-75 transition-opacity"
          >
            {party.name}
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
        <p className="text-sm leading-relaxed text-slate-300">{position.summary}</p>
        <a
          href={position.source}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Source: {position.sourceLabel} ↗
        </a>
      </div>
    </div>
  );
}

function TopicSection({ topic }) {
  const positions = POLICIES[topic.id] || {};
  return (
    <section id={topic.id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">{topic.icon}</span>
        <h2 className="text-xl font-bold text-white">{topic.label}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTIES.map((party) => (
          <PolicyCard key={party.id} party={party} position={positions[party.id]} />
        ))}
      </div>
    </section>
  );
}

export default function PoliciesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Party Policies Compared</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 leading-relaxed">
          Plain-English summaries of where each parliamentary party stands on the issues that matter —
          side by side, with source links. No spin, no editorial slant.
        </p>
      </header>

      {/* Disclaimer */}
      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-xs text-amber-200 leading-relaxed">
          <strong>Neutral disclaimer:</strong> Summaries are based on each party&apos;s publicly stated positions,
          official policy documents, and parliamentary record. Fair Say NZ does not endorse, rank, or recommend any party.
          Policies change — always check the official party website for the latest.
        </p>
      </div>

      {/* Sticky topic nav */}
      <nav className="sticky top-0 z-30 -mx-4 mb-10 overflow-x-auto border-b border-white/8 bg-[#080f1e]/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
        <ul className="flex gap-1 py-2">
          {TOPICS.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/8 hover:text-white"
              >
                <span>{t.icon}</span> {t.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Topic sections */}
      <div className="flex flex-col gap-14">
        {TOPICS.map((topic) => (
          <TopicSection key={topic.id} topic={topic} />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-14 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
        <p className="text-xs text-blue-200 leading-relaxed">
          <strong>Sources &amp; currency:</strong> Policy summaries reflect each party&apos;s position as of
          mid-2025 based on official party websites and parliamentary voting records. The Green Party updated
          several key policies in 2024 under Chlöe Swarbrick&apos;s leadership — including the wealth tax
          threshold, rent control detail, and the 2035 net-zero target. Always cross-check with the
          party&apos;s own website before forming a view.
        </p>
      </div>
    </main>
  );
}
