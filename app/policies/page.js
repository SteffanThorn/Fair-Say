import Link from 'next/link';

export const metadata = {
  title: 'Party Policies Compared',
  description:
    'NZ party policies on housing, climate, health, economy, Treaty, immigration and education — in plain English, side by side, no spin.',
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
  { id: 'mana',     name: 'Mana Movement',           short: 'MANA', color: '#7c3aed', href: '/parties/mana'           },
  { id: 'top',      name: 'The Opportunity Party',   short: 'TOP',  color: '#0891b2', href: '/parties/top'            },
  { id: 'nc',       name: 'New Conservative',        short: 'NC',   color: '#4f46e5', href: '/parties/new-conservative' },
  { id: 'alcp',     name: 'ALCP',                    short: 'ALCP', color: '#15803d', href: '/parties/alcp'           },
  { id: 'dnz',      name: 'Democracy NZ',            short: 'DNZ',  color: '#0369a1', href: '/parties/democracy-nz'   },
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
      source: 'https://www.nzfirst.org.nz/housing',
      sourceLabel: 'NZ First housing policy',
    },
    tpm: {
      summary:
        'Focuses on the Māori housing crisis — an estimated 30,000+ Māori households need homes. Supports papakāinga housing (communal Māori land housing), hapū-led housing developments, and Treaty-based housing funding. Opposed Kāinga Ora cuts, which disproportionately affect Māori.',
      source: 'https://www.maoriparty.org.nz/housing',
      sourceLabel: 'Te Pāti Māori housing policy',
    },
    mana: {
      summary:
        'Supports a large-scale social housing programme to end homelessness. Wants immediate rent freezes, a cap on rents, and investment in papakāinga housing for Māori. Views the housing crisis as a consequence of the commodification of homes and opposes property speculation.',
      source: 'https://www.mana.net.nz',
      sourceLabel: 'Mana Movement policy statements',
    },
    top: {
      summary:
        'The Opportunity Party supports an evidence-based approach to housing supply — removing planning barriers, investing in infrastructure, and using land value taxation to discourage land banking. Aims to make homeownership accessible across income levels, not just the wealthy.',
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "New Conservative supports market-led housing supply through deregulation and reducing red tape for builders. Opposes government-owned housing as a long-term solution, preferring private ownership. Wants to remove council planning restrictions that inflate land costs.",
      source: 'https://www.newconservative.nz',
      sourceLabel: 'New Conservative policy',
    },
    alcp: {
      summary:
        'Housing is not a primary focus of the ALCP platform. The party notes that legalising and taxing cannabis would generate government revenue that could be directed toward public services including housing.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
    dnz: {
      summary:
        'Democracy NZ supports deregulation and market-led housing supply, with binding referendums on major housing policy changes. Opposes large-scale government housing programmes and believes local communities should decide planning rules via referendums rather than central government mandates.',
      source: 'https://www.democracynz.org.nz',
      sourceLabel: 'Democracy NZ policy',
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
      source: 'https://www.nzfirst.org.nz/environment',
      sourceLabel: 'NZ First environment policy',
    },
    tpm: {
      summary:
        'Frames climate change as a climate justice and indigenous rights issue. Supports an immediate moratorium on new fossil fuel extraction, Te Tiriti-based environmental governance, and reparations for Pacific communities bearing the worst impacts. Advocates 100% renewable energy.',
      source: 'https://www.maoriparty.org.nz/environment',
      sourceLabel: 'Te Pāti Māori environment policy',
    },
    mana: {
      summary:
        'Supports an immediate moratorium on all new fossil fuel extraction and investment in renewable energy. Frames the climate crisis as disproportionately harming Māori and Pasifika communities, who should lead the response. Opposes corporate polluters and industrial agriculture without accountability.',
      source: 'https://www.mana.net.nz',
      sourceLabel: 'Mana Movement policy statements',
    },
    top: {
      summary:
        "The Opportunity Party's platform centres on ocean health and clean energy. Advocates for 100% renewable electricity, protection of NZ's marine environment, and investment in clean tech industries. Supports a transition away from fossil fuels driven by innovation rather than just regulation.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "New Conservative is sceptical of climate alarmism and opposes policies that damage the economy or farming sector in the name of climate action. Does not support the Zero Carbon Act's targets as currently legislated. Believes adaptation is more practical than aggressive emissions reduction for a small country.",
      source: 'https://www.newconservative.nz',
      sourceLabel: 'New Conservative policy',
    },
    alcp: {
      summary:
        'Cannabis cultivation and hemp farming are highlighted as sustainable land uses. The ALCP notes that industrial hemp absorbs CO₂ and can replace high-emission materials like plastics and textiles. Climate policy is not a primary focus beyond this.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
    dnz: {
      summary:
        'Democracy NZ believes major climate commitments — such as the Zero Carbon Act targets or ETS settings — should be subject to binding referendums before being imposed on the economy. Opposes policies that raise costs for farmers or small businesses without public consent.',
      source: 'https://www.democracynz.org.nz',
      sourceLabel: 'Democracy NZ policy',
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
      source: 'https://www.nzfirst.org.nz/health',
      sourceLabel: 'NZ First health policy',
    },
    tpm: {
      summary:
        'Strongly opposed abolition of the Māori Health Authority, designed to close health outcome gaps between Māori and non-Māori. Supports kaupapa Māori health services and Treaty-based health funding. Advocates for holistic Māori wellbeing (hauora) approaches and te reo Māori access to healthcare.',
      source: 'https://www.maoriparty.org.nz/health',
      sourceLabel: 'Te Pāti Māori health policy',
    },
    mana: {
      summary:
        'Supports fully free universal healthcare for all New Zealanders, with particular focus on eliminating Māori and Pasifika health disparities. Opposes any privatisation of health services. Wants mental health treated as a core part of the public health system, with adequate resourcing.',
      source: 'https://www.mana.net.nz',
      sourceLabel: 'Mana Movement policy statements',
    },
    top: {
      summary:
        "The Opportunity Party supports evidence-based, well-funded public health. Advocates for preventive health investment to reduce long-term costs. While healthcare isn't the centrepiece of their 2026 platform, they support accessible public services and oppose cuts that worsen health outcomes.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "New Conservative holds socially conservative health positions — opposes euthanasia (End of Life Choice Act), opposes gender-affirming care for minors, and supports parental rights in children's healthcare decisions. Supports a well-funded but lean public health system. Opposes mandatory vaccination.",
      source: 'https://www.newconservative.nz',
      sourceLabel: 'New Conservative policy',
    },
    alcp: {
      summary:
        'The primary health position of the ALCP is cannabis law reform — decriminalisation and regulation for medicinal and recreational use. Argues that the criminal approach to cannabis causes more harm than the drug itself. Supports a harm-reduction model for all drug use.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
    dnz: {
      summary:
        'Democracy NZ supports binding referendums on major health policy decisions, including end-of-life legislation and public health mandates. Opposed COVID-19 vaccine mandates. Believes healthcare decisions should reflect the will of the public, not technocratic or political elites.',
      source: 'https://www.democracynz.org.nz',
      sourceLabel: 'Democracy NZ policy',
    },
  },

  economy: {
    national: {
      summary:
        'Delivered income tax cuts in May 2024 (adjusted bracket thresholds) and cut government spending to return to surplus by 2026/27. Reduced public sector headcount. Supports pro-business regulatory reform and fiscal responsibility.',
      source: 'https://www.national.org.nz/our-policies/economy',
      sourceLabel: 'National economic policy',
    },
    labour: {
      summary:
        "Opposes National's spending cuts, arguing they are harming public services. Supports a fairer tax system, a potential capital gains tax, and protecting workers' rights. Wants to raise the minimum wage and restore collective bargaining protections.",
      source: 'https://www.labour.org.nz/economy',
      sourceLabel: 'Labour economic policy',
    },
    greens: {
      summary:
        'Proposes a Wealth Tax of 2.5% annually on net assets above $2 million, estimated to raise $10–14 billion per year. Advocates a top income tax rate of 45% on incomes above $180,000. Wants to invest the revenue in housing, health and climate transition.',
      source: 'https://www.greens.org.nz/policies/economy',
      sourceLabel: 'Green Party economy policy (2024 update)',
    },
    act: {
      summary:
        'Proposes a flat 17.5% income tax for all earners, with ~$14 billion in spending cuts to fund the reduction. Wants to significantly shrink the public sector, remove minimum wage increases, and eliminate much of the regulatory state. Believes lower taxes drive economic growth.',
      source: 'https://www.act.org.nz/economy',
      sourceLabel: 'ACT economic policy',
    },
    nzfirst: {
      summary:
        'Supports NZ manufacturing and domestic industry — wants government to "buy NZ made." Opposes asset sales of strategic infrastructure. Wants to protect superannuation and not raise the eligibility age. Supports regional economic development spending.',
      source: 'https://www.nzfirst.org.nz/economy',
      sourceLabel: 'NZ First economic policy',
    },
    tpm: {
      summary:
        'Advocates for economic justice and redistribution — a living wage, universal basic income trials, and ending child poverty. Wants Māori economic development backed by Treaty rights and asset returns. Supports a wealth tax and capital gains tax.',
      source: 'https://www.maoriparty.org.nz/economy',
      sourceLabel: 'Te Pāti Māori economic policy',
    },
    mana: {
      summary:
        "Strongly redistributive economic platform — wants a wealth tax, an end to corporate tax avoidance, a living wage for all workers, and a universal basic income. Advocates nationalisng key infrastructure and ending privatisation. Views poverty as a political choice, not an economic inevitability.",
      source: 'https://www.mana.net.nz',
      sourceLabel: 'Mana Movement policy statements',
    },
    top: {
      summary:
        "The Opportunity Party's signature economic policy is a 'Tax Reset' — likely centred on land value taxation as an alternative or supplement to income tax, to improve productivity and reduce inequality. Supports investment in innovation, clean tech and a Citizens' Voice mechanism for economic decisions.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        'New Conservative supports low flat taxes, free enterprise, and significant reductions in government spending. Opposes wealth taxes and capital gains taxes. Believes economic freedom and personal responsibility — not government intervention — create prosperity.',
      source: 'https://www.newconservative.nz',
      sourceLabel: 'New Conservative policy',
    },
    alcp: {
      summary:
        'Argues cannabis legalisation would create a significant new tax revenue stream, reduce policing and incarceration costs, and generate jobs in a regulated cannabis industry. Broader economic policy is not a focus of the party.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
    dnz: {
      summary:
        'Democracy NZ supports reduced government spending, lower taxes, and binding referendums on major fiscal decisions (such as raising debt ceilings or new taxes). Opposes wealth taxes. Believes voters, not politicians, should approve major economic policy changes.',
      source: 'https://www.democracynz.org.nz',
      sourceLabel: 'Democracy NZ policy',
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
      source: 'https://www.nzfirst.org.nz/treaty',
      sourceLabel: 'NZ First Treaty policy',
    },
    tpm: {
      summary:
        'Built on tino rangatiratanga — full Māori self-determination under Te Tiriti. Wants the Treaty to be the constitutional foundation of Aotearoa NZ, with Māori having equal authority with the Crown. Supports expanding Māori electorates. Strongly opposed any moves to diminish Treaty rights.',
      source: 'https://www.maoriparty.org.nz/treaty',
      sourceLabel: 'Te Pāti Māori Treaty policy',
    },
    mana: {
      summary:
        'Holds the most expansive Treaty position — Māori sovereignty (tino rangatiratanga) as supreme, with the Crown fulfilling its Treaty obligations in full. Supports abolition of the current constitutional arrangement in favour of a Treaty-based constitution. Opposes any reduction of Māori rights.',
      source: 'https://www.mana.net.nz',
      sourceLabel: 'Mana Movement policy statements',
    },
    top: {
      summary:
        "The Opportunity Party's platform does not prominently feature Treaty or Māori policy positions. The party acknowledges the importance of the Treaty and supports a respectful Crown-Māori relationship, but detailed policy in this area is not yet published.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        "New Conservative supports 'one law for all' — opposing Treaty-based co-governance, Treaty clauses in legislation, and separate Māori electorates. Believes Treaty settlement processes should be concluded and the country move to a single constitutional framework that treats all citizens equally.",
      source: 'https://www.newconservative.nz',
      sourceLabel: 'New Conservative policy',
    },
    alcp: {
      summary:
        "The ALCP notes that Māori are disproportionately criminalised under current cannabis laws, making drug law reform a Treaty justice issue. The party supports removing that inequity. Broader Treaty policy positions are not a stated focus of the party's platform.",
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
    dnz: {
      summary:
        "Democracy NZ opposes Treaty-based co-governance and wants a binding referendum on the Treaty Principles. Like NZ First, advocates 'one law for all' and the abolition of Māori electorates via referendum. Argues major constitutional changes related to the Treaty should require public approval.",
      source: 'https://www.democracynz.org.nz',
      sourceLabel: 'Democracy NZ policy',
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
      source: 'https://www.nzfirst.org.nz/immigration',
      sourceLabel: 'NZ First immigration policy',
    },
    tpm: {
      summary:
        'Takes a humanitarian approach — supports a robust refugee intake, family reunification, and an end to immigration detention. Wants recognition of Pacific peoples\' special relationship with NZ and simpler pathways for Pacific immigrants. Opposes exploitation of migrant workers.',
      source: 'https://www.maoriparty.org.nz/immigration',
      sourceLabel: 'Te Pāti Māori immigration policy',
    },
    mana: {
      summary:
        'Supports a humane immigration system with strong humanitarian and refugee intake, particularly for Pacific communities. Opposes immigration detention. Wants immigration policy to reflect NZ\'s Pacific identity and obligations. Focuses on exploitation of migrant workers in primary industries.',
      source: 'https://www.mana.net.nz',
      sourceLabel: 'Mana Movement policy statements',
    },
    top: {
      summary:
        "The Opportunity Party supports immigration that serves New Zealand's skills needs and economic goals, including in clean tech and innovation. Supports clear and fair immigration pathways. Detailed immigration policy for the 2026 election is not yet published.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        'New Conservative supports strict immigration controls, prioritising people who hold compatible values with NZ society as well as economic skills. Wants reduced overall immigration numbers, stronger enforcement of visa conditions, and faster deportation of those who breach them.',
      source: 'https://www.newconservative.nz',
      sourceLabel: 'New Conservative policy',
    },
    alcp: {
      summary:
        'Immigration is not a focus of the ALCP platform. The party is primarily single-issue (cannabis legalisation) and does not publish detailed immigration policy positions.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
    dnz: {
      summary:
        'Democracy NZ calls for tighter immigration controls and wants major changes to immigration settings to require a binding referendum. Prioritises New Zealanders for jobs and housing. Opposes importing workers to fill roles that NZers could fill with training.',
      source: 'https://www.democracynz.org.nz',
      sourceLabel: 'Democracy NZ policy',
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
      source: 'https://www.nzfirst.org.nz/education',
      sourceLabel: 'NZ First education policy',
    },
    tpm: {
      summary:
        'Prioritises te reo Māori immersion education — wants full government funding for kura kaupapa Māori and wharekura from early childhood through secondary. Supports free tertiary education and student loan cancellation. Wants the NZ history curriculum retained and strengthened. Opposes charter schools.',
      source: 'https://www.maoriparty.org.nz/education',
      sourceLabel: 'Te Pāti Māori education policy',
    },
    mana: {
      summary:
        'Supports free education at all levels, from early childhood through tertiary. Strongly advocates for te reo Māori immersion education and kura kaupapa. Wants student loan debt cancelled. Opposes charter schools. Emphasises education as a right, not a commodity.',
      source: 'https://www.mana.net.nz',
      sourceLabel: 'Mana Movement policy statements',
    },
    top: {
      summary:
        "The Opportunity Party supports evidence-based education with a focus on innovation, digital literacy, and equipping students for a changing economy. Backs investment in teachers and early childhood education. Detailed education policy for 2026 is still being developed.",
      source: 'https://www.opportunity.org.nz',
      sourceLabel: 'The Opportunity Party platform',
    },
    nc: {
      summary:
        'New Conservative strongly supports parental rights in education — including the right to withdraw children from content parents object to on religious or values grounds. Opposes gender ideology being taught in schools. Supports traditional curricula, phonics, and structured numeracy. Backs school choice.',
      source: 'https://www.newconservative.nz',
      sourceLabel: 'New Conservative policy',
    },
    alcp: {
      summary:
        'The ALCP supports evidence-based drug and harm-reduction education in schools — replacing "just say no" approaches with factual information about drug risks. Broader education policy is not a focus of the party platform.',
      source: 'https://www.alcp.org.nz',
      sourceLabel: 'ALCP platform',
    },
    dnz: {
      summary:
        'Democracy NZ supports parental rights in education and wants controversial curriculum changes (such as gender-related content or revised history) to be subject to community consultation or referendums. Supports a return to core literacy and numeracy skills and school choice.',
      source: 'https://www.democracynz.org.nz',
      sourceLabel: 'Democracy NZ policy',
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
          side by side, with source links. No spin, no editorial slant. All 11 parties on the site included.
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
          <strong>Sources &amp; currency:</strong> Policy summaries reflect each party&apos;s position as of
          mid-2025 based on official party websites and parliamentary voting records. The Green Party updated
          several key policies in 2024 under Chlöe Swarbrick&apos;s leadership — including the wealth tax
          threshold, rent controls, and the 2035 net-zero target. Outside-Parliament parties (Mana, TOP, New
          Conservative, ALCP, Democracy NZ) publish varying levels of policy detail — where limited, this is noted
          in the summary. Always cross-check with the party&apos;s own website before forming a view.
        </p>
      </div>
    </main>
  );
}
