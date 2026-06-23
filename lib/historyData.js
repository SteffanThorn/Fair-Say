/** @type {Record<string, string>} */
export const CONFLICT_COLOURS = {
  'maori-vs-crown':      '#C05621',
  'labour-vs-capital':   '#2B6CB0',
  'rich-vs-poor':        '#276749',
  'immigration-identity':'#553C9A',
  'constitutional':      '#B7791F',
  'social-progress':     '#2C7A7B',
};

export const CONFLICT_LABELS = {
  'maori-vs-crown':      'Māori vs Crown',
  'labour-vs-capital':   'Labour vs Capital',
  'rich-vs-poor':        'Rich vs Poor',
  'immigration-identity':'Immigration & Identity',
  'constitutional':      'Constitutional',
  'social-progress':     'Social Progress',
};

export const ERAS = [
  {
    id: 'pre-european',
    label: 'Pre-European Aotearoa',
    yearRange: 'pre-1840',
    description: 'Aotearoa before sustained European contact — iwi governance, inter-tribal politics, and the world that colonisation would transform.',
  },
  {
    id: 'colonial',
    label: 'Colonial Era',
    yearRange: '1840–1900',
    description: 'The Treaty, the Land Wars, and the foundations of a settler state — a period of profound dispossession and rapid political change.',
  },
  {
    id: 'nation-building',
    label: 'Nation Building',
    yearRange: '1900–1935',
    description: 'Class conflict, progressive labour law, pandemic, and the slow construction of a modern national identity.',
  },
  {
    id: 'welfare-state',
    label: 'Welfare State',
    yearRange: '1935–1984',
    description: 'From the Great Depression to the social contract — and its first cracks.',
  },
  {
    id: 'restructuring',
    label: 'Restructuring',
    yearRange: '1984–2000',
    description: 'Rogernomics, MMP, nuclear-free, and the foreshore — the era that remade modern New Zealand.',
  },
  {
    id: 'modern',
    label: 'Modern NZ',
    yearRange: '2000–present',
    description: 'Immigration, terror, pandemic, and the unresolved Treaty debate that defines politics today.',
  },
];

/** @type {Array<import('./historyData').HistoryEvent>} */
export const HISTORY_EVENTS = [
  // ── Pre-European ─────────────────────────────────────────────────────────
  {
    id: 'tribal-governance',
    year: 1000,
    yearDisplay: 'pre-1840',
    title: 'Tribal governance & the rangatira system',
    hook: 'Collective rule without a central state',
    era: 'pre-european',
    conflictType: 'constitutional',
    conflictAxisLabel: 'Collective tribal authority vs individual rights',
    whatHappened: 'Aotearoa before European contact was governed through iwi and hapū — tribal and sub-tribal units led by rangatira (chiefs). Decision-making was collective and based on whakapapa (genealogy), tikanga (custom), and utu (reciprocity). There was no single nation-state — hundreds of distinct tribal territories with their own alliances and rivalries.',
    sideA: {
      label: 'Tribal collectivism',
      argument: 'The system sustained communities for centuries, embedded deep environmental knowledge, and created strong social bonds. Collective decision-making meant no one person held absolute power.',
      strengths: [
        'Resilient to environmental shocks',
        'Strong social cohesion across generations',
        'Sophisticated oral legal traditions that preserved knowledge',
      ],
      failures: [
        'Intertribal warfare caused significant loss of life',
        'No mechanism to present a unified front against colonial pressure',
      ],
    },
    sideB: {
      label: 'The case for centralised governance',
      argument: 'As contact with Europeans grew, the lack of a unified Māori political structure made coordinated responses to colonisation nearly impossible. Some leaders recognised this and sought pan-tribal alliances.',
      strengths: [
        'The Kīngitanga movement (1858) showed Māori could adapt and centralise when motivated',
        'Some centralisation may have produced better Treaty outcomes',
      ],
      failures: [
        'Centralisation imposed on diverse peoples often erases legitimate local difference',
        'The Crown later used "lack of unified governance" as a pretext to override Māori authority',
      ],
    },
    legacyToday: 'The tension between collective iwi authority and individual rights remains live in modern Treaty debates, co-governance proposals, and the design of Māori wards.',
    sources: [
      { label: 'Te Ara — Iwi: tribal organisation', url: 'https://teara.govt.nz/en/iwi-tribal-organisation' },
      { label: 'Te Ara — Rangatira', url: 'https://teara.govt.nz/en/rangatira' },
    ],
  },
  {
    id: 'musket-wars',
    year: 1807,
    yearDisplay: '1807–1842',
    title: 'The Musket Wars',
    hook: 'When European trade rewrote the balance of power',
    era: 'pre-european',
    conflictType: 'maori-vs-crown',
    conflictAxisLabel: 'Tribal sovereignty vs destabilisation through trade contact',
    whatHappened: 'As muskets became available through European traders, iwi that acquired them first gained devastating military advantages. An estimated 20,000–40,000 Māori died in intertribal conflicts over 35 years. The wars shifted tribal populations significantly and left some iwi severely weakened before the Treaty was signed.',
    sideA: {
      label: 'Iwi who acquired muskets early (e.g. Ngāpuhi)',
      argument: 'Acquiring muskets was rational self-defence once neighbouring iwi had them. The wars were an extension of existing intertribal conflict, not caused by Europeans.',
      strengths: [
        'Early adopters genuinely protected their communities from rival iwi',
        'Trade with Europeans brought other material benefits alongside weapons',
      ],
      failures: [
        'The arms race caused catastrophic, self-reinforcing violence',
        'Weakened Māori political cohesion precisely when collective strength was most needed',
      ],
    },
    sideB: {
      label: 'Critics of the arms trade',
      argument: 'European traders bore responsibility for introducing a technology that caused catastrophic loss of life. The wars weakened Māori political cohesion precisely when collective strength was most needed.',
      strengths: [
        'The moral case for restricting arms sales is clear in hindsight',
        'Colonial powers had leverage over traders they largely chose not to exercise',
      ],
      failures: [
        'Restricting trade was practically impossible given commercial incentives',
        'Intertribal conflict predated European contact — muskets accelerated rather than created it',
      ],
    },
    legacyToday: 'The Musket Wars significantly shaped which iwi entered the Treaty era with power and which did not — a factor rarely acknowledged in modern Treaty discussions.',
    sources: [
      { label: 'Te Ara — Musket Wars', url: 'https://teara.govt.nz/en/musket-wars' },
      { label: 'NZ History — The Musket Wars', url: 'https://nzhistory.govt.nz/war/musket-wars/introduction' },
    ],
  },

  // ── Colonial ─────────────────────────────────────────────────────────────
  {
    id: 'treaty-waitangi',
    year: 1840,
    yearDisplay: '1840',
    title: 'The Treaty of Waitangi',
    hook: 'A partnership — or a surrender? The answer depends on which text you read',
    era: 'colonial',
    conflictType: 'maori-vs-crown',
    conflictAxisLabel: 'Māori sovereignty vs British colonial authority',
    whatHappened: 'On 6 February 1840, representatives of the British Crown and roughly 500 Māori rangatira signed (or were invited to sign) the Treaty of Waitangi. The English and te reo Māori versions differed critically: the English version ceded "sovereignty" to the Crown; the Māori version (te Tiriti) guaranteed rangatira "tino rangatiratanga" — full chieftainship — over their lands and people. Many chiefs understood they were agreeing to a partnership, not a surrender.',
    sideA: {
      label: 'The Crown',
      argument: 'Britain needed a formal mechanism to govern an increasingly lawless settler population and protect Māori from exploitation by rogue traders. The Treaty was presented as a genuine agreement granting Māori protection under British law.',
      strengths: [
        'Brought some legal order to a chaotic settler frontier',
        'Created a founding document that Māori have since used to hold the Crown accountable',
        'Ended some of the worst unregulated exploitation',
      ],
      failures: [
        'The Crown consistently interpreted the Treaty to maximise its own authority',
        'The Māori text was largely ignored for 130 years',
        'No genuine partnership was ever built',
      ],
    },
    sideB: {
      label: 'Māori rangatira',
      argument: 'Many chiefs signed believing they were entering a partnership — retaining authority over their own people and lands while gaining access to British trade and protection from other colonial powers.',
      strengths: [
        'Some chiefs drove hard bargains and resisted unfavourable terms',
        "The Treaty's existence has been the legal foundation for modern settlements worth billions",
        'Te Tiriti provided a framework Māori could use to challenge Crown breaches',
      ],
      failures: [
        'The lack of a unified Māori political authority meant the Crown could negotiate with individual chiefs',
        'The language gap was exploited almost immediately after signing',
      ],
    },
    legacyToday: 'The Treaty is the constitutional foundation of the modern NZ state. Debates about co-governance, Treaty principles, and Māori political representation are direct descendants of unresolved questions from 1840.',
    sources: [
      { label: 'NZ History — Treaty of Waitangi', url: 'https://nzhistory.govt.nz/politics/treaty-of-waitangi' },
      { label: 'Waitangi Tribunal', url: 'https://waitangitribunal.govt.nz' },
      { label: 'Te Ara — Treaty of Waitangi', url: 'https://teara.govt.nz/en/treaty-of-waitangi' },
    ],
  },
  {
    id: 'land-wars',
    year: 1845,
    yearDisplay: '1845–1872',
    title: 'The New Zealand Land Wars',
    hook: 'Millions of acres. The Crown called it order. Māori called it theft.',
    era: 'colonial',
    conflictType: 'maori-vs-crown',
    conflictAxisLabel: 'Māori land retention vs settler expansion',
    whatHappened: 'A series of armed conflicts between the Crown (backed by British imperial troops and settler militia) and various iwi who resisted land confiscation and Crown sovereignty. Beginning with the Flagstaff War in the north and escalating through the Waikato War (1863–64) and the campaigns in Taranaki, the wars resulted in the confiscation (raupatu) of millions of acres of Māori land under the New Zealand Settlements Act 1863.',
    sideA: {
      label: 'The Crown and settlers',
      argument: 'Settlers needed land to build an agricultural economy. Some chiefs had sold land willingly; others were seen as unlawfully blocking progress. The Crown argued it needed to assert sovereignty to maintain order.',
      strengths: [
        'Settlement did build an economy that generated significant wealth and infrastructure',
        'Some land had been lawfully purchased before the wars',
      ],
      failures: [
        'Confiscations often took land from iwi who had not fought the Crown, or had actively supported it',
        'The economic devastation to Māori communities was multigenerational',
        'Many confiscations were later found by the Waitangi Tribunal to be in clear breach of the Treaty',
      ],
    },
    sideB: {
      label: 'Māori who resisted',
      argument: 'Resistance was not rebellion — rangatira were defending land that was theirs under the Treaty they had signed. The Kīngitanga and other movements sought unified Māori governance as a legitimate alternative to Crown absorption.',
      strengths: [
        'Resistance preserved some land and political autonomy',
        'The Kīngitanga survived and the King Country remained autonomous until 1884',
        'The moral case for resisting confiscation was clear',
      ],
      failures: [
        'Military defeat led to massive land loss',
        'Divisions between iwi who fought and those who allied with the Crown created lasting tensions',
      ],
    },
    legacyToday: 'Raupatu confiscations are the subject of major Waitangi Tribunal claims. The settlements with Tainui and Ngāi Tahu in the 1990s were direct responses to these wars. Many NZ towns sit on confiscated land.',
    sources: [
      { label: 'NZ History — New Zealand Wars', url: 'https://nzhistory.govt.nz/war/new-zealand-wars' },
      { label: 'Waitangi Tribunal — Raupatu', url: 'https://waitangitribunal.govt.nz/publications-and-resources/waitangi-tribunal-reports/' },
    ],
  },
  {
    id: 'womens-suffrage',
    year: 1893,
    yearDisplay: '1893',
    title: "Women's suffrage",
    hook: "The world's first — and it nearly didn't happen",
    era: 'colonial',
    conflictType: 'social-progress',
    conflictAxisLabel: 'Democratic equality vs the established social order',
    whatHappened: "On 19 September 1893, New Zealand became the first self-governing country in the world to grant all women the right to vote in national elections. Kate Sheppard led a decades-long campaign through the Women's Christian Temperance Union and direct petition to Parliament. Premier Richard Seddon opposed it; Governor Lord Glasgow signed it into law.",
    sideA: {
      label: 'The suffragists',
      argument: 'Democracy cannot be genuine if half the population is excluded. Women were taxpayers, property owners, and citizens — there was no principled justification for their exclusion.',
      strengths: [
        'NZ led the world and inspired suffrage movements globally',
        'Won through persistent, organised civic action — a model for democracy',
        'The achievement opened political participation to women',
      ],
      failures: [
        'The vote did not immediately translate to women holding office (that took until 1919)',
        'Māori women could vote but faced other systemic barriers to full participation',
      ],
    },
    sideB: {
      label: "The opponents (Seddon's position)",
      argument: "Opponents argued women's role was in the domestic sphere. Seddon's opposition was partly economic — he feared women voters would favour prohibition and damage the liquor industry.",
      strengths: [
        'Some concerns about rapid social change were genuinely held by contemporaries',
      ],
      failures: [
        'The position was rooted in paternalism and economic self-interest',
        'History vindicated the suffragists entirely — the opponents were simply wrong',
      ],
    },
    legacyToday: "NZ's suffrage legacy is a genuine source of national pride and a recurring reference point in debates about democratic participation and representation.",
    sources: [
      { label: 'NZ History — Women and the vote', url: 'https://nzhistory.govt.nz/politics/womens-suffrage' },
      { label: 'Te Ara — Kate Sheppard', url: 'https://teara.govt.nz/en/biographies/2s16/sheppard-katherine-wilson' },
    ],
  },

  // ── Nation Building ───────────────────────────────────────────────────────
  {
    id: 'liberal-era',
    year: 1891,
    yearDisplay: '1891–1912',
    title: "The Liberal era & the social laboratory",
    hook: "The world watched NZ build the future — for some",
    era: 'nation-building',
    conflictType: 'labour-vs-capital',
    conflictAxisLabel: 'Working people vs the landed and business class',
    whatHappened: 'Under Premier Richard Seddon and his predecessor John Ballance, New Zealand built some of the world\'s first progressive labour laws — the Industrial Conciliation and Arbitration Act (1894), old-age pensions (1898), and an eight-hour working day. International observers called NZ "the social laboratory of the world." Land reform broke up large estates and enabled small farming.',
    sideA: {
      label: 'Liberals and labour',
      argument: 'Workers deserved legal protection from exploitation. The state had a role in redistributing opportunity and preventing the concentration of wealth seen in Britain and America.',
      strengths: [
        'Genuine improvements in working conditions and wages',
        'A model that influenced labour movements worldwide',
        'Reduced extreme poverty significantly',
      ],
      failures: [
        'The system still largely excluded Māori',
        'It was paternalistic — the state decided what was good for workers rather than workers organising autonomously',
      ],
    },
    sideB: {
      label: 'Business and large landowners',
      argument: 'Property rights matter; state interference in contracts distorts markets. Large-scale farming was the engine of NZ\'s export economy.',
      strengths: [
        'Agricultural exports did drive NZ prosperity',
        'Some regulatory overreach was genuine',
      ],
      failures: [
        'Opposition to labour reform left behind a class of exploited workers',
        'Concentration of land ownership had itself distorted the market long before state intervention',
      ],
    },
    legacyToday: 'The Liberal era set a pattern of state activism that defined NZ\'s self-image for 90 years — until Rogernomics reversed much of it.',
    sources: [
      { label: 'NZ History — The Liberal Government', url: 'https://nzhistory.govt.nz/politics/liberal-government' },
      { label: 'Te Ara — Richard Seddon', url: 'https://teara.govt.nz/en/biographies/2s13/seddon-richard-john' },
    ],
  },
  {
    id: 'waterfront-strike-1913',
    year: 1913,
    yearDisplay: '1913',
    title: 'The 1913 Waterfront Strike',
    hook: "Farmers on horseback versus the wharfies — the state picks a side",
    era: 'nation-building',
    conflictType: 'labour-vs-capital',
    conflictAxisLabel: 'Organised labour vs employers backed by the state',
    whatHappened: 'In 1913, New Zealand experienced its most intense industrial conflict. Waterfront workers in Wellington and miners on the West Coast struck for better pay and conditions. The government under William Massey deployed "Massey\'s Cossacks" — mounted special constables, mostly farmers deputised to break the strike. The strike was crushed, the Red Federation of Labour was defeated, and many of its leaders were jailed or deported.',
    sideA: {
      label: 'The strikers',
      argument: 'Workers had a right to organise and strike. Wages were low, conditions were dangerous, and employers were using the state as their private police force.',
      strengths: [
        'The moral case for workers\' rights to organise was sound',
        'The strike catalysed the formation of the Labour Party in 1916',
        'International solidarity showed the issue transcended NZ',
      ],
      failures: [
        'The Red Federation\'s revolutionary rhetoric alienated moderate public support',
        'The military defeat set back union organising for years',
      ],
    },
    sideB: {
      label: 'The government and employers',
      argument: 'Order had to be maintained; the economy depended on the ports functioning; the Red Federation\'s revolutionary rhetoric alarmed a conservative public.',
      strengths: [
        'Some concerns about economic disruption were genuine',
        'Legal mechanisms for arbitration did exist',
      ],
      failures: [
        'Deploying farmer-constables against striking workers was nakedly partisan',
        'The government treated workers\' legitimate grievances as a law-and-order problem',
      ],
    },
    legacyToday: '1913 hardened the division between labour and capital in NZ politics and directly shaped the formation of the Labour Party in 1916, which would go on to build the welfare state.',
    sources: [
      { label: 'NZ History — 1913 strike', url: 'https://nzhistory.govt.nz/culture/the-1913-great-strike' },
    ],
  },
  {
    id: 'influenza-1918',
    year: 1918,
    yearDisplay: '1918',
    title: 'The 1918 influenza pandemic',
    hook: 'Māori died at seven times the Pākehā rate. This was not biology.',
    era: 'nation-building',
    conflictType: 'rich-vs-poor',
    conflictAxisLabel: 'State capacity vs inequality in crisis',
    whatHappened: 'The 1918 influenza pandemic killed approximately 9,000 New Zealanders — and Māori at a rate roughly seven times higher than Pākehā. Overcrowded housing, poor nutrition, and limited access to healthcare made Māori communities devastatingly vulnerable. The state\'s response was slow and uneven.',
    sideA: {
      label: 'The case for state responsibility',
      argument: 'The differential death rate was not biological — it was a product of policy-created inequality. The state had an obligation to protect all citizens equally.',
      strengths: [
        'The health disparities were clearly traceable to state decisions: land confiscation, displacement, and neglect',
        'Collective action in a pandemic is more effective than individual charity',
      ],
      failures: [
        'Even those who accepted this principle often limited state response to Pākehā communities',
      ],
    },
    sideB: {
      label: 'The laissez-faire position',
      argument: 'Emergencies were seen as matters for local charity and community response, not central government. The concept of state-provided healthcare barely existed.',
      strengths: [
        'Community-led responses were sometimes faster than bureaucratic ones',
      ],
      failures: [
        'The ideology of minimal state action was a direct cause of preventable deaths',
        'Local charity could not compensate for structural inequality created by the state',
      ],
    },
    legacyToday: 'The 1918 pandemic\'s unequal toll foreshadowed debates about health equity that remain unresolved today. Māori health disparities in COVID-19 followed the same pattern — over a century later.',
    sources: [
      { label: 'NZ History — 1918 flu pandemic', url: 'https://nzhistory.govt.nz/culture/1918-influenza-pandemic' },
      { label: 'Te Ara — Epidemics', url: 'https://teara.govt.nz/en/epidemics' },
    ],
  },

  // ── Welfare State ─────────────────────────────────────────────────────────
  {
    id: 'first-labour-govt',
    year: 1935,
    yearDisplay: '1935–1949',
    title: 'The First Labour Government & the welfare state',
    hook: "Savage built the floor. The argument about the ceiling continues.",
    era: 'welfare-state',
    conflictType: 'labour-vs-capital',
    conflictAxisLabel: 'Collective social security vs individual self-reliance',
    whatHappened: "Elected during the Great Depression, Michael Joseph Savage's Labour government built New Zealand's welfare state: free healthcare (1938 Social Security Act), state housing, expanded education, and a universal pension. Savage is still considered by many the greatest New Zealander. The government borrowed heavily and used Keynesian economics before Keynes was widely known.",
    sideA: {
      label: 'Labour and the welfare vision',
      argument: 'The Depression proved markets could not be trusted to provide for ordinary people. The state had a duty to ensure every citizen had housing, health, and income security.',
      strengths: [
        'Transformed New Zealand — poverty fell sharply; life expectancy improved',
        'A generation experienced security they had never known',
        'The 1938 Social Security Act was genuinely world-leading',
      ],
      failures: [
        'The system was designed around a male breadwinner model, disadvantaging women',
        'Māori were not always equitably included',
        'It created long-term fiscal obligations without always funding them sustainably',
      ],
    },
    sideB: {
      label: 'Business and conservatives',
      argument: 'High taxation reduced incentives; state housing competed with private landlords; the welfare state created dependency and was fiscally unsustainable long-term.',
      strengths: [
        'Some concerns about fiscal sustainability proved partially correct by the 1970s',
        'Markets do allocate some resources more efficiently than the state',
      ],
      failures: [
        'The alternative — leaving Depression-era poverty unaddressed — was politically and morally untenable',
        "The welfare state's 'failures' were often just costs that opponents wanted to externalise onto vulnerable people",
      ],
    },
    legacyToday: "The welfare state remains the core of NZ's social contract. Every political debate about housing, healthcare, and superannuation is a debate about the boundaries Savage drew in 1938.",
    sources: [
      { label: 'NZ History — First Labour Government', url: 'https://nzhistory.govt.nz/politics/first-labour-government' },
      { label: 'Te Ara — Michael Joseph Savage', url: 'https://teara.govt.nz/en/biographies/4s14/savage-michael-joseph' },
    ],
  },
  {
    id: 'nuclear-free',
    year: 1984,
    yearDisplay: '1984–1987',
    title: 'Nuclear-free New Zealand',
    hook: 'The US called it a betrayal. Most New Zealanders called it a point of pride.',
    era: 'welfare-state',
    conflictType: 'constitutional',
    conflictAxisLabel: 'National sovereignty vs ANZUS alliance obligations',
    whatHappened: "David Lange's Labour government passed the New Zealand Nuclear Free Zone, Disarmament, and Arms Control Act 1987, banning nuclear weapons and nuclear-powered ships from NZ waters. This directly caused the US to suspend NZ's ANZUS alliance obligations. The decision was overwhelmingly popular domestically and cost NZ its formal military alliance with the United States.",
    sideA: {
      label: 'The nuclear-free position',
      argument: 'Small nations have both the right and the moral obligation to take principled stances. Nuclear weapons represent an existential threat to humanity; hosting them made NZ complicit.',
      strengths: [
        'NZ gained genuine moral authority internationally',
        'The ban reflected genuine public consensus across party lines',
        'The economic costs were manageable; the security costs were overstated',
      ],
      failures: [
        'NZ lost military intelligence sharing and security guarantees for years',
        'Some argued the stance was symbolic posturing at a real strategic cost',
      ],
    },
    sideB: {
      label: 'The pro-ANZUS position',
      argument: 'Small countries cannot afford to alienate major allies. NZ\'s security depended on the US relationship; principle without power is just gesture.',
      strengths: [
        'The strategic cost was real — NZ remained outside parts of Five Eyes sharing for years',
        'The Pacific security environment did not improve after NZ\'s departure from ANZUS',
      ],
      failures: [
        'The position required NZ to subordinate its democratic choices to US foreign policy preferences',
        'History has not vindicated the security fears — NZ was not more vulnerable after the ban',
      ],
    },
    legacyToday: "The nuclear-free policy remains one of NZ's most cherished national identities. It is consistently cited in polls as a source of pride across all demographics and has never seriously been revisited by any government.",
    sources: [
      { label: 'NZ History — Nuclear-free New Zealand', url: 'https://nzhistory.govt.nz/politics/nuclear-free-new-zealand' },
      { label: 'Te Ara — Nuclear-free policy', url: 'https://teara.govt.nz/en/nuclear-free-new-zealand' },
    ],
  },

  // ── Restructuring ─────────────────────────────────────────────────────────
  {
    id: 'rogernomics',
    year: 1984,
    yearDisplay: '1984–1990',
    title: 'Rogernomics',
    hook: 'The fastest, deepest free-market restructuring any democracy had ever attempted',
    era: 'restructuring',
    conflictType: 'rich-vs-poor',
    conflictAxisLabel: 'Free market liberalism vs social democracy',
    whatHappened: "Roger Douglas, Finance Minister under the Fourth Labour Government, implemented the most rapid and comprehensive free-market restructuring of any OECD economy. State assets were sold, tariffs removed, the top income tax rate cut from 66% to 33%, the Reserve Bank made independent with an inflation target, and welfare benefits were later cut. NZ went from one of the most regulated to one of the most deregulated economies in the world in under a decade.",
    sideA: {
      label: 'The free market reformers',
      argument: "NZ's interventionist economy was inefficient, internationally uncompetitive, and fiscally unsustainable. The 1970s oil shocks and the loss of UK preferential access exposed structural weaknesses that only market discipline could fix. High inflation was destroying savings.",
      strengths: [
        'Inflation was brought under control',
        'The economy became more dynamic and internationally connected',
        'Some state enterprises were genuinely inefficient',
      ],
      failures: [
        'Unemployment tripled; inequality rose among the sharpest in the OECD',
        'Communities built around manufacturing and freezing works were destroyed',
        'Māori were disproportionately harmed by asset sales and benefit cuts',
        'The social costs were massive and lasting — still felt today',
      ],
    },
    sideB: {
      label: 'Critics (including many in Labour itself)',
      argument: 'The reforms went far beyond fixing genuine inefficiencies. They were ideologically driven, implemented without mandate (Labour had not campaigned on them), and the human costs were treated as acceptable collateral damage.',
      strengths: [
        'Critics were right that speed and ideology overwhelmed evidence',
        "NZ's inequality increase was among the sharpest in the OECD",
        'The promised efficiency gains often did not materialise',
      ],
      failures: [
        'Some critics were simply defending protected interests',
        'Not all of the old system was worth saving',
        'Inflation was a genuine problem that needed addressing',
      ],
    },
    legacyToday: 'Rogernomics is the fault line of modern NZ politics. Almost every debate about housing, wages, inequality, and public services traces back to decisions made between 1984 and 1991.',
    sources: [
      { label: 'NZ History — Rogernomics', url: 'https://nzhistory.govt.nz/politics/rogernomics' },
      { label: 'Te Ara — Economic transformation', url: 'https://teara.govt.nz/en/economic-history' },
    ],
  },
  {
    id: 'mmp-introduction',
    year: 1996,
    yearDisplay: '1996',
    title: 'The introduction of MMP',
    hook: 'Voters changed the rules because governments kept ignoring them',
    era: 'restructuring',
    conflictType: 'constitutional',
    conflictAxisLabel: 'Proportional representation vs strong single-party government',
    whatHappened: 'After two referendums (1992 and 1993), New Zealand replaced First Past the Post with Mixed Member Proportional representation, first used in the 1996 election. The change was driven by public anger at governments implementing policies they had not campaigned on — Rogernomics being the prime example. MMP produces coalition governments and gives smaller parties representation proportional to their vote share.',
    sideA: {
      label: 'Pro-MMP',
      argument: 'FPP allowed governments with minority vote shares to hold absolute power. MMP makes Parliament look more like the country — more women, more Māori, more diverse voices.',
      strengths: [
        "Parliament now more accurately reflects NZ's diverse views",
        'Coalition governments require consensus and reduce radical unilateral change',
        'Smaller parties (Greens, ACT, Māori Party) have genuine parliamentary presence',
      ],
      failures: [
        'Small parties can have disproportionate leverage in coalition negotiations',
        'The 5% threshold still locks out significant minority voices',
      ],
    },
    sideB: {
      label: 'Pro-FPP',
      argument: 'Strong single-party governments can make difficult long-term decisions without coalition compromise. MMP gives small parties disproportionate leverage and produces slow, muddled government.',
      strengths: [
        'Single-party governments can implement difficult reforms more decisively',
        'Voters know exactly who is responsible for decisions',
      ],
      failures: [
        'The system that produced Rogernomics without a mandate undermined its own credibility',
        'Strong government is a feature when you agree with the government — and a catastrophe when you do not',
      ],
    },
    legacyToday: 'MMP has fundamentally changed NZ politics. The Greens, ACT, and Māori Party all exist because of it. Almost every government since 1996 has been a coalition, and the expectation of consultation has changed how policy is made.',
    sources: [
      { label: 'Electoral Commission — MMP', url: 'https://elections.nz/democracy-in-nz/what-is-new-zealands-system-of-government/what-is-mmp/' },
      { label: 'NZ History — Electoral system change', url: 'https://nzhistory.govt.nz/politics/electoral-system-change' },
    ],
  },
  {
    id: 'foreshore-seabed',
    year: 2003,
    yearDisplay: '2003–2004',
    title: 'The Foreshore and Seabed controversy',
    hook: "Parliament changed the law to stop Māori having their day in court",
    era: 'restructuring',
    conflictType: 'maori-vs-crown',
    conflictAxisLabel: 'Māori customary title vs public access to the coast',
    whatHappened: 'When the Court of Appeal ruled that Māori could apply to the Māori Land Court to investigate customary title to foreshore and seabed areas, the Helen Clark Labour government passed the Foreshore and Seabed Act 2004, extinguishing any possibility of Māori title and vesting ownership in the Crown. The hikoi (march) to Parliament in protest was one of the largest in NZ history. The Act directly led to the formation of the Māori Party.',
    sideA: {
      label: 'The government',
      argument: 'Public access to beaches is a cherished NZ value. Allowing Māori customary title claims would create legal uncertainty and could result in restricted beach access.',
      strengths: [
        'Public concern about beach access was genuine and politically significant',
        'Legal certainty has value for planning and investment',
      ],
      failures: [
        'The Act was a legislative override of a court process — the government changed the law to prevent Māori from having their day in court',
        'The Waitangi Tribunal found it inconsistent with Treaty principles',
        'It was widely seen as political panic rather than principled policy',
      ],
    },
    sideB: {
      label: 'Māori claimants',
      argument: 'Customary title had never been properly tested. The court had not awarded title — it had only said Māori could apply to have it considered. Extinguishing that right without compensation was a breach of the Treaty.',
      strengths: [
        'The legal position was sound — a court process was being bypassed by legislation',
        'The hikoi demonstrated the depth of feeling across iwi',
        "The political consequence (Māori Party's formation) proved the action's significance",
      ],
      failures: [
        'The debate was partly obscured by genuine public misunderstanding of what "customary title" actually meant',
      ],
    },
    legacyToday: 'The Act was replaced by the Marine and Coastal Area (Takutai Moana) Act 2011 under the National-Māori Party government. Customary title applications under that Act continue in courts today, and the unresolved tension between public access and customary rights persists.',
    sources: [
      { label: 'NZ History — Foreshore and Seabed', url: 'https://nzhistory.govt.nz/politics/foreshore-and-seabed-act' },
      { label: 'Waitangi Tribunal report', url: 'https://waitangitribunal.govt.nz/publications-and-resources/waitangi-tribunal-reports/' },
    ],
  },

  // ── Modern ────────────────────────────────────────────────────────────────
  {
    id: 'immigration-1987',
    year: 1987,
    yearDisplay: '1987–present',
    title: 'The changing face of New Zealand',
    hook: 'From "White New Zealand" to one of the world\'s most diverse cities in one generation',
    era: 'modern',
    conflictType: 'immigration-identity',
    conflictAxisLabel: 'Multicultural New Zealand vs cultural cohesion concerns',
    whatHappened: "The 1987 Immigration Act ended the de facto 'White New Zealand' policy by shifting to a points-based skills system. The following three decades saw dramatic demographic change: Auckland became one of the most ethnically diverse cities in the world. Chinese, Indian, Korean, Filipino, and Pacific communities grew rapidly. By 2023, Auckland's population was majority non-European.",
    sideA: {
      label: 'Pro-immigration, multicultural vision',
      argument: "Immigration brought skills, capital, and cultural richness. NZ's economy depended on migrant labour. Cultural diversity strengthened communities and global connections.",
      strengths: [
        'Economic contribution of migrants is well-documented',
        'Cultural vitality of cities increased significantly',
        "NZ's international relationships deepened through diaspora connections",
      ],
      failures: [
        'Settlement support was inadequate — racism and discrimination persisted',
        'Housing pressure in Auckland was exacerbated by population growth without corresponding infrastructure investment',
      ],
    },
    sideB: {
      label: 'Those concerned about pace of change',
      argument: "Rapid demographic change outpaced communities' ability to adapt. Concerns were raised about pressure on housing, infrastructure, and social cohesion — not always from a racist position.",
      strengths: [
        'Infrastructure concerns were real — Auckland\'s housing crisis is partly a supply-demand story',
        'The pace of change in some communities was genuinely disorienting',
      ],
      failures: [
        '"Cultural cohesion" arguments were sometimes a respectable cover for racism',
        'Māori, as tangata whenua, had a distinct and underacknowledged stake in who was invited to share their country',
      ],
    },
    legacyToday: 'Immigration remains one of NZ\'s most contested political issues. The 2023 election saw significant debate about migration volumes and their relationship to housing affordability. The question of what it means to be a New Zealander continues to evolve.',
    sources: [
      { label: 'Stats NZ — Population data', url: 'https://www.stats.govt.nz/topics/population' },
      { label: 'NZ History — Immigration history', url: 'https://nzhistory.govt.nz/culture/immigration-history' },
    ],
  },
  {
    id: 'christchurch-attacks',
    year: 2019,
    yearDisplay: '2019',
    title: 'The Christchurch mosque attacks',
    hook: 'The worst day in modern NZ history — and the response that defined a government',
    era: 'modern',
    conflictType: 'immigration-identity',
    conflictAxisLabel: 'Violent extremism vs multicultural New Zealand',
    whatHappened: 'On 15 March 2019, a white supremacist terrorist attacked two mosques in Christchurch, killing 51 people and injuring 40 more. It was the worst mass shooting in New Zealand\'s history. Prime Minister Jacinda Ardern\'s response — gun law reform passed within weeks, the "Christchurch Call" to eliminate terrorist content online, and her refusal to name the perpetrator — was internationally praised.',
    sideA: {
      label: 'The response — unity and reform',
      argument: "The attacks demanded immediate action on gun laws and a rejection of hate. Ardern's response demonstrated that political leadership could be both empathetic and effective.",
      strengths: [
        'Gun reform was swift, effective, and broadly supported across party lines',
        'The Christchurch Call influenced global tech policy on terrorist content',
        'The response modelled a form of political leadership rare in modern democracies',
      ],
      failures: [
        'The Royal Commission found intelligence failures — the far-right threat was undermonitored',
        'Muslim communities reported feeling surveilled by the state before the attacks, while the real threat was missed',
      ],
    },
    sideB: {
      label: 'Civil liberties and due process concerns',
      argument: 'The speed of gun reform, while emotionally compelling, bypassed normal legislative scrutiny. Some civil libertarians raised concerns about the Christchurch Call\'s implications for freedom of speech online.',
      strengths: [
        'Legislative scrutiny exists for good reasons — rushed law can have unintended consequences',
        'Some speech restrictions do have legitimate edge-case concerns',
      ],
      failures: [
        'The civil liberties concerns, while legitimate in principle, were largely used to delay necessary reform',
        "The victims' community was not well served by such arguments in the immediate aftermath",
      ],
    },
    legacyToday: "The attacks permanently changed NZ's self-perception as a safe, isolated country. They also accelerated serious engagement with racism and Islamophobia as domestic issues, not just imported ones.",
    sources: [
      { label: 'Royal Commission report', url: 'https://christchurchattack.royalcommission.nz' },
      { label: 'NZ History — Christchurch attacks', url: 'https://nzhistory.govt.nz/page/christchurch-mosque-shootings' },
    ],
  },
  {
    id: 'covid-19',
    year: 2020,
    yearDisplay: '2020–2022',
    title: 'COVID-19 and the limits of consensus',
    hook: 'From "team of five million" to a Parliament lawn occupation — in two years',
    era: 'modern',
    conflictType: 'rich-vs-poor',
    conflictAxisLabel: 'Collective public health vs individual freedom and economic survival',
    whatHappened: "New Zealand's elimination strategy under Jacinda Ardern was internationally praised in 2020, keeping death rates among the lowest in the world. By 2021–22, vaccine mandates and prolonged lockdowns had produced significant social fracture. The Parliament lawn occupation in early 2022 brought together a range of grievances — anti-mandate, anti-government, and conspiratorial — that exposed deep divisions in NZ society.",
    sideA: {
      label: 'The public health response',
      argument: 'Elimination saved lives. Mandates were proportionate given the stakes. Collective action in a pandemic requires temporary constraints on individual freedom.',
      strengths: [
        'NZ had among the lowest COVID death rates in the OECD through 2021',
        'The economic impact was cushioned by wage subsidies',
        'The response was transparent and consistently science-based',
      ],
      failures: [
        'Mandates disproportionately affected working-class people in physical jobs who could not work from home',
        'Māori vaccination rates lagged and the response was slow to adapt to community needs',
        'The communications failure in 2021 was significant — public trust eroded sharply',
      ],
    },
    sideB: {
      label: 'Those who opposed mandates',
      argument: 'Vaccine mandates crossed a line on bodily autonomy. Prolonged lockdowns destroyed small businesses, worsened mental health, and created a class divide between those who could work from home and those who could not.',
      strengths: [
        'The economic harm to small businesses was real and lasting',
        'The mental health impacts — especially on young people — were significant',
        'Bodily autonomy is a genuine value with a long liberal tradition',
      ],
      failures: [
        'Some opposition became a vehicle for broader conspiracy theories that undermined genuine concerns',
        'Vaccine hesitancy, where it led to deaths, was a direct and measurable harm',
      ],
    },
    legacyToday: 'COVID fractures shaped the 2023 election, contributing to Labour\'s defeat. The debate about the limits of state power in emergencies is unresolved — and will be tested again.',
    sources: [
      { label: 'Stats NZ — COVID-19 data', url: 'https://www.stats.govt.nz/topics/covid-19' },
      { label: 'Ministry of Health', url: 'https://www.health.govt.nz/covid-19-novel-coronavirus' },
    ],
  },
  {
    id: 'treaty-principles-bill',
    year: 2024,
    yearDisplay: '2024–present',
    title: 'The Treaty principles debate',
    hook: 'Redefine the Treaty in statute — or repeat 184 years of unilateral Crown action?',
    era: 'modern',
    conflictType: 'maori-vs-crown',
    conflictAxisLabel: 'Redefining the Treaty vs constitutional status quo',
    whatHappened: "The ACT Party, as part of the 2023 coalition agreement, secured a commitment to introduce a Treaty Principles Bill defining the Treaty's principles in statute. The bill — which proposed principles of equal citizenship, democratic government, and rule of law, without specific Māori protections — was widely seen as an attempt to reduce the Treaty's legal force. A hikoi of over 40,000 people marched to Parliament in November 2024. The bill was defeated at select committee stage.",
    sideA: {
      label: "ACT and the bill's supporters",
      argument: "The Treaty's 'principles' have been defined by courts and the Waitangi Tribunal without democratic mandate. Codifying them in statute brings democratic accountability and ensures equal citizenship for all New Zealanders.",
      strengths: [
        'There is a genuine question about who should define constitutional principles in a democracy',
        'Equal citizenship is a legitimate value',
        'The lack of democratic input into Treaty jurisprudence is a fair concern',
      ],
      failures: [
        'The specific principles proposed would have reduced Māori rights below their current legal recognition',
        'The bill was widely seen as politically motivated rather than a genuine constitutional reform',
        'Proceeding without Māori consent repeats the very pattern the Treaty was meant to prevent',
      ],
    },
    sideB: {
      label: 'Māori and Treaty advocates',
      argument: 'The Treaty is a founding constitutional document that the Crown has already breached repeatedly. Redefining its principles by statute — without Māori consent — would repeat the pattern of unilateral Crown action the Treaty was meant to prevent.',
      strengths: [
        'The hikoi demonstrated the depth and breadth of opposition',
        'Legal experts widely agreed the bill was constitutionally problematic',
        'The existing principles have been developed through careful, decades-long jurisprudence',
      ],
      failures: [
        'Opponents sometimes resisted any discussion of codification, even though the status quo also has democratic legitimacy questions',
        'The debate about what the Treaty means is legitimate and will not go away by defeating one bill',
      ],
    },
    legacyToday: 'The debate is ongoing. It reflects an unresolved question at the heart of NZ\'s constitutional identity: what kind of partnership did the Treaty actually create, and who gets to define it?',
    sources: [
      { label: 'Parliament — Treaty Principles Bill', url: 'https://www.parliament.nz/en/pb/bills-and-laws/bills-proposed-laws/document/BILL_128010/treaty-principles-bill' },
      { label: 'Waitangi Tribunal', url: 'https://waitangitribunal.govt.nz' },
    ],
  },
];
