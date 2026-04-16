#!/usr/bin/env node
/**
 * scripts/seed-labour-mps.js
 *
 * Seeds Labour Party MPs data into the database.
 *
 * Usage:
 *   npx tsx scripts/seed-labour-mps.js
 *   npx tsx scripts/seed-labour-mps.js --dry-run
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

const labourMPs = [
  {
    name: "Chris Hipkins",
    partyName: "Labour",
    role: "Leader of the Opposition",
    type: "electorate",
    electorate: "Remutaka",
    political_spectrum: "centre-left",
    career_before_politics: [
      "Student politics — elected VUWSA President twice (2000, 2001)",
      "Policy adviser for two Labour education ministers",
      "Worked in office of Prime Minister Helen Clark"
    ],
    career_in_politics: [
      "MP for Remutaka since 2008",
      "Minister of Education and Leader of the House 2017–2023",
      "Minister of Health and COVID-19 Response 2020–2022",
      "Prime Minister January–November 2023",
      "Leader of the Opposition since November 2023"
    ],
    key_positions: [
      "Cost of living focus — workers, housing, health",
      "Anti-AUKUS — would not join under his leadership",
      "Palestinian statehood recognition",
      "NZ Future Fund economic investment policy"
    ],
    accomplishments: [
      "Led NZ's COVID-19 response as Health Minister — widely praised internationally",
      "Became PM as consensus candidate after Ardern's resignation",
      "Retained leadership after heavy 2023 election defeat",
      "Successfully passed several private member's bills in opposition"
    ],
    controversies: [
      "Led Labour to worst MMP-era defeat in 2023 — 65 seats to 34",
      "Nicknamed 'Chippy' — some critics say his everyman image masks lack of vision",
      "Arrested in 1997 during student protest at Parliament — later received compensation and apology",
      "Leadership questioned multiple times through 2024–2025 as poll numbers remained low"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Carmel Sepuloni",
    partyName: "Labour",
    role: "Deputy Leader of the Opposition",
    type: "electorate",
    electorate: "Kelston",
    political_spectrum: "centre-left",
    career_before_politics: [
      "Social worker and community advocate",
      "University of Auckland — studied social work"
    ],
    career_in_politics: [
      "MP since 2008",
      "Minister of Social Development and Employment 2017–2023",
      "Deputy Prime Minister 2023 — first Pasifika person to hold the role",
      "Deputy Leader of the Opposition since November 2023"
    ],
    key_positions: [
      "Social development and poverty reduction",
      "Pacific Peoples representation",
      "Child poverty reduction"
    ],
    accomplishments: [
      "First Pasifika Deputy Prime Minister in NZ history",
      "Oversaw significant welfare reforms including benefit increases during Labour government"
    ],
    controversies: [
      "Criticised for welfare system performance during her time as Social Development Minister",
      "Some advocates said benefit increases under her watch were insufficient"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Barbara Edmonds",
    partyName: "Labour",
    role: "Finance Spokesperson",
    type: "electorate",
    electorate: "Mana",
    political_spectrum: "centre-left",
    career_before_politics: [
      "Tax lawyer",
      "Former Beehive staffer",
      "Mother of eight"
    ],
    career_in_politics: [
      "MP since 2020",
      "Promoted to Finance spokesperson in 2024 after Grant Robertson's resignation",
      "Ranked 4th in Labour caucus"
    ],
    key_positions: [
      "NZ Future Fund — sovereign wealth fund modelled on Singapore's Temasek",
      "Progressive taxation",
      "Economic investment in New Zealand"
    ],
    accomplishments: [
      "Rose rapidly through Labour ranks",
      "Unveiled NZ Future Fund policy with Hipkins in 2024",
      "Widely seen as a future Labour leader"
    ],
    controversies: [
      "Limited track record as finance spokesperson — still building profile"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Megan Woods",
    partyName: "Labour",
    role: "Energy and Resources Spokesperson",
    type: "electorate",
    electorate: "Wigram",
    political_spectrum: "centre-left",
    career_before_politics: [
      "Academic — PhD in History from University of Canterbury",
      "Lecturer at University of Canterbury"
    ],
    career_in_politics: [
      "MP since 2011",
      "Minister of Energy and Resources, Housing, Research, Science and Innovation under Labour government",
      "Ranked 4th in caucus during government"
    ],
    key_positions: [
      "Renewable energy transition",
      "Housing supply and affordability",
      "Research and science investment"
    ],
    accomplishments: [
      "One of Labour's most senior and experienced MPs",
      "Managed major housing and energy portfolios simultaneously"
    ],
    controversies: [
      "Housing crisis worsened during Labour's tenure despite her role as Housing Minister",
      "Critics questioned effectiveness of housing policies"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Willie Jackson",
    partyName: "Labour",
    role: "Māori Development and Māori-Crown Relations Spokesperson",
    type: "list",
    electorate: null,
    political_spectrum: "centre-left",
    career_before_politics: [
      "Prominent broadcaster and media personality",
      "Iwi radio and television — co-host of various programmes",
      "Community and Māori rights advocate"
    ],
    career_in_politics: [
      "MP since 2017",
      "Minister of Māori Development, Broadcasting and Employment under Labour government",
      "Ranked 5th in Labour caucus"
    ],
    key_positions: [
      "Māori development and self-determination",
      "Māori media and broadcasting",
      "Employment and workplace relations"
    ],
    accomplishments: [
      "Long career in Māori broadcasting before politics",
      "Senior Māori voice within Labour caucus"
    ],
    controversies: [
      "Made controversial comments defending a former colleague accused of sexual harassment in 2018 — widely criticised",
      "Has clashed publicly with Te Pāti Māori over representation of Māori interests"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Kieran McAnulty",
    partyName: "Labour",
    role: "Housing and Local Government Spokesperson, Shadow Leader of the House",
    type: "electorate",
    electorate: "Wairarapa",
    political_spectrum: "centre-left",
    career_before_politics: [
      "Local government — Masterton District Councillor",
      "Business background in the Wairarapa region"
    ],
    career_in_politics: [
      "MP for Wairarapa since 2020",
      "Minister for Emergency Management during Auckland floods and Cyclone Gabrielle 2023",
      "Shadow Leader of the House since November 2023"
    ],
    key_positions: [
      "Housing affordability and supply",
      "Regional development",
      "Local government"
    ],
    accomplishments: [
      "Widely praised for handling of 2023 Auckland Anniversary Weekend floods and Cyclone Gabrielle response",
      "One of Labour's most popular and high-profile MPs",
      "Seen as a future leader of the Labour Party"
    ],
    controversies: [
      "Limited controversies — one of Labour's cleanest political profiles"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Ayesha Verrall",
    partyName: "Labour",
    role: "Health Spokesperson",
    type: "list",
    electorate: null,
    political_spectrum: "centre-left",
    career_before_politics: [
      "Medical doctor — infectious disease specialist",
      "Public health researcher at University of Otago Wellington"
    ],
    career_in_politics: [
      "MP since 2020",
      "Minister of Health and Food Safety under Labour government",
      "Health spokesperson in opposition since 2023"
    ],
    key_positions: [
      "Public health system investment",
      "Preventive health and primary care",
      "Pandemic preparedness"
    ],
    accomplishments: [
      "Brought medical expertise directly to health portfolio",
      "Oversaw establishment of Te Whatu Ora (Health NZ) under Labour"
    ],
    controversies: [
      "Te Whatu Ora was placed under a commissioner by the incoming National government citing financial mismanagement during its establishment"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Ginny Andersen",
    partyName: "Labour",
    role: "Police and Prevention of Family Violence Spokesperson",
    type: "electorate",
    electorate: "Hutt South",
    political_spectrum: "centre-left",
    career_before_politics: [
      "Community and social sector work",
      "Local government involvement"
    ],
    career_in_politics: [
      "MP since 2017",
      "Minister of Police under Labour government",
      "Police spokesperson in opposition"
    ],
    key_positions: [
      "Community policing and prevention",
      "Family and sexual violence prevention",
      "Treaty of Waitangi negotiations"
    ],
    accomplishments: [
      "Increased police budget by 35% and police numbers by 15% during her ministerial tenure"
    ],
    controversies: [
      "Faced bullying allegations from within her office in 2023 — Hipkins stated he had full confidence in her",
      "Lost Hutt South electorate to National's Chris Bishop in 2023"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Duncan Webb",
    partyName: "Labour",
    role: "Justice Spokesperson, Deputy Shadow Leader of the House",
    type: "electorate",
    electorate: "Christchurch Central",
    political_spectrum: "centre-left",
    career_before_politics: [
      "Lawyer — senior legal practitioner",
      "University of Canterbury — law lecturer"
    ],
    career_in_politics: [
      "MP since 2017",
      "Justice spokesperson in opposition",
      "Signalled retirement ahead of 2026 election"
    ],
    key_positions: [
      "Justice system reform",
      "Regulation and consumer protection",
      "Christchurch earthquake recovery"
    ],
    accomplishments: [
      "Described as 'forensic' in his scrutiny of legislation",
      "Strong legal background brought to justice portfolio"
    ],
    controversies: [
      "Relatively low public profile"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Camilla Belich",
    partyName: "Labour",
    role: "MP, Senior Whip",
    type: "list",
    electorate: null,
    political_spectrum: "centre-left",
    career_before_politics: [
      "Lawyer"
    ],
    career_in_politics: [
      "MP since 2020",
      "Senior Whip",
      "Passed private member's bill in 2025 making wage theft by employers a criminal offence"
    ],
    key_positions: [
      "Workers rights",
      "Employment law",
      "Women's rights"
    ],
    accomplishments: [
      "Crimes (Theft By Employer) Amendment Bill passed March 2025 — landmark workers rights legislation"
    ],
    controversies: [
      "Limited controversies"
    ],
    last_updated: new Date(),
    isActive: true,
  }
];

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏛️  Labour MPs seed script ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅  Connected to MongoDB\n');
  }

  // Get Labour party
  let labourParty;
  if (!DRY_RUN) {
    labourParty = await Party.findOne({ slug: 'labour' });
    if (!labourParty) {
      console.error('❌  Labour Party not found. Run seed-data.js first.');
      process.exit(1);
    }
  }

  // Seed MPs
  console.log(`📦 Seeding ${labourMPs.length} Labour MPs…`);
  if (!DRY_RUN) {
    for (const mpData of labourMPs) {
      const mp = {
        ...mpData,
        fullName: mpData.name,
        slug: mpData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        party: labourParty._id,
      };
      await MP.updateOne({ slug: mp.slug }, { $set: mp }, { upsert: true });
      console.log(`   ✓ ${mpData.name}`);
    }
  } else {
    labourMPs.forEach((mp) => console.log(`   [dry] ${mp.name}`));
  }

  console.log('\n🎉 Done!\n');
  if (!DRY_RUN) await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});