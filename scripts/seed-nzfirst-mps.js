#!/usr/bin/env node
/**
 * scripts/seed-nzfirst-mps.js
 *
 * Seeds New Zealand First MPs data into the database.
 *
 * Usage:
 *   npx tsx scripts/seed-nzfirst-mps.js
 *   npx tsx scripts/seed-nzfirst-mps.js --dry-run
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

const nzFirstMPs = [
  {
    name: "Winston Peters",
    partyName: "New Zealand First",
    role: "Leader, Minister of Foreign Affairs, former Deputy Prime Minister",
    type: "list",
    electorate: null,
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "Lawyer — University of Otago law graduate",
      "National Party MP for Tauranga from 1984",
      "Minister of Māori Affairs under Jim Bolger's National government"
    ],
    career_in_politics: [
      "MP since 1984 — one of NZ's longest-serving politicians",
      "Founded New Zealand First in 1993 after being expelled from National",
      "Deputy PM and Treasurer 1996–1998 in coalition with National",
      "Deputy PM 2017–2020 in coalition with Labour",
      "Deputy PM until May 2025 in coalition with National and ACT",
      "Minister of Foreign Affairs since 2023"
    ],
    key_positions: [
      "NZ sovereignty and anti-globalism",
      "Superannuation protection — oppose raising retirement age",
      "Controlled immigration and migrant values statements",
      "Referendum to abolish Māori electorates",
      "Compulsory 10% KiwiSaver contributions",
      "English as an official language of New Zealand"
    ],
    accomplishments: [
      "Kingmaker in multiple elections — only party to have governed with both National and Labour under MMP",
      "Led NZ First back from political oblivion after 2020 wipeout",
      "Secured significant regional development and infrastructure funding in coalition deals",
      "Negotiated NZ$461 million rail network upgrade as Foreign Affairs Minister",
      "Resumed NZ funding to UNRWA despite coalition tensions"
    ],
    controversies: [
      "Made remarks targeting Green MPs from migrant backgrounds — accused of racism by Labour and Greens in 2025",
      "Repeatedly criticised use of Māori language 'Aotearoa' in Parliament",
      "Publicly undercut Finance Minister Nicola Willis by claiming tax cuts created a $5.6b fiscal hole",
      "Used 'agree to disagree' clause over immigration residency pathways — destabilised coalition",
      "Long history of political controversy spanning four decades",
      "Opposed use of te reo Māori in public life throughout his career"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Shane Jones",
    partyName: "New Zealand First",
    role: "Deputy Leader, Minister for Regional Development, Oceans and Fisheries, Resources",
    type: "electorate",
    electorate: "Northland",
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "Lawyer and businessman",
      "Pacific Economic Ambassador — appointed 2014 after leaving Labour"
    ],
    career_in_politics: [
      "Labour list MP 2005–2014",
      "Contested Labour leadership in 2013 — lost to David Cunliffe",
      "NZ First MP 2017–2020",
      "NZ First MP for Northland since 2023",
      "Deputy Leader of NZ First since September 2025",
      "Minister for Regional Development, Oceans and Fisheries, Resources since 2023"
    ],
    key_positions: [
      "Regional economic development — roads, infrastructure, industry",
      "Fishing and ocean resource management",
      "Resource extraction — mining, oil and gas",
      "Anti-co-governance",
      "Immigration control"
    ],
    accomplishments: [
      "Provincial Growth Fund — directed billions to regional NZ during 2017–2020 Labour coalition",
      "Senior voice for Northland and regional NZ",
      "Elected Deputy Leader unanimously by NZ First caucus in 2025"
    ],
    controversies: [
      "Made remarks about 'sending Mexicans home' targeting Green MP Ricardo Menéndez March — widely condemned as racist",
      "Accused Green MPs Lawrence Xu-Nan and Francisco Hernandez of imposing 'foreign ideas' on NZ",
      "Described as deliberately provocative and inflammatory in parliamentary debates",
      "Crossed the floor from Labour to NZ First — seen by some as opportunistic",
      "Past allegations regarding use of parliamentary credit card while a Labour MP"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Casey Costello",
    partyName: "New Zealand First",
    role: "Minister for Customs, Associate Minister of Health, Associate Minister of Immigration",
    type: "list",
    electorate: null,
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "Detective Sergeant in NZ Police",
      "Vice President of the Police Association — first woman elected to this role",
      "Founding trustee of Hobson's Pledge — opposes co-governance",
      "Former chairperson and board member of the NZ Taxpayers' Union"
    ],
    career_in_politics: [
      "List MP since 2023 — new entrant ranked 3rd on NZ First list",
      "Associate Minister of Health and Immigration since 2023"
    ],
    key_positions: [
      "Opposition to co-governance and Māori-specific policy",
      "Law and order",
      "Immigration control",
      "Customs and border security"
    ],
    accomplishments: [
      "Brought police and law enforcement background to Parliament",
      "Senior NZ First voice on health and immigration policy"
    ],
    controversies: [
      "Founding trustee of Hobson's Pledge — an organisation widely criticised for its opposition to Māori rights",
      "Former Taxpayers' Union board member — seen as conflict of interest with ministerial role",
      "Has Ngāpuhi/Ngāti Wai Māori ancestry but actively opposes co-governance arrangements"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Mark Patterson",
    partyName: "New Zealand First",
    role: "MP, Associate Minister of Agriculture",
    type: "list",
    electorate: null,
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "Beef and sheep farmer in Otago",
      "Otago Federated Farmers chair"
    ],
    career_in_politics: [
      "List MP 2017–2020",
      "Returned as list MP in 2023 — ranked 4th on NZ First list",
      "Associate Minister of Agriculture"
    ],
    key_positions: [
      "Agricultural deregulation",
      "Farmer rights and rural communities",
      "Reducing environmental compliance costs for farmers"
    ],
    accomplishments: [
      "Consistent voice for South Island farming communities",
      "Brought practical farming knowledge to agricultural policy"
    ],
    controversies: [
      "Switched from National to NZ First after Silver Fern Farms sale to Chinese buyers in 2016"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Jenny Marcroft",
    partyName: "New Zealand First",
    role: "MP",
    type: "list",
    electorate: null,
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "30 years in radio and television broadcasting",
      "Worked in health sector after first parliamentary stint",
      "Worked for Auckland Mayor Wayne Brown"
    ],
    career_in_politics: [
      "List MP 2017–2020 — first stint",
      "Resigned from NZ First after 2020 defeat citing cultural issues",
      "Returned as list MP in 2023 — ranked 5th on NZ First list"
    ],
    key_positions: [
      "Broadcasting and media",
      "Health sector",
      "Regional representation"
    ],
    accomplishments: [
      "Long broadcasting career including early advocacy for correct Māori language pronunciation on air",
      "Ngāpuhi wahine bringing Māori perspective to NZ First"
    ],
    controversies: [
      "Resigned from NZ First after 2020 defeat citing internal cultural issues — then rejoined for 2023"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Jamie Arbuckle",
    partyName: "New Zealand First",
    role: "MP",
    type: "list",
    electorate: null,
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "Military background — army officer"
    ],
    career_in_politics: [
      "List MP since 2023 — ranked 6th on NZ First list, new entrant"
    ],
    key_positions: [
      "Defence and national security",
      "Law and order"
    ],
    accomplishments: [
      "Brought military background to NZ First caucus"
    ],
    controversies: [
      "Limited public profile as first-term MP"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Andy Foster",
    partyName: "New Zealand First",
    role: "MP",
    type: "list",
    electorate: null,
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "Mayor of Wellington 2019–2022",
      "Wellington City Councillor for many years before becoming mayor"
    ],
    career_in_politics: [
      "List MP since 2023 — ranked 7th on NZ First list, new entrant"
    ],
    key_positions: [
      "Local government and urban issues",
      "Infrastructure",
      "Wellington regional interests"
    ],
    accomplishments: [
      "Former Wellington Mayor — brought significant local government experience to Parliament"
    ],
    controversies: [
      "Lost Wellington mayoral race in 2022 to Tory Whanau"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Tanya Unkovich",
    partyName: "New Zealand First",
    role: "MP",
    type: "list",
    electorate: null,
    political_spectrum: "populist-nationalist",
    career_before_politics: [
      "Anti-COVID restrictions campaigner",
      "Community activist"
    ],
    career_in_politics: [
      "List MP since 2023 — ranked 8th on NZ First list, new entrant"
    ],
    key_positions: [
      "Individual freedoms",
      "Scepticism of government mandates"
    ],
    accomplishments: [
      "Entered Parliament as part of NZ First's 2023 comeback"
    ],
    controversies: [
      "Background as anti-COVID restrictions campaigner drew scrutiny",
      "Limited parliamentary profile"
    ],
    last_updated: new Date(),
    isActive: true,
  }
];

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏛️  NZ First MPs seed script ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅  Connected to MongoDB\n');
  }

  // Get NZ First party
  let nzFirstParty;
  if (!DRY_RUN) {
    nzFirstParty = await Party.findOne({ slug: 'nzfirst' });
    if (!nzFirstParty) {
      console.error('❌  NZ First Party not found. Run seed-data.js first.');
      process.exit(1);
    }
  }

  // Seed MPs
  console.log(`📦 Seeding ${nzFirstMPs.length} NZ First MPs…`);
  if (!DRY_RUN) {
    for (const mpData of nzFirstMPs) {
      const mp = {
        ...mpData,
        fullName: mpData.name,
        slug: mpData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        party: nzFirstParty._id,
      };
      await MP.updateOne({ slug: mp.slug }, { $set: mp }, { upsert: true });
      console.log(`   ✓ ${mpData.name}`);
    }
  } else {
    nzFirstMPs.forEach((mp) => console.log(`   [dry] ${mp.name}`));
  }

  console.log('\n🎉 Done!\n');
  if (!DRY_RUN) await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});