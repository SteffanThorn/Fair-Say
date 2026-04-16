#!/usr/bin/env node
/**
 * scripts/seed-greens-mps.js
 *
 * Seeds Green Party MPs data into the database.
 *
 * Usage:
 *   npx tsx scripts/seed-greens-mps.js
 *   npx tsx scripts/seed-greens-mps.js --dry-run
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

const greenMPs = [
  {
    name: "Chlöe Swarbrick",
    partyName: "Green Party",
    role: "Co-Leader, MP for Auckland Central",
    type: "electorate",
    electorate: "Auckland Central",
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Digital consultancy and artist management agency TIPS (co-founded with Bartley Catt)",
      "Opened café and gallery 'Olly' in Mount Eden, Auckland",
      "Ran for Auckland Mayor in 2016 — came third"
    ],
    career_in_politics: [
      "List MP since 2017 — youngest MP at the time at age 23",
      "Won Auckland Central electorate in 2020 — only second Green MP ever to win an electorate",
      "Retained Auckland Central in 2023",
      "Co-Leader of the Green Party since March 2024"
    ],
    key_positions: [
      "Climate change and bold emissions reduction",
      "Wealth tax and income inequality",
      "Drug law reform",
      "Mental health system investment",
      "Israel sanctions — member's bill submitted December 2024",
      "Green Budget — $8 billion four-year investment in green infrastructure"
    ],
    accomplishments: [
      "Famous 'OK Boomer' moment in Parliament went viral globally",
      "Won Auckland Central — first Green electorate MP to hold seat for more than one term",
      "Named to Fortune '40 Under 40' in 2020",
      "Won Jane Goodall Trailblazer Award 2019",
      "Unveiled Green alternative budget proposing 40,000 jobs through Ministry of Green Works"
    ],
    controversies: [
      "Removed from Parliament by Speaker Brownlee in August 2025 for criticising government MPs — refused to apologise and was suspended again",
      "Apologised to Parliament in 2024 after accusing PM Luxon of lying in the debating chamber — breach of parliamentary rules",
      "Israel sanctions bill was politically contentious"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Marama Davidson",
    partyName: "Green Party",
    role: "Co-Leader, List MP",
    type: "list",
    electorate: null,
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Community activist and social justice advocate",
      "Involved in Gaza Freedom Flotilla 2011"
    ],
    career_in_politics: [
      "List MP since 2017",
      "Co-Leader of the Green Party since 2018",
      "Minister for the Prevention of Family and Sexual Violence 2020–2023"
    ],
    key_positions: [
      "Family and sexual violence prevention",
      "Māori and Pasifika rights",
      "Social justice and poverty elimination",
      "Treaty of Waitangi"
    ],
    accomplishments: [
      "First Māori woman to lead a NZ political party",
      "Ministerial role focused on family violence prevention"
    ],
    controversies: [
      "Made controversial comments in 2023 attributing violence against women to 'white cis men' shortly after being hit by a car at a protest — widely criticised across political spectrum",
      "Comments led to significant public debate about her suitability as co-leader"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Julie Anne Genter",
    partyName: "Green Party",
    role: "MP for Rongotai",
    type: "electorate",
    electorate: "Rongotai",
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Transport planner and urban mobility consultant",
      "Born in the United States — moved to New Zealand",
      "Master's degree in City Planning from UC Berkeley"
    ],
    career_in_politics: [
      "List MP since 2011",
      "Won Rongotai electorate in 2023 — second Green electorate MP",
      "Associate Minister of Transport and Minister for Women 2017–2020"
    ],
    key_positions: [
      "Public transport and active travel",
      "Urban planning and housing density",
      "Women's rights",
      "Climate policy"
    ],
    accomplishments: [
      "Won Rongotai electorate in 2023 — expanded Green electorate presence",
      "Leading voice on transport and urban policy in NZ",
      "Gave birth in Parliament — brought global attention to parental rights in legislatures"
    ],
    controversies: [
      "Cycling to hospital while in labour drew widespread media attention — she defended it as a personal choice"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Tamatha Paul",
    partyName: "Green Party",
    role: "MP for Wellington Central",
    type: "electorate",
    electorate: "Wellington Central",
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Wellington City Councillor",
      "Community organiser and activist"
    ],
    career_in_politics: [
      "Wellington City Councillor before entering Parliament",
      "Won Wellington Central electorate in 2023 — third Green electorate MP"
    ],
    key_positions: [
      "Housing affordability",
      "Urban issues",
      "Climate action",
      "Social justice"
    ],
    accomplishments: [
      "Won Wellington Central — significant gain for Greens",
      "Brought local government experience to Parliament"
    ],
    controversies: [
      "Limited controversies as a first-term MP"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Ricardo Menéndez March",
    partyName: "Green Party",
    role: "List MP, Social Development and Employment Spokesperson",
    type: "list",
    electorate: null,
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Anti-poverty campaigner",
      "Born in Tijuana, Mexico — first Latin American MP in NZ history",
      "Community organiser focused on migrant workers and welfare"
    ],
    career_in_politics: [
      "List MP since 2020",
      "Led campaigns to end benefit sanctions and lift incomes",
      "Social development and employment spokesperson"
    ],
    key_positions: [
      "Welfare system reform — end benefit sanctions",
      "Migrant worker protections",
      "Income adequacy and poverty elimination",
      "Guaranteed minimum income"
    ],
    accomplishments: [
      "First Latin American MP in NZ history",
      "Successfully campaigned for benefit sanctions reform",
      "Strong advocate for migrant workers' rights"
    ],
    controversies: [
      "Shane Jones made remarks about 'sending Mexicans home' targeting Menéndez March — widely condemned as racist",
      "Peters and Jones criticised him for referring to NZ as 'Aotearoa' in Parliament",
      "His tweet 'From the river to the sea, Palestine will be free' was cited by ACT as reason to oppose a Green Palestine motion"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Teanau Tuiono",
    partyName: "Green Party",
    role: "List MP, Pacific spokesperson",
    type: "list",
    electorate: null,
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Over 20 years as activist, advocate and organiser at local, national and international levels",
      "Cook Islander — first Pasifika Green MP"
    ],
    career_in_politics: [
      "List MP since 2020",
      "First Pasifika Green MP"
    ],
    key_positions: [
      "Pacific peoples and climate change",
      "Indigenous rights",
      "Environment and conservation"
    ],
    accomplishments: [
      "First Pasifika MP for the Green Party",
      "Long activist background before entering Parliament"
    ],
    controversies: [
      "Winston Peters criticised him for referring to NZ as 'Aotearoa' in Parliament in February 2026 — Speaker cautioned Peters"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Lan Pham",
    partyName: "Green Party",
    role: "List MP",
    type: "list",
    electorate: null,
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Of Vietnamese and Pākehā heritage",
      "Community and environmental work in Christchurch"
    ],
    career_in_politics: [
      "List MP since 2023 — new entrant",
      "First MP with Vietnamese heritage in NZ history"
    ],
    key_positions: [
      "Environment and climate",
      "Multicultural representation",
      "Community wellbeing"
    ],
    accomplishments: [
      "First MP with Vietnamese heritage in NZ history"
    ],
    controversies: [
      "Limited public profile as first-term MP"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Steve Abel",
    partyName: "Green Party",
    role: "List MP",
    type: "list",
    electorate: null,
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Long-time environment and climate activist",
      "Successful advocacy campaigns to end native logging and protect forests"
    ],
    career_in_politics: [
      "List MP since 2023 — new entrant"
    ],
    key_positions: [
      "Native forest protection",
      "Climate action",
      "Conservation"
    ],
    accomplishments: [
      "Decades of environmental activism before entering Parliament",
      "Led campaigns ending native logging"
    ],
    controversies: [
      "Limited parliamentary controversies as first-term MP"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Lawrence Xu-Nan",
    partyName: "Green Party",
    role: "List MP",
    type: "list",
    electorate: null,
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Academic and community advocate",
      "Of Chinese heritage"
    ],
    career_in_politics: [
      "Entered Parliament in 2024 replacing Efeso Collins who died in February 2024"
    ],
    key_positions: [
      "Multicultural representation",
      "Social justice",
      "Climate policy"
    ],
    accomplishments: [
      "Brought diverse ethnic representation to Green caucus"
    ],
    controversies: [
      "Winston Peters accused him of seeking to impose 'foreign ideas' on New Zealanders — widely condemned as xenophobic"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Francisco Hernandez",
    partyName: "Green Party",
    role: "List MP",
    type: "list",
    electorate: null,
    political_spectrum: "left-environmentalist",
    career_before_politics: [
      "Community organiser"
    ],
    career_in_politics: [
      "Entered Parliament in May 2024 replacing James Shaw who resigned"
    ],
    key_positions: [
      "Social justice",
      "Migrant communities",
      "Environment"
    ],
    accomplishments: [
      "Entered Parliament as part of Green caucus renewal in 2024"
    ],
    controversies: [
      "Winston Peters accused him of seeking to impose 'foreign ideas' on New Zealanders — condemned as xenophobic by Labour and Greens"
    ],
    last_updated: new Date(),
    isActive: true,
  }
];

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏛️  Green MPs seed script ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅  Connected to MongoDB\n');
  }

  // Get Green party
  let greenParty;
  if (!DRY_RUN) {
    greenParty = await Party.findOne({ slug: 'greens' });
    if (!greenParty) {
      console.error('❌  Green Party not found. Run seed-data.js first.');
      process.exit(1);
    }
  }

  // Seed MPs
  console.log(`📦 Seeding ${greenMPs.length} Green MPs…`);
  if (!DRY_RUN) {
    for (const mpData of greenMPs) {
      const mp = {
        ...mpData,
        fullName: mpData.name,
        slug: mpData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        party: greenParty._id,
      };
      await MP.updateOne({ slug: mp.slug }, { $set: mp }, { upsert: true });
      console.log(`   ✓ ${mpData.name}`);
    }
  } else {
    greenMPs.forEach((mp) => console.log(`   [dry] ${mp.name}`));
  }

  console.log('\n🎉 Done!\n');
  if (!DRY_RUN) await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});