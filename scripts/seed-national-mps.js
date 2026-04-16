#!/usr/bin/env node
/**
 * scripts/seed-national-mps.js
 *
 * Seeds National Party MPs data into the database.
 *
 * Usage:
 *   npx tsx scripts/seed-national-mps.js
 *   npx tsx scripts/seed-national-mps.js --dry-run
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const DRY_RUN = process.argv.includes('--dry-run');

// ── MongoDB ────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set in .env');
  process.exit(1);
}

// ── Minimal inline schemas (avoids Next.js module graph) ──────────────────

const mpSchema = new mongoose.Schema(
  {
    name: String,
    fullName: String,
    slug: String,
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    partyName: String,
    role: String,
    type: String,
    electorate: String,
    political_spectrum: String,
    career_before_politics: [String],
    career_in_politics: [String],
    key_positions: [String],
    accomplishments: [String],
    controversies: [String],
    last_updated: Date,
    bioSummary: String,
    contactEmail: String,
    photoUrl: String,
    parliamentPageUrl: String,
    isActive: Boolean,
  },
  { timestamps: true }
);
const MP = mongoose.models.MP || mongoose.model('MP', mpSchema);

const partySchema = new mongoose.Schema({ name: String, slug: String }, { timestamps: true });
const Party = mongoose.models.Party || mongoose.model('Party', partySchema);

// ── Seed data ──────────────────────────────────────────────────────────────

const nationalMPs = [
  {
    name: "Christopher Luxon",
    partyName: "National",
    role: "Prime Minister",
    type: "electorate",
    electorate: "Botany",
    political_spectrum: "centre-right",
    career_before_politics: [
      "Joined Unilever in 1993, rose to President and CEO of Unilever Canada",
      "CEO of Air New Zealand 2013–2019"
    ],
    career_in_politics: [
      "MP for Botany since 2020",
      "Leader of the Opposition 2021–2023",
      "Prime Minister since November 2023"
    ],
    key_positions: [
      "Lower taxes and reduced public spending",
      "Economic growth through business investment",
      "Reduced co-governance and Treaty of Waitangi provisions in legislation",
      "Law and order — reinstated three-strikes sentencing"
    ],
    accomplishments: [
      "Led National to victory in 2023 election after four years in opposition",
      "Formed NZ's first formal three-party coalition government",
      "Delivered NZ$14.7 billion in tax cuts",
      "Reduced public service headcount significantly"
    ],
    controversies: [
      "Criticised for using taxpayer funds for te reo lessons as Opposition leader, then discouraging te reo use in public service as PM",
      "Coalition seen as unstable — David Seymour and Winston Peters have publicly contradicted him",
      "Presided over a prolonged recession with economists criticising his economic approach",
      "Leadership repeatedly questioned within caucus through 2025"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Nicola Willis",
    partyName: "National",
    role: "Minister of Finance, Deputy Leader",
    type: "electorate",
    electorate: "Ōhāriu",
    political_spectrum: "centre-right (liberal wing)",
    career_before_politics: [
      "Political advisor and corporate lobbyist",
      "First-class honours in English Literature, Victoria University of Wellington"
    ],
    career_in_politics: [
      "List MP from 2018",
      "MP for Ōhāriu since 2020",
      "Deputy Leader of National since 2021",
      "Minister of Finance since November 2023"
    ],
    key_positions: [
      "Fiscal responsibility and reduced government spending",
      "Tax relief for working families via FamilyBoost and bracket adjustments",
      "Social investment approach to welfare"
    ],
    accomplishments: [
      "Delivered major tax cut package in 2024",
      "First Minister for Economic Growth appointed January 2025",
      "Managed significant public service restructuring"
    ],
    controversies: [
      "Tax cut plan criticised by economists and Winston Peters for creating a $5.6b fiscal hole",
      "Admitted only 3,000 households would receive full tax relief — accused of misleading voters",
      "Group of 15 economists wrote open letter condemning her economic policies as harmful to poorest New Zealanders",
      "Declined KiwiRail's $1.47b ferry replacement request"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Chris Bishop",
    partyName: "National",
    role: "Minister of Housing, Attorney-General",
    type: "electorate",
    electorate: "Hutt South",
    political_spectrum: "centre-right",
    career_before_politics: [
      "Lobbyist for tobacco company Philip Morris",
      "Member of NZ Youth Parliament 2000"
    ],
    career_in_politics: [
      "MP for Hutt South",
      "Chairperson of National's 2023 Election Campaign",
      "Minister of Housing, Infrastructure, RMA Reform, Sport and Recreation, Leader of the House 2023–2026",
      "Attorney-General from April 2026"
    ],
    key_positions: [
      "Significant housing supply reform",
      "RMA (Resource Management Act) overhaul",
      "Tougher state housing tenancy rules"
    ],
    accomplishments: [
      "Named 'Politician of the Year' by The Post in 2025",
      "Described as 'minister for everything' for his outsized influence in government",
      "Led major RMA reform legislation"
    ],
    controversies: [
      "Former lobbyist for Philip Morris tobacco company",
      "Filmed calling a Māori cultural performance 'a load of crap' at 2025 Aotearoa Music Awards — appeared to be intoxicated",
      "Reported to have attempted to gather support to challenge Luxon for leadership in November 2025",
      "State housing eviction policy criticised as vindictive by opposition"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Shane Reti",
    partyName: "National",
    role: "Minister of Health",
    type: "electorate",
    electorate: "Whangārei",
    political_spectrum: "centre-right",
    career_before_politics: [
      "Medical doctor and GP",
      "Served in rural Northland communities"
    ],
    career_in_politics: [
      "MP for Whangārei since 2017",
      "Served as interim National Party leader briefly in 2021",
      "Minister of Health since November 2023"
    ],
    key_positions: [
      "Health system reform and efficiency",
      "Reducing health bureaucracy",
      "Rural health access"
    ],
    accomplishments: [
      "Oversaw dismantling of Te Whatu Ora (Health NZ) structure inherited from Labour",
      "Brought medical professional background to health portfolio"
    ],
    controversies: [
      "Health NZ placed under commissioner in 2024 amid financial crisis and significant job losses",
      "Presided over major cuts to health workforce"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Judith Collins",
    partyName: "National",
    role: "Minister for National Security and Intelligence",
    type: "electorate",
    electorate: "Papakura",
    political_spectrum: "centre-right (conservative wing)",
    career_before_politics: [
      "Lawyer"
    ],
    career_in_politics: [
      "MP for Papakura since 2002",
      "Mother of the House — longest-serving female MP",
      "Leader of the National Party 2020–2021",
      "Multiple ministerial roles across National governments including Justice, Police, Corrections"
    ],
    key_positions: [
      "Law and order hardliner",
      "Strong national security stance",
      "Sceptic of co-governance"
    ],
    accomplishments: [
      "One of the longest-serving MPs in NZ history",
      "Held major portfolios across multiple National governments",
      "Led National through a difficult period as leader in 2020–2021"
    ],
    controversies: [
      "Nicknamed 'Crusher Collins' for proposing to crush boy racers' cars",
      "Ousted as National leader in 2021 after a series of internal caucus crises",
      "Demoted and reinstated multiple times during internal party conflicts",
      "Accused of political revenge against Simon Bridges before her removal as leader"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Erica Stanford",
    partyName: "National",
    role: "Minister of Education, Minister for Immigration",
    type: "electorate",
    electorate: "East Coast Bays",
    political_spectrum: "centre-right",
    career_before_politics: [
      "Teacher and school principal"
    ],
    career_in_politics: [
      "MP for East Coast Bays since 2017",
      "Minister of Education and Immigration since November 2023"
    ],
    key_positions: [
      "Structured literacy and phonics-based reading curriculum reform",
      "Mandatory maths and reading testing",
      "Tighter immigration settings"
    ],
    accomplishments: [
      "Led major literacy curriculum overhaul — structured literacy rollout nationally",
      "Polled as one of most preferred alternative National leaders in 2025"
    ],
    controversies: [
      "Immigration processing delays and backlogs during her tenure",
      "Cuts to ESOL (English for Speakers of Other Languages) funding criticised"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Simeon Brown",
    partyName: "National",
    role: "Minister of Transport, Minister of Local Government",
    type: "electorate",
    electorate: "Pakuranga",
    political_spectrum: "centre-right (conservative wing)",
    career_before_politics: [
      "Political staffer and Young Nationals activist"
    ],
    career_in_politics: [
      "MP for Pakuranga since 2020",
      "Minister of Transport and Local Government since November 2023"
    ],
    key_positions: [
      "Roads and highway investment over public transport",
      "Reversing Auckland light rail and Let's Get Wellington Moving projects",
      "Reducing local government spending"
    ],
    accomplishments: [
      "Cancelled Auckland light rail project",
      "Fast-tracked road of national significance projects"
    ],
    controversies: [
      "Strong opposition to public transport investment despite Auckland congestion",
      "Considered one of the most conservative members of cabinet"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Mark Mitchell",
    partyName: "National",
    role: "Minister of Police",
    type: "electorate",
    electorate: "Whangaparāoa",
    political_spectrum: "centre-right",
    career_before_politics: [
      "Police officer",
      "Private security contractor including in Iraq"
    ],
    career_in_politics: [
      "MP for Rodney/Whangaparāoa since 2011",
      "Minister of Police since November 2023"
    ],
    key_positions: [
      "Tougher policing and sentencing",
      "Gang legislation — gang patch bans and organised crime crackdown",
      "Firearms law reform"
    ],
    accomplishments: [
      "Introduced gang patch ban legislation",
      "Increased police funding and recruitment targets"
    ],
    controversies: [
      "Gang patch ban criticised by civil liberties advocates as ineffective and rights-infringing",
      "Past work as private military contractor in conflict zones drew scrutiny"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Louise Upston",
    partyName: "National",
    role: "Minister for Social Development and Employment",
    type: "electorate",
    electorate: "Taupō",
    political_spectrum: "centre-right",
    career_before_politics: [
      "Business background in tourism and hospitality"
    ],
    career_in_politics: [
      "MP for Taupō since 2008",
      "Minister for Social Development and Employment since November 2023"
    ],
    key_positions: [
      "Reducing welfare dependency",
      "Work obligations for beneficiaries",
      "Cutting benefit levels for those who don't meet obligations"
    ],
    accomplishments: [
      "Introduced stricter work-testing requirements for welfare recipients"
    ],
    controversies: [
      "Welfare cuts criticised by anti-poverty advocates as punitive",
      "Drug testing for beneficiaries policy drew significant public debate"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Paul Goldsmith",
    partyName: "National",
    role: "Minister of Justice, Minister for Arts Culture and Heritage",
    type: "electorate",
    electorate: "Epsom",
    political_spectrum: "centre-right",
    career_before_politics: [
      "Historian and author",
      "Journalist"
    ],
    career_in_politics: [
      "MP since 2014",
      "Minister of Justice since November 2023"
    ],
    key_positions: [
      "Justice system reform",
      "Three-strikes sentencing restoration",
      "Treaty of Waitangi principles reform"
    ],
    accomplishments: [
      "Authored several NZ history books before entering politics",
      "Oversaw restoration of three-strikes sentencing law"
    ],
    controversies: [
      "Released a campaign finance document in 2020 with a significant factual error, claiming New Zealand went into debt to pay for World War II — widely mocked"
    ],
    last_updated: new Date(),
    isActive: true,
  }
];

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏛️  National MPs seed script ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅  Connected to MongoDB\n');
  }

  // Get National party
  let nationalParty;
  if (!DRY_RUN) {
    nationalParty = await Party.findOne({ slug: 'national' });
    if (!nationalParty) {
      console.error('❌  National Party not found. Run seed-data.js first.');
      process.exit(1);
    }
  }

  // Seed MPs
  console.log(`📦 Seeding ${nationalMPs.length} National MPs…`);
  if (!DRY_RUN) {
    for (const mpData of nationalMPs) {
      const mp = {
        ...mpData,
        fullName: mpData.name,
        slug: mpData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        party: nationalParty._id,
      };
      await MP.updateOne({ slug: mp.slug }, { $set: mp }, { upsert: true });
      console.log(`   ✓ ${mpData.name}`);
    }
  } else {
    nationalMPs.forEach((mp) => console.log(`   [dry] ${mp.name}`));
  }

  console.log('\n🎉 Done!\n');
  if (!DRY_RUN) await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});