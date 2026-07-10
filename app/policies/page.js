import Link from 'next/link';

export const metadata = {
  title: 'Party Policies Compared',
  description:
    'NZ party policies on housing, climate, health, economy, Treaty, immigration and education — in plain English, side by side, no spin.',
  openGraph: {
    title: 'Party Policies Compared | Fair Say NZ',
    description:
      'NZ party policies on housing, climate, health, economy, Treaty, immigration and education — in plain English, side by side, no spin.',
  },
};

// ─── All parties on the site ──────────────────────────────────────────────────
const PARLIAMENTARY = [
  { id: 'national', name: 'National',       short: 'NAT',  color: '#1a56a4', href: '/parties/national'       },
  { id: 'labour',   name: 'Labour',          short: 'LAB',  color: '#cc0000', href: '/parties/labour'         },
  { id: 'greens',   name: 'Green Party',     short: 'GRN',  color: '#098137', href: '/parties/greens'         },
  { id: 'act',      name: 'ACT',             short: 'ACT',  color: '#d4a017', href: '/parties/act'            },
  { id: 'nzfirst',  name: 'NZ First',        short: 'NZF',  color: '#4b5563', href: '/parties/nzfirst'        },
  { id: 'tpm',      name: 'Te Pāti Māori',  short: 'TPM',  color: '#b5281e', href: '/parties/maori'          },
];

const OUTSIDE_PARLIAMENT = [
  { id: 'top',      name: 'The Opportunity Party',   short: 'TOP',  color: '#0891b2', href: '/parties/top'            },
  { id: 'nc',       name: 'Conservative Party NZ',   short: 'CPNZ', color: '#4f46e5', href: '/parties/new-conservative' },
  { id: 'alcp',     name: 'ALCP',                    short: 'ALCP', color: '#15803d', href: '/parties/alcp'           },
];

// ─── Topic definitions ────────────────────────────────────────────────────────
const TOPICS = [
  { id: 'housing',     label: 'Housing',          icon: '🏠' },
  { id: 'climate',     label: 'Climate',           icon: '🌿' },
  { id: 'health',      label: 'Health',            icon: '🏥' },
  { id: 'economy',     label: 'Economy & Tax',     icon: '💰' },
  { id: 'treaty',      label: 'Treaty / Māori',   icon: '📜' },
  { id: 'immigration', label: 'Immigration',       icon: '✈️' },
  { id: 'education',   label: 'Education',         icon: '📚' },
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
        "Opposes the sale of Kāinga Ora (public housing) assets and the reduction of the public housing waitlist fund. Supports renters' rights legislation and warrant-of-fitness standards for rental properties. Wants to reverse cuts to emergency housing funding.",
      source: 'https://www.labour.org.nz/housing',
      sourceLabel: 'Labour housing policy',
    },
    greens: {
      summary:
        "The Green Party's 2024 housing policy calls for 30,000 new public and community homes per year, a rent freeze followed by rent controls tied to inflation, and a Warrant of Fitness for all rental properties. Would fund this through a wealth tax on net assets above $2 million.",
      source: 'https://www.greens.org.nz/policies/housing',
      sourceLabel: 'Green Party housing policy',
    },
    act: {
      summary:
        'Advocates eliminating all zoning restrictions and density limits to allow the market to determine housing supply. Supports repealing the Urban Development Act and removing council power to restrict building height or density. Would also require councils to compensate developers when restrictive rules reduce property value.',
      source: 'https://www.act.org.nz/housing',
      sourceLabel: 'ACT housing policy',
    },
    nzfirst: {
      summary:
        "Supports building more homes in regions, not just major cities. Wants to restrict foreign ownership of residential property and prioritise housing for New Zealand citizens and permanent residents. Has supported the government's fast-track consenting approach.",
      source: 'https://www.nzfirst.nz/policy',
      sourceLabel: 'NZ First policy platform',
    },
    tpm: {
      summary:
        'Focuses on the Māori housing crisis — an estimated 30,000+ Māori households need homes. Supports papakāinga housing (communal Māori land housing), hapū-led housing developments, and Treaty-based housing funding. Opposed Kāinga Ora cuts, which disproportionately affect Māori.',
      source: 'https://www.maoriparty.org.nz/housing',
      sourceLabel: 'Te Pāti Māori housing policy',
    },
    top: {
      summary:
        'The Opportunity Party supports an evidence-based approach to housing supply — removing planning barriers, investing in infrastructure, and using land value taxation to discourage land banking. Aims to make homeownership accessible across income levels, not just the wealthy.',
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "Conservative Party NZ supports market-led housing supply through deregulation and reducing red tape for builders. Opposes government-owned housing as a long-term solution, preferring private ownership. Wants to remove council planning restrictions that inflate land costs.",
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'Housing is not a primary focus of the ALCP platform. The party notes that legalising and taxing cannabis would generate government revenue that could be directed toward public services including housing.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
  },

  climate: {
    national: {
      summary:
        "Committed to New Zealand's legislated net-zero by 2050 target but rescinded the previous government's Climate Emergency declaration. Reversed the ban on new offshore oil and gas exploration permits (2023). Supports the Emissions Trading Scheme (ETS) as the primary climate tool, with changes to reduce cost-of-living pressure on businesses.",
      source: 'https://www.national.org.nz/our-policies/environment',
      sourceLabel: 'National environment policy',
    },
    labour: {
      summary:
        'Originally declared a Climate Emergency (2020) and passed the Climate Change Response (Zero Carbon) Amendment Act. Supports 100% renewable electricity by 2030 and net-zero long-lived gases by 2050. In opposition, pushing to restore the ban on offshore oil and gas exploration and reverse ETS changes.',
      source: 'https://www.labour.org.nz/climate',
      sourceLabel: 'Labour climate policy',
    },
    greens: {
      summary:
        'The most ambitious climate platform in Parliament. Under updated 2024–2025 policies, the Greens call for net-zero carbon by 2035 (15 years ahead of the legislated target), a just transition fund for workers in fossil fuel industries, keeping remaining coal and gas in the ground, and a climate charge on the agriculture sector.',
      source: 'https://www.greens.org.nz/policies/climate-and-energy',
      sourceLabel: 'Green Party climate policy (2024 update)',
    },
    act: {
      summary:
        "Wants to repeal the Zero Carbon Act and withdraw NZ from its 2030 Paris Agreement targets. Argues that NZ's 0.17% share of global emissions means domestic action has negligible climate impact while imposing real economic costs. Supports removing ETS obligations from the agriculture sector.",
      source: 'https://www.act.org.nz/climate',
      sourceLabel: 'ACT climate policy',
    },
    nzfirst: {
      summary:
        'Sceptical of climate change policy that raises costs for farmers and businesses. Secured the repeal of the agricultural emissions pricing scheme as a coalition condition. Supports the offshore oil and gas permit reversal. Takes a cautious approach on international climate commitments.',
      source: 'https://www.nzfirst.nz/policy',
      sourceLabel: 'NZ First policy platform',
    },
    tpm: {
      summary:
        'Frames climate change as a climate justice and indigenous rights issue. Supports an immediate moratorium on new fossil fuel extraction, Te Tiriti-based environmental governance, and reparations for Pacific communities bearing the worst impacts. Advocates 100% renewable energy.',
      source: 'https://www.maoriparty.org.nz/environment',
      sourceLabel: 'Te Pāti Māori environment policy',
    },
    top: {
      summary:
        "The Opportunity Party's platform centres on ocean health and clean energy. Advocates for 100% renewable electricity, protection of NZ's marine environment, and investment in clean tech industries. Supports a transition away from fossil fuels driven by innovation rather than just regulation.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "Conservative Party NZ is sceptical of climate alarmism and opposes policies that damage the economy or farming sector in the name of climate action. Does not support the Zero Carbon Act's targets as currently legislated. Believes adaptation is more practical than aggressive emissions reduction for a small country.",
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'Cannabis cultivation and hemp farming are highlighted as sustainable land uses. The ALCP notes that industrial hemp absorbs CO₂ and can replace high-emission materials like plastics and textiles. Climate policy is not a primary focus beyond this.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
  },

  health: {
    national: {
      summary:
        'Abolished the Māori Health Authority and replaced it with a single national health body (Health New Zealand). Focused on reducing surgical waitlists and investing in cancer treatment. Reversed free prescriptions — a $5 co-payment now applies, except for under-14s and community services card holders.',
      source: 'https://www.national.org.nz/our-policies/health',
      sourceLabel: 'National health policy',
    },
    labour: {
      summary:
        'Introduced free prescriptions for all (2023), which National reversed. Supports rebuilding the public health system. In opposition, advocates restoring the Māori Health Authority, reversing prescription co-payments, and increasing mental health funding. Opposes privatisation of health services.',
      source: 'https://www.labour.org.nz/health',
      sourceLabel: 'Labour health policy',
    },
    greens: {
      summary:
        'Supports universal free healthcare at point of use, including dental care. Calls for major investment in mental health and suicide prevention. Opposed abolition of the Māori Health Authority and supports kaupapa Māori health services. Advocates free prescriptions for all New Zealanders.',
      source: 'https://www.greens.org.nz/policies/health',
      sourceLabel: 'Green Party health policy',
    },
    act: {
      summary:
        'Supports more competition and consumer choice in health services, including expanding private providers funded by the public system. Favours health savings accounts and reducing health bureaucracy. Supported abolishing the Māori Health Authority.',
      source: 'https://www.act.org.nz/health',
      sourceLabel: 'ACT health policy',
    },
    nzfirst: {
      summary:
        'Focuses on rural health access — clinics, ambulance services and GP access in provincial areas. Supported free prescriptions and has raised concerns about health service cuts in smaller communities. Pushed for action on nurse and doctor shortages in regional NZ.',
      source: 'https://www.nzfirst.nz/policy',
      sourceLabel: 'NZ First policy platform',
    },
    tpm: {
      summary:
        'Strongly opposed abolition of the Māori Health Authority, designed to close health outcome gaps between Māori and non-Māori. Supports kaupapa Māori health services and Treaty-based health funding. Advocates for holistic Māori wellbeing (hauora) approaches and te reo Māori access to healthcare.',
      source: 'https://www.maoriparty.org.nz/health',
      sourceLabel: 'Te Pāti Māori health policy',
    },
    top: {
      summary:
        "The Opportunity Party supports evidence-based, well-funded public health. Advocates for preventive health investment to reduce long-term costs. While healthcare isn't the centrepiece of their 2026 platform, they support accessible public services and oppose cuts that worsen health outcomes.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "Conservative Party NZ holds socially conservative health positions — opposes euthanasia (End of Life Choice Act), opposes gender-affirming care for minors, and supports parental rights in children's healthcare decisions. Supports a well-funded but lean public health system. Opposes mandatory vaccination.",
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'The primary health position of the ALCP is cannabis law reform — decriminalisation and regulation for medicinal and recreational use. Argues that the criminal approach to cannabis causes more harm than the drug itself. Supports a harm-reduction model for all drug use.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
  },

  economy: {
    national: {
      summary:
        'Budget 2026 (28 May) confirmed a return to OBEGALx surplus in 2028/29 — around two years later than earlier forecasts — while cutting core Crown headcount from roughly 63,700 toward a 55,000 FTE target by 2029, alongside further departmental operating cuts. The May 2024 income tax bracket adjustments remain in place, but Budget 2026 introduced no further broad income tax cuts, instead raising a small new levy on banks and insurers. Continues to support pro-business regulatory reform and fiscal responsibility.',
      source: 'https://www.national.org.nz/policies/fiscal-plan',
      sourceLabel: 'National fiscal plan (Budget 2026)',
    },
    labour: {
      summary:
        'Confirmed a specific capital gains tax policy on 28 October 2025: a flat 28% on gains from residential-investment and commercial property (from 1 July 2027), exempting the family home, farms, KiwiSaver, shares, business assets and inheritances. The roughly $700 million a year raised is earmarked to fund three free GP visits a year for every New Zealander — described by Labour as the only tax policy it will campaign on in 2026. Also proposes a "NZ Future Fund" directing Crown-asset dividends into New Zealand businesses and jobs.',
      source: 'https://www.labour.org.nz/news/release-targeted-tax-to-grow-the-economy-and-fund-free-doctor-s-visits/',
      sourceLabel: 'Labour — capital gains tax announcement',
    },
    greens: {
      summary:
        "The Greens' 21 June 2026 tax plan raises the wealth tax threshold from $2 million to $10 million in net assets (rate unchanged at 2.5%), now projected to raise about $3.8–4.1 billion a year — a deliberate scale-back from earlier, larger estimates. Adds a tax-free income threshold up to about $10,000 and a 45% top rate, plus a 33% inheritance tax above $1 million, a 33% corporate tax rate for large companies, a bank-liability levy and a tax on offshore big-tech profits — a roughly $32 billion package in total, branded as taxing 'the cost of greed.'",
      source: 'https://www.greens.org.nz/greens_commit_to_tax_the_super_rich_and_large_corporates_fairly_cut_income_tax_for_96',
      sourceLabel: 'Green Party — tax the super-rich policy (Jun 2026)',
    },
    act: {
      summary:
        'Proposes a two-rate income tax system — 17.5% on income under $70,000 and 28% above it — aligning personal, trust and company tax rates, rather than a single flat rate for all earners. As a party of government since late 2023, ACT also points to savings already delivered, including roughly $7.5 billion from "mini-Budget" cuts and further savings from spending reviews and pay-equity changes. Continues to support a smaller public sector, deregulation and lower overall spending.',
      source: 'https://www.act.org.nz/economy',
      sourceLabel: 'ACT economic policy',
    },
    nzfirst: {
      summary:
        'Supports NZ manufacturing and domestic industry — wants government to "buy NZ made." Opposes asset sales of strategic infrastructure, including Kiwibank and Air New Zealand, backed by a proposed "National Interest Test." Wants to protect superannuation and not raise the eligibility age — reaffirmed as a top priority in 2026. Supports regional economic development spending.',
      source: 'https://www.nzfirst.nz/policy',
      sourceLabel: 'NZ First policy platform',
    },
    tpm: {
      summary:
        'Advocates a tiered wealth tax (2% over $2 million, 4% over $5 million, 8% over $10 million in net assets, projected to raise about $23 billion), new income tax brackets from 0% up to 48% on income over $300,000, restoring the company tax rate to 33%, a capital gains tax on property excluding the family home, and removing GST from food. Committed in November 2025 to an immediate rise in the minimum wage to $25 an hour with automatic annual increases. Wants Māori economic development backed by Treaty rights and asset returns.',
      source: 'https://www.maoriparty.org.nz/policy',
      sourceLabel: 'Te Pāti Māori policy platform',
    },
    top: {
      summary:
        "The Opportunity Party's \"Tax Reset\" is a three-part policy: a land value tax (1.75% a year on urban land, 0.5% on rural land), a Citizen's Income of about $370 a week for adults 18+ replacing Jobseeker, Student Allowance and Sole Parent Support, and a compulsory \"KiwiSaver 2.0\" with contributions rising to 6% each from employer and employee. Also proposes simplifying income tax to three brackets and a \"Citizens' Voice\" — citizen assemblies the size of Parliament, overseen by an independent Commissioner, to advise on major economic decisions.",
      source: 'https://www.opportunity.org.nz/tax-reset',
      sourceLabel: 'Opportunity — Tax Reset policy',
    },
    nc: {
      summary:
        'Now standing as Conservative Party NZ (renamed from New Conservative, January 2026), it continues to support a flat tax rate for individuals and companies aligned to the top personal rate, alongside a proposed cut to GST down to 12.5%. Wants significant reductions in government spending and opposes wealth taxes and capital gains taxes, arguing economic freedom and personal responsibility — not government intervention — create prosperity.',
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'Argues cannabis legalisation would create a significant new tax revenue stream, reduce policing and incarceration costs, and generate jobs in a regulated cannabis industry. Broader economic policy is not a focus of the party.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
  },

  treaty: {
    national: {
      summary:
        'Opposed the ACT-led Treaty Principles Bill at second reading (after supporting it to select committee). Has reduced co-governance in public services and health. Describes its approach as "one standard of citizenship" while acknowledging Treaty obligations in narrow contexts.',
      source: 'https://www.national.org.nz/our-policies/maori-affairs',
      sourceLabel: 'National Treaty/Māori policy',
    },
    labour: {
      summary:
        'Strong Treaty of Waitangi commitments — supports co-governance as a Treaty obligation, not a political choice. Established the Māori Health Authority and the He Puapua framework while in government (2017–2023). Strongly opposed the Treaty Principles Bill.',
      source: 'https://www.labour.org.nz/maori',
      sourceLabel: 'Labour Treaty/Māori policy',
    },
    greens: {
      summary:
        'Support full implementation of Te Tiriti o Waitangi and tino rangatiratanga. Have had Māori co-leaders and strong internal kaupapa Māori structures. Supported He Puapua and strongly opposed the Treaty Principles Bill. Support Māori electorates.',
      source: 'https://www.greens.org.nz/policies/treaty-of-waitangi',
      sourceLabel: 'Green Party Treaty policy',
    },
    act: {
      summary:
        "Introduced the Treaty Principles Bill (2023), seeking to redefine Treaty principles as equal rights for all citizens. The Bill passed its first reading with National support but did not progress. ACT wants to repeal all Treaty clauses from legislation and replace co-governance with equal citizenship.",
      source: 'https://www.act.org.nz/treaty',
      sourceLabel: 'ACT Treaty policy',
    },
    nzfirst: {
      summary:
        'Opposes co-governance and Treaty-based governance of public services. Wants a referendum on abolishing the seven Māori electorates. Secured the repeal of He Puapua as a coalition condition. Supports a "one law for all" approach.',
      source: 'https://www.nzfirst.nz/policy',
      sourceLabel: 'NZ First policy platform',
    },
    tpm: {
      summary:
        'Built on tino rangatiratanga — full Māori self-determination under Te Tiriti. Wants the Treaty to be the constitutional foundation of Aotearoa NZ, with Māori having equal authority with the Crown. Supports expanding Māori electorates. Strongly opposed any moves to diminish Treaty rights.',
      source: 'https://www.maoriparty.org.nz/treaty',
      sourceLabel: 'Te Pāti Māori Treaty policy',
    },
    top: {
      summary:
        "The Opportunity Party's platform does not prominently feature Treaty or Māori policy positions. The party acknowledges the importance of the Treaty and supports a respectful Crown-Māori relationship, but detailed policy in this area is not yet published.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "Conservative Party NZ supports 'one law for all' — opposing Treaty-based co-governance, Treaty clauses in legislation, and separate Māori electorates. Believes Treaty settlement processes should be concluded and the country move to a single constitutional framework that treats all citizens equally.",
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        "The ALCP notes that Māori are disproportionately criminalised under current cannabis laws, making drug law reform a Treaty justice issue. The party supports removing that inequity. Broader Treaty policy positions are not a stated focus of the party's platform.",
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
  },

  immigration: {
    national: {
      summary:
        'Increased the Accredited Employer Work Visa cap and streamlined skilled migrant pathways. Supports immigration for economic growth and skills shortages in health, construction, and tech. Has tightened lower-skilled temporary visa categories while keeping pathways open for high-value migrants.',
      source: 'https://www.national.org.nz/our-policies/immigration',
      sourceLabel: 'National immigration policy',
    },
    labour: {
      summary:
        "Supports managed immigration tied to skills shortages and regional needs. In government, temporarily reduced numbers during COVID then reopened borders. In opposition, has criticised exploitation risks for migrant workers under National's approach and wants stronger worker protections.",
      source: 'https://www.labour.org.nz/immigration',
      sourceLabel: 'Labour immigration policy',
    },
    greens: {
      summary:
        'Supports a humane, rights-based immigration system. Wants to end immigration detention (or use it as an absolute last resort), restore appeal rights removed from deportees, and provide clearer pathways to residency for long-term migrants. Opposes deportation to unsafe countries.',
      source: 'https://www.greens.org.nz/policies/immigration',
      sourceLabel: 'Green Party immigration policy',
    },
    act: {
      summary:
        'Wants immigration driven purely by economic contribution — a points-based system with minimal family reunification and strict refugee quotas. Supports reducing overall immigration numbers and removing low-skill temporary work visas. Supports citizenship only after long-term residency and economic contribution.',
      source: 'https://www.act.org.nz/immigration',
      sourceLabel: 'ACT immigration policy',
    },
    nzfirst: {
      summary:
        'Calls for strict immigration controls and significant reductions in overall numbers. Prioritises NZ citizens and permanent residents for jobs. Opposes fast-track work visas in sectors where NZers could be trained. Wants tighter checks on student visa abuse.',
      source: 'https://www.nzfirst.nz/policy',
      sourceLabel: 'NZ First policy platform',
    },
    tpm: {
      summary:
        'Takes a humanitarian approach — supports a robust refugee intake, family reunification, and an end to immigration detention. Wants recognition of Pacific peoples\' special relationship with NZ and simpler pathways for Pacific immigrants. Opposes exploitation of migrant workers.',
      source: 'https://www.maoriparty.org.nz/immigration',
      sourceLabel: 'Te Pāti Māori immigration policy',
    },
    top: {
      summary:
        "The Opportunity Party supports immigration that serves New Zealand's skills needs and economic goals, including in clean tech and innovation. Supports clear and fair immigration pathways. Detailed immigration policy for the 2026 election is not yet published.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        'Conservative Party NZ supports strict immigration controls, prioritising people who hold compatible values with NZ society as well as economic skills. Wants reduced overall immigration numbers, stronger enforcement of visa conditions, and faster deportation of those who breach them.',
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'Immigration is not a focus of the ALCP platform. The party is primarily single-issue (cannabis legalisation) and does not publish detailed immigration policy positions.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
  },

  education: {
    national: {
      summary:
        'Introduced a structured literacy and numeracy curriculum from 2025, mandating evidence-based phonics in primary schools. Reversed the previous curriculum refresh to focus on "back to basics." Extended free school lunches to all primary students. Supports charter (Partnership) schools.',
      source: 'https://www.national.org.nz/our-policies/education',
      sourceLabel: 'National education policy',
    },
    labour: {
      summary:
        'Introduced the free school lunches programme. Passed a new national curriculum including compulsory NZ history. In opposition, Labour opposes charter schools and the curriculum rollback. Supports early childhood education investment and pay equity for teachers.',
      source: 'https://www.labour.org.nz/education',
      sourceLabel: 'Labour education policy',
    },
    greens: {
      summary:
        'Supports free early childhood education from age 2, free tertiary education, and student loan debt cancellation. Wants significant teacher pay rises. Opposes charter schools. Advocates for te reo Māori immersion (kura kaupapa) funding and equity in school resourcing.',
      source: 'https://www.greens.org.nz/policies/education',
      sourceLabel: 'Green Party education policy',
    },
    act: {
      summary:
        "Supports charter (Partnership) schools and has overseen their return under the current government. Advocates school choice, transparent school performance data, and parental rights in education. Opposes what it describes as politically motivated curriculum content.",
      source: 'https://www.act.org.nz/education',
      sourceLabel: 'ACT education policy',
    },
    nzfirst: {
      summary:
        'Supports rural and regional school investment. Has backed the structured literacy approach and reduced curriculum overload. Wants tertiary vocational training expanded — particularly trades and technical skills. Generally supportive of the current government\'s education direction.',
      source: 'https://www.nzfirst.nz/policy',
      sourceLabel: 'NZ First policy platform',
    },
    tpm: {
      summary:
        'Prioritises te reo Māori immersion education — wants full government funding for kura kaupapa Māori and wharekura from early childhood through secondary. Supports free tertiary education and student loan cancellation. Wants the NZ history curriculum retained and strengthened. Opposes charter schools.',
      source: 'https://www.maoriparty.org.nz/education',
      sourceLabel: 'Te Pāti Māori education policy',
    },
    top: {
      summary:
        "The Opportunity Party supports evidence-based education with a focus on innovation, digital literacy, and equipping students for a changing economy. Backs investment in teachers and early childhood education. Detailed education policy for 2026 is still being developed.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        'Conservative Party NZ strongly supports parental rights in education — including the right to withdraw children from content parents object to on religious or values grounds. Opposes gender ideology being taught in schools. Supports traditional curricula, phonics, and structured numeracy. Backs school choice.',
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'The ALCP supports evidence-based drug and harm-reduction education in schools — replacing "just say no" approaches with factual information about drug risks. Broader education policy is not a focus of the party platform.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
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
      <div className="mb-5 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">{topic.icon}</span>
        <h2 className="text-xl font-bold text-white">{topic.label}</h2>
      </div>

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
        Parliamentary parties
      </h3>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARLIAMENTARY.map((party) => (
          <PolicyCard key={party.id} party={party} position={positions[party.id]} />
        ))}
      </div>

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Outside Parliament
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OUTSIDE_PARLIAMENT.map((party) => (
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
          Plain-English summaries of where each party stands on the issues that matter —
          side by side, with source links. No spin, no editorial slant. All 9 parties on the site included.
        </p>
      </header>

      {/* Disclaimer */}
      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-xs text-amber-200 leading-relaxed">
          <strong>Neutral disclaimer:</strong> Summaries are based on each party&apos;s publicly stated positions,
          official policy documents, and parliamentary record. Fair Say NZ does not endorse, rank, or recommend any party.
          Policies change — always check the official party website for the latest. Outside-Parliament parties may have
          limited publicly available policy detail.
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
      <div className="flex flex-col gap-16">
        {TOPICS.map((topic) => (
          <TopicSection key={topic.id} topic={topic} />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-16 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
        <p className="text-xs text-blue-200 leading-relaxed">
          <strong>Sources &amp; currency:</strong> Economy &amp; Tax summaries were re-checked in July 2026 against
          each party&apos;s current policy and 2025–2026 reporting, and updated accordingly — including Labour&apos;s
          capital gains tax, the Green Party&apos;s revised wealth-tax threshold and new tax measures, National&apos;s
          Budget 2026 fiscal targets, ACT&apos;s actual two-rate tax structure, and Te Pāti Māori&apos;s specific tax
          and wage figures. The other topics (Housing, Climate, Health, Treaty, Immigration, Education) still reflect
          each party&apos;s position as of mid-2025 and have not yet been re-verified for the 2026 election cycle.
          Mana Movement and Democracy NZ have been removed from these comparisons after deregistering with the
          Electoral Commission in 2021 and 2024 respectively. New Conservative is now Conservative Party NZ, renamed
          January 2026. Outside-Parliament parties publish varying levels of policy detail — where limited, this is
          noted in the summary. Always cross-check with the party&apos;s own website before forming a view.
        </p>
      </div>
    </main>
  );
}
