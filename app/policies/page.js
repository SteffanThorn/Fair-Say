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
        'Passed the Fast-track Approvals Act 2024, which has enabled roughly 55,000 new homes across 44 approved projects. In December 2025 introduced the Planning Bill and Natural Environment Bill to replace the RMA entirely, forcing councils to zone for 30 years of housing demand upfront (new system expected live by 2029). Budget 2026 added a Flexible Fund for up to 770 social/affordable homes and a $400 million council "Incentives for Growth" fund through 2029/30.',
      source: 'https://www.national.org.nz/policies/housing-growth',
      sourceLabel: 'National housing policy',
    },
    labour: {
      summary:
        "Would scrap the government's emergency-housing target and reverse its Income-Related Rent Subsidy and Accommodation Supplement changes, arguing they effectively subsidise landlords. Continues to oppose Kāinga Ora asset sales and sits alongside Labour's 28% capital gains tax on investment property (announced 28 October 2025), earmarked mainly to fund free GP visits rather than housing directly.",
      source: 'https://www.rnz.co.nz/news/politics/642736/labour-pledges-to-scrap-emergency-housing-target-if-it-wins-election',
      sourceLabel: 'RNZ — Labour housing pledges (2026)',
    },
    greens: {
      summary:
        "Launched \"A Home for Everybody\" on 26 March 2026: a Renters' Rights Bill capping rent increases at 2% a year, ending no-cause evictions, and introducing a rental Warrant of Fitness. Also pledges tens of thousands of new public homes, reversing restored landlord interest deductibility, and a \"Home For Life\" rent-to-buy scheme (10,000 homes over 10 years), funded by the party's wealth tax.",
      source: 'https://www.greens.org.nz/greens_announce_plan_to_end_homelessness_fix_housing_crisis',
      sourceLabel: 'Green Party — A Home for Everybody (26 Mar 2026)',
    },
    act: {
      summary:
        "Wants to repeal the RMA outright and replace it with a property-rights-based Urban Development Act plus a narrower Environmental Protection Act — going further than the coalition's own Planning Bill, which ACT has publicly criticised as insufficient to fix the housing crisis. Remains a governing partner backing that reform through Parliament in the meantime.",
      source: 'https://www.act.org.nz/press-releases/rma-bill-won-t-solve-the-housing-crisis',
      sourceLabel: 'ACT — RMA Bill criticism',
    },
    nzfirst: {
      summary:
        "Standing policy calls for a non-political Housing Commission and a Ministry for Infrastructure to unlock land for housing long-term, plus a dedicated seniors' housing plan given rising numbers of older renters. No freshly dated 2025–2026 announcement was found on this topic — this reflects the party's ongoing position rather than new campaign material.",
      source: 'https://www.rnz.co.nz/news/politics/499599/winston-s-wishes-what-nz-first-is-campaigning-on',
      sourceLabel: 'RNZ — NZ First policy platform',
    },
    tpm: {
      summary:
        '"Whānau Build" policy commits half of all new social housing to Māori whānau, who make up roughly half the social-housing waitlist, removes legal barriers to building on papakāinga land, and proposes a 2% tax on homes left vacant 3+ months a year. Also wants to stop freehold land sales to offshore buyers.',
      source: 'https://www.maoriparty.org.nz/whanau_build',
      sourceLabel: 'Te Pāti Māori — Whānau Build housing policy',
    },
    top: {
      summary:
        'Centrepiece is a land value tax on urban land (reported around 1.75% in 2026 coverage) intended to curb land-banking, paired with a "Modern House Building Boom" plan for streamlined consenting of tiny homes, nationally consistent zoning, mixed-use zoning and low-cost construction loans to close what TOP estimates as an 80,000-home shortfall.',
      source: 'https://www.opportunity.org.nz/affordable_housing',
      sourceLabel: 'The Opportunity Party — housing policy',
    },
    nc: {
      summary:
        "Housing policy is limited to a general commitment to cut red tape and regulatory barriers to increase supply over the long term, without a detailed costed programme comparable to other parties.",
      source: 'https://www.conservatives.nz/policy',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'No dedicated housing policy. Argues legalising and taxing cannabis would generate revenue that could help fund housing and infrastructure without relying on selling assets to overseas investors, which it says inflates property prices.',
      source: 'https://alcp.org.nz/policy/',
      sourceLabel: 'ALCP platform',
    },
  },

  climate: {
    national: {
      summary:
        "In November 2025 amended the Climate Change Response Act so ETS settings only need to align with NZ's domestic 2050 net-zero law rather than its international Paris pledge, moved ETS reviews from annual to biennial, and pushed the Carbon Neutral Government Programme deadline from 2025 out to 2050. Parliament also passed an adjusted, more lenient biogenic methane target in December 2025.",
      source: 'https://www.national.org.nz/news/20251104-hon-simon-watts-improving-new-zealand-climate-change-act',
      sourceLabel: 'National/Beehive — Climate Change Act amendments (4 Nov 2025)',
    },
    labour: {
      summary:
        'Opposes the coalition\'s removal of the offshore oil and gas exploration ban and has pledged to reinstate it, alongside a 100% renewable electricity target by 2030, a no-upfront-cost residential solar scheme, and phasing out coal-fired boilers. In February 2026 signalled it would work more closely with the Greens on climate policy during the campaign and in any future government.',
      source: 'https://www.labour.org.nz/news-climatechange',
      sourceLabel: 'Labour — climate policy',
    },
    greens: {
      summary:
        'Commits to legally ending fossil fuel use and production by no later than 2035, banning new baseload fossil-fuel electricity generation so all new supply is renewable, and phasing out synthetic nitrogen fertiliser alongside reduced livestock stocking rates — explicitly aligned to a 1.5°C target.',
      source: 'https://www.greens.org.nz/climate_change_policy',
      sourceLabel: 'Green Party — Climate Change Policy',
    },
    act: {
      summary:
        "Its \"Better Climate Deal\" platform (detailed further 10 June 2026) proposes managing biogenic methane to a \"no additional warming\" standard rather than net-zero, keeping agriculture out of the ETS entirely, capping emissions in line with trading partners' actual reductions, and renegotiating — or potentially leaving — the Paris Agreement if a revised methane target isn't accepted.",
      source: 'https://www.interest.co.nz/public-policy/138910/act-party-climate-policy-outlines-desire-revisit-new-zealands-emissions',
      sourceLabel: 'interest.co.nz — ACT climate policy (10 Jun 2026)',
    },
    nzfirst: {
      summary:
        "Leader Winston Peters has campaigned since Fieldays (June 2026) for New Zealand to withdraw from the Paris Agreement entirely, calling it something the country \"can't afford\" given NZ's 0.17% share of global emissions, and opposes the Climate Change Commission's advisory role in favour of targets set directly by elected politicians — a position that goes further than current coalition government policy.",
      source: 'https://www.nzherald.co.nz/nz/politics/election-2026-nz-first-leader-winston-peters-takes-on-national-own-government-policy-at-fieldays-would-ditch-paris-climate-agreement-questions-rates-cap/premium/H2EVD6MRPJFJHIJ2VM5GEMCBMM/',
      sourceLabel: 'NZ Herald — Peters on Paris Agreement (Jun 2026)',
    },
    tpm: {
      summary:
        'Opposes seabed mining and deep-sea oil and gas exploration, and frames climate action around protecting whenua and moana and investing in resilience for the most at-risk communities under a Te Tiriti lens. Has criticised government emissions budgets as too weak, though climate is not a headline plank of its 2026 campaign, which foregrounds health, housing and education.',
      source: 'https://www.maoriparty.org.nz/policy',
      sourceLabel: 'Te Pāti Māori — Policy hub',
    },
    top: {
      summary:
        '"Abundant Energy" plan seeks cross-party agreement to add 30GW of renewable generation by 2050 and consolidate 29 electricity distributors into no more than 8. On the ETS, wants agricultural emissions included, new pine forestry excluded from earning carbon credits, and sequestration funding redirected toward soils, wetlands and biodiversity.',
      source: 'https://www.opportunity.org.nz/climate_action',
      sourceLabel: 'The Opportunity Party — Climate policy',
    },
    nc: {
      summary:
        "Commits broadly to \"conserving and enhancing the natural environment\" while supporting continued use of New Zealand's own fossil fuels and minerals, including domestic oil refining — i.e. opposing further restrictions on domestic extraction. No specific, dated 2025–2026 position on the ETS or the Net Zero 2050 target could be confirmed.",
      source: 'https://www.conservatives.nz/policy',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'No climate policy with numeric targets. Frames large-scale industrial hemp cultivation as a climate tool, citing its fast growth, drought resistance, soil-restoration properties and use as a biodegradable and biofuel alternative to plastics.',
      source: 'https://alcp.org.nz/policy/',
      sourceLabel: 'ALCP platform',
    },
  },

  health: {
    national: {
      summary:
        'Budget 2026 (28 May) added over $5.8 billion in new health operating funding across the forecast period, including a $1.37 billion annual uplift for frontline cost pressures, restored health targets with quarterly public reporting, expanded cancer-medicine funding, and free continuous glucose monitors for under-18s with type-1 diabetes. The Māori Health Authority, abolished in 2024, has not been reinstated and no Māori-specific funding stream has replaced it.',
      source: 'https://www.national.org.nz/health',
      sourceLabel: 'National health policy / Budget 2026',
    },
    labour: {
      summary:
        'Centrepiece is a "Medicard" offering three free GP visits a year for everyone, free prescriptions from 1 July 2027, free maternity scans from July 2028 and free cervical screening, funded by Labour\'s proposed capital gains tax. Has also stood by an earlier pledge to reinstate a Māori Health Authority, though has not freshly restated it with 2026-specific detail.',
      source: 'https://www.nzherald.co.nz/nz/politics/chris-hipkins-announces-labours-new-health-policy/HIPMAOPL2HJO4GQHOJ7GB5JSJI/',
      sourceLabel: 'NZ Herald — Labour health policy',
    },
    greens: {
      summary:
        'Campaigns for a fully funded public health system with better pay and conditions for health workers, free GP visits and prescriptions, and a free universal dental service. Broader fiscal policy would lift government revenue and spending specifically to fund universal health, education and social services rather than private alternatives.',
      source: 'https://www.greens.org.nz/health_policy',
      sourceLabel: 'Green Party — Health Policy',
    },
    act: {
      summary:
        'Wants Pharmac and Medsafe reform — a published medicines strategy, funding tied to productivity impact, and one-week approval for drugs already cleared by trusted overseas regulators — plus pharmacists taking on more primary care (skin checks, blood tests, managing long-term medication) to ease GP pressure. Backed abolishing the Māori Health Authority and wants further removal of ethnicity-based provisions from health legislation.',
      source: 'https://www.act.org.nz/health',
      sourceLabel: 'ACT health policy',
    },
    nzfirst: {
      summary:
        "2026 focus is dominated by vaccine-mandate accountability — a select-committee inquiry into alleged Covid-vaccination injuries, compensation, and criticism of prior government advice on myocarditis risk in under-18s — alongside opposition to Health and Safety reform and renewed questioning of NZ's funding of the World Health Organization. Previously secured repeal of the Therapeutic Products Act as a coalition condition.",
      source: 'https://www.nzfirst.nz/power_to_the_people_sotn_2026',
      sourceLabel: 'NZ First — State of the Nation speech (23 Mar 2026)',
    },
    tpm: {
      summary:
        'Would rebuild a Māori-led health authority to replace the disestablished Te Aka Whai Ora, shift the system toward prevention rather than crisis response, and ensure services are culturally safe, accessible and accountable to whānau-centred models of wellbeing.',
      source: 'https://www.maoriparty.org.nz/policy',
      sourceLabel: 'Te Pāti Māori — Policy hub',
    },
    top: {
      summary:
        '"Healthy People" policy argues every $1 spent on primary care saves over $13 downstream, and proposes a cross-party, decade-long health plan insulated from election cycles, more investment in prevention and digital health, better-funded ambulance and GP services, and reinstating lapsed Smokefree 2025 legislation. Full costed detail was still pending as of mid-2026.',
      source: 'https://www.opportunity.org.nz/healthy_people',
      sourceLabel: 'The Opportunity Party — Healthy People policy',
    },
    nc: {
      summary:
        "No detailed, costed health policy is published. The closest relevant plank opposes \"medical coercion\" and mandates, an anti-mandate stance carried over from the pandemic era, rather than a broader health-system programme.",
      source: 'https://www.conservatives.nz/policy',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'Treats cannabis and drug use as a public-health rather than criminal-justice issue, estimating reclassification could cut the prison population by roughly 10,000 people a year. Proposes a medicinal-cannabis card, funded drug education and research, and removing licensing barriers to hemp growing.',
      source: 'https://alcp.org.nz/policy/',
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
        'As part of the National–NZ First coalition agreement, Cabinet is rewriting Treaty of Waitangi references across roughly 23 pieces of legislation — revealed 20 April 2026 — replacing the stronger "give effect to" duty with the weaker "take into account" standard. This follows the defeat of ACT\'s separate Treaty Principles Bill in April 2025 (which National only supported to select committee), and Luxon also faces pressure over a possible referendum on the Māori electoral seats.',
      source: 'https://www.teaonews.co.nz/2026/04/20/analysis-government-set-to-reduce-treaty-in-legislation-to-lowest-possible-standard-what-it-means/',
      sourceLabel: 'Te Ao Māori News — Treaty clause rewrite (20 Apr 2026)',
    },
    labour: {
      summary:
        "Hipkins maintains Māori did not cede sovereignty in 1840 and is open to further checks ensuring legislation honours the Treaty, but has explicitly ruled out supporting Te Pāti Māori's proposed Te Tiriti commissioner with veto power over Parliament. Labour has otherwise been relatively quiet on detailed Treaty/constitutional policy through 2025–2026, prioritising cost-of-living, housing and health instead.",
      source: 'https://www.rnz.co.nz/news/politics/540965/labour-would-not-support-te-tiriti-commissioner-with-veto-right-hipkins',
      sourceLabel: 'RNZ — Labour on Te Tiriti commissioner',
    },
    greens: {
      summary:
        'Treats Te Tiriti o Waitangi and He Whakaputanga as founding constitutional documents, affirms the Māori-language text as authoritative, and wants a fully resourced Waitangi Tribunal with binding decision-making power. Its "Hoki Whenua Mai" policy would stop future Public Works Act land takings and create a path to return previously taken whenua Māori, and in 2026 it has campaigned against the government\'s Treaty-clause rewrite alongside Labour and Te Pāti Māori.',
      source: 'https://www.greens.org.nz/te_tiriti_policy',
      sourceLabel: 'Green Party — Te Tiriti o Waitangi policy',
    },
    act: {
      summary:
        'Its Treaty Principles Bill, which sought to legally redefine Treaty principles subject to referendum, was voted down at second reading on 10 April 2025 with every other party opposed. Leader David Seymour says he remains committed to the underlying goal of equal legal rights and, as of late 2025, signalled ACT would pursue it through a different legislative vehicle in the 2026 campaign rather than reintroducing the same bill.',
      source: 'https://www.rnz.co.nz/news/top/581907/david-seymour-promises-to-reignite-treaty-principles-debate-in-2026',
      sourceLabel: 'RNZ — Seymour on reigniting Treaty debate (16 Dec 2025)',
    },
    nzfirst: {
      summary:
        'Opposes co-governance outright — Peters\' March 2026 State of the Nation speech reiterated "one people, one law, one flag" — and is campaigning on a referendum to abolish the dedicated Māori electorates. Secured restoration of local referendums on Māori wards via the coalition agreement and is a co-driver, with National, of the 2026 Treaty-clause legislative rewrite.',
      source: 'https://www.nzfirst.nz/power_to_the_people_sotn_2026',
      sourceLabel: 'NZ First — State of the Nation speech (23 Mar 2026)',
    },
    tpm: {
      summary:
        'Platform, "Mana Motuhake," centres on Te Tiriti-based constitutional transformation and strengthened Māori political and governance structures, arguing that without constitutional change any gains can be undone by the next government. For 2026 is contesting all seven Māori electorates and has signalled reversing the government\'s Treaty-clause changes would be a bottom line in any coalition talks.',
      source: 'https://www.maoriparty.org.nz/policy',
      sourceLabel: 'Te Pāti Māori — Policy hub',
    },
    top: {
      summary:
        '"Honouring Te Tiriti" policy commits to repealing the Treaty Principles Bill and the Marine and Coastal Area Amendment Bill if either passes, embedding Aotearoa history and Te Tiriti education at all school levels, growing the te reo Māori teaching workforce, and pursuing more equitable Treaty settlements.',
      source: 'https://www.opportunity.org.nz/honouring_te_tiriti',
      sourceLabel: 'The Opportunity Party — Honouring Te Tiriti policy',
    },
    nc: {
      summary:
        'No standalone Treaty or Māori-specific policy is published. The closest related plank, "One Nation," emphasises unified national representation over group-based rights, implying opposition to co-governance and Māori-specific representation, though a dedicated policy page could not be confirmed in full.',
      source: 'https://www.conservatives.nz/policy',
      sourceLabel: 'Conservative Party NZ policy',
    },
    alcp: {
      summary:
        'The party\'s constitution states support for "the principles of partnership embodied in the Treaty of Waitangi," but it has no developed Treaty policy platform beyond this founding statement — its focus remains almost entirely on cannabis law reform.',
      source: 'https://elections.nz/assets/Party-files/the-cannabis-party-rules-and-constitution.pdf',
      sourceLabel: 'ALCP — Rules and Constitution (Elections NZ filing)',
    },
  },

  immigration: {
    national: {
      summary:
        "Under Immigration Minister Erica Stanford, introduced the multi-entry \"Parent Boost\" visa (opened 29 Sept 2025) letting migrants' parents stay 5–10 years, the Immigration (Enhanced Risk Management) Amendment Bill (18 March 2026) extending deportation liability to 20 years for residence-class visa holders with serious convictions, and Skilled Migrant Category changes from 24 August 2026 simplifying wage settings. Frames its approach as \"quality over quantity\" — prioritising skilled migrants while tightening compliance.",
      source: 'https://www.national.org.nz/news/20260318-hon-erica-stanford-immigration-bill-to-hold-people-accountable-for-serious-offending',
      sourceLabel: 'National / Immigration NZ — Immigration Bill & Skilled Migrant changes',
    },
    labour: {
      summary:
        'Has not published a detailed, finalised immigration policy as of mid-2026. In May 2026 Hipkins accused Luxon of "embracing the anti-migrant rhetoric" of his coalition partners, arguing NZ shouldn\'t have to choose between migration and business viability, and favours balancing skills-based migration with stronger enforcement against migrant-worker exploitation.',
      source: 'https://www.rnz.co.nz/news/top/595198/christopher-luxon-embracing-anti-migrant-rhetoric-of-coalition-partners-hipkins',
      sourceLabel: 'RNZ — Hipkins on migration rhetoric (May 2026)',
    },
    greens: {
      summary:
        'Standing policy calls for a humane, Tiriti-based system: progressively raising the refugee quota toward 5,000, a residency pathway for long-term temporary migrants, equal pay and conditions for migrant workers, and a proposed "Pacific Passport" for climate-displaced Pacific peoples.',
      source: 'https://www.greens.org.nz/immigration_policy',
      sourceLabel: 'Green Party — Immigration Policy',
    },
    act: {
      summary:
        'Unveiled a six-point immigration toughening plan on 3 May 2026: English-language requirements for all work-visa holders (seasonal workers exempt), a $6-per-day infrastructure surcharge on temporary work visas, a five-year welfare stand-down for new residents, annual review of skill-shortage visa categories, extended deportation powers, and a dedicated overstayer enforcement unit including gig-platform visa checks.',
      source: 'https://www.nzherald.co.nz/nz/politics/election-2026-act-reveals-immigration-campaign-polices/WTABGHRF5JACTK2HZ5AEH74EJ4/',
      sourceLabel: 'NZ Herald — ACT immigration policy (3 May 2026)',
    },
    nzfirst: {
      summary:
        'Pushes to substantially cut net migration until infrastructure catches up. Signature 2026 policy, first announced September 2025, is a mandatory "Kiwi values statement" new migrants must sign committing to democracy, free speech and other stated NZ values, and Peters has accused National of "covertly" loosening settings via the India free-trade agreement.',
      source: 'https://www.rnz.co.nz/news/political/572423/winston-peters-reheats-policy-of-getting-migrants-to-abide-by-nz-values',
      sourceLabel: 'RNZ — NZ First "values statement" policy (7 Sept 2025)',
    },
    tpm: {
      summary:
        "Frames immigration through Te Tiriti o Waitangi, arguing Māori should have genuine partnership input into population-growth decisions so migration doesn't further push Māori out of housing and economic participation. No standalone, dated immigration policy document is published.",
      source: 'https://www.maoriparty.org.nz/policy',
      sourceLabel: 'Te Pāti Māori — Policy hub',
    },
    top: {
      summary:
        "No immigration policy has been published as of mid-2026 — it isn't yet among the finalised sections of TOP's policy platform, with the party saying more detail will come closer to the election.",
      source: 'https://www.rnz.co.nz/news/politics/642464/explainer-what-is-the-opportunity-party-and-what-are-its-policies',
      sourceLabel: 'RNZ — Explainer: TOP policies (2026)',
    },
    nc: {
      summary:
        "No current, dated immigration policy could be confirmed — the party's most recent policy announcement (6 July 2026) covered finance, trade, foreign affairs and defence but not immigration.",
      source: 'https://www.scoop.co.nz/stories/PO2607/S00041/conservative-party-new-policies-announcement.htm',
      sourceLabel: 'Scoop — Conservative Party NZ policy announcement (6 Jul 2026)',
    },
    alcp: {
      summary:
        "Not a general immigration platform. Its policy document argues cannabis convictions in other jurisdictions shouldn't bar people from migrating to New Zealand, citing a past high-profile deportation case as an example of perceived injustice.",
      source: 'https://alcp.org.nz/policy/',
      sourceLabel: 'ALCP platform',
    },
  },

  education: {
    national: {
      summary:
        'Structured literacy has been mandatory in all state primary schools since Term 1 2025. In 2026 confirmed NCEA Level 1 will be abolished in favour of a new Year 11 Foundational Award, with new Year 12/13 qualifications and A–E grading rolling out from 2028. The Education and Training (System Reform) Amendment Bill, passed 24 June 2026, also gives charter schools 20-year contracts and restructures the Teaching Council under tighter ministerial control.',
      source: 'https://www.rnz.co.nz/news/political/595424/government-confirms-ncea-replacement-details',
      sourceLabel: 'RNZ — NCEA replacement confirmed (2026)',
    },
    labour: {
      summary:
        "Pledged in April 2026 to reinstate school boards' Treaty obligations and reverse the coalition's curriculum and testing changes. Its most concrete 2026 policy, announced 28 June, expands Apprenticeship Boost back to two years from 2028, adds new eligible trades, and offers a $1,000 toolkit grant for apprentices — projected to grow beneficiaries from 9,000 to 27,000 by 2030/31.",
      source: 'https://www.rnz.co.nz/news/politics/633845/election-26-labour-proposes-apprenticeship-boost-expansion',
      sourceLabel: 'RNZ — Labour Apprenticeship Boost expansion (28 Jun 2026)',
    },
    greens: {
      summary:
        'Opposes the government\'s NCEA replacement as a step backward, and has pledged to reinstate fees-free tertiary education after the government confirmed on 9 May 2026 that the scheme ends after 2026 enrolments. Also proposes capping early-childhood fees at $10 a day on top of existing free hours, and a $315 million funding boost for inclusive education.',
      source: 'https://www.rnz.co.nz/news/politics/594728/green-party-criticises-government-s-outrageous-decision-to-scrap-fees-free-tertiary-education',
      sourceLabel: 'RNZ — Greens on scrapping fees-free tertiary (9 May 2026)',
    },
    act: {
      summary:
        "Driving force behind charter (partnership) schools, now numbering 14 after three more opened Term 1 2026, and secured the 20-year charter contracts and tighter ministerial control of the Teaching Council in the June 2026 reform bill. Future priorities include per-student \"Student Education Accounts,\" published school league tables, and performance-based teacher pay.",
      source: 'https://waateanews.com/2026/05/28/act-pushes-charter-schools-expansion-as-seymour-eyes-budget-backing/',
      sourceLabel: 'Waatea News — ACT charter schools expansion (28 May 2026)',
    },
    nzfirst: {
      summary:
        'Takes credit within the coalition for scrapping gender-inclusive Relationships and Sexuality Education guidelines and ending puberty blockers for minors. Its most significant 2026 move was pushing to end the fees-free university scheme — confirmed 9 May 2026 — with funding redirected toward trades and vocational training instead.',
      source: 'https://www.1news.co.nz/2026/05/09/end-of-fees-free-scheme-confirmed-after-peters-budget-leak/',
      sourceLabel: '1News — End of fees-free scheme confirmed (9 May 2026)',
    },
    tpm: {
      summary:
        'Policy rests on properly resourcing kaupapa Māori education, including a proposed independent Māori Standards Authority to oversee te reo funding and cultural-competency standards, and embedding mātauranga Māori and fairly paid Māori cultural leadership roles across the mainstream system.',
      source: 'https://www.maoriparty.org.nz/education_training',
      sourceLabel: 'Te Pāti Māori — Education & Training policy',
    },
    top: {
      summary:
        '"Future-fit Education" is listed among TOP\'s policy areas but detailed content had not been published as of mid-2026. The one confirmed element is support for teaching Aotearoa New Zealand history, including the Treaty of Waitangi, at all school levels, and growing the number of te reo Māori teachers.',
      source: 'https://www.opportunity.org.nz/policy',
      sourceLabel: 'The Opportunity Party — Policy hub',
    },
    nc: {
      summary:
        'No detailed, dated education policy is published. General messaging opposes what it calls "destructive ideologies" in institutions including education and has previously opposed gender-diversity content in the curriculum, but no specific costed programme could be confirmed.',
      source: 'https://www.conservatives.nz/',
      sourceLabel: 'Conservative Party NZ — party website',
    },
    alcp: {
      summary:
        'Education content is entirely drug-policy focused — redirecting money spent on cannabis prohibition and incarceration into drug education and harm-reduction programmes, age-restricted regulation to discourage youth use, and a proposed Drugs Policy Council for consistent public information.',
      source: 'https://alcp.org.nz/policy/',
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
          <strong>Sources &amp; currency:</strong> All topics were re-checked in July 2026 against each party&apos;s
          current policy and 2025–2026 reporting — including National&apos;s NCEA replacement and Treaty-clause
          legislative rewrite, Labour&apos;s capital gains tax and Apprenticeship Boost expansion, the Green
          Party&apos;s Renters&apos; Rights Bill and revised wealth-tax threshold, ACT&apos;s immigration and climate
          policies, NZ First&apos;s &quot;Kiwi values statement&quot; and Paris Agreement stance, and Te Pāti
          Māori&apos;s Whānau Build housing policy. Some parties — particularly The Opportunity Party, Conservative
          Party NZ and ALCP — publish limited or undeveloped policy detail on several topics; where that&apos;s the
          case, it&apos;s noted directly in the summary rather than inferred. Mana Movement and Democracy NZ have
          been removed from these comparisons after deregistering with the Electoral Commission in 2021 and 2024
          respectively. New Conservative is now Conservative Party NZ, renamed January 2026. Always cross-check with
          the party&apos;s own website before forming a view.
        </p>
      </div>
    </main>
  );
}
