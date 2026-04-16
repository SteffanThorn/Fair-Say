#!/usr/bin/env node
/**
 * scripts/seed-act-mps.js
 *
 * Seeds ACT New Zealand MPs data into the database.
 *
 * Usage:
 *   npx tsx scripts/seed-act-mps.js
 *   npx tsx scripts/seed-act-mps.js --dry-run
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

const actMPs = [
  {
    name: "David Seymour",
    partyName: "ACT New Zealand",
    role: "Deputy Prime Minister, Minister for Regulation",
    type: "electorate",
    electorate: "Epsom",
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "Electrical engineer",
      "Worked for conservative think tanks in Canada",
      "Involved in legislation enabling Partnership (Charter) Schools"
    ],
    career_in_politics: [
      "MP for Epsom since 2014 — entered as ACT's sole MP",
      "Leader of ACT since 2014",
      "Parliamentary Under-Secretary under John Key government",
      "Deputy Prime Minister from May 2025 (shared role with Winston Peters until then)",
      "Minister for Regulation since 2023 — first ever holder of this portfolio"
    ],
    key_positions: [
      "Free market economics and reduced government",
      "Treaty Principles Bill — redefine Treaty of Waitangi principles via referendum",
      "Charter schools and education choice",
      "Individual freedom and personal responsibility",
      "Reduce Parliament from 120 to 100 MPs"
    ],
    accomplishments: [
      "Passed End of Life Choice Act — landmark euthanasia legislation after years of advocacy",
      "Grew ACT from 1 seat in 2014 to 11 seats in 2023",
      "Passed Regulatory Standards Act 2025",
      "Appeared on Dancing with the Stars — finished 5th",
      "Raised $60,000 for Prostate Cancer Foundation with Jacinda Ardern after she told him to 'go home'"
    ],
    controversies: [
      "Treaty Principles Bill sparked nationwide protests and a parliamentary haka — voted down 11-112 in April 2025",
      "Publicly contradicted PM Luxon multiple times — tensions within coalition",
      "Instructed Pharmac to stop considering Treaty of Waitangi in decisions",
      "Cancelled school lunch programme review — critics argued it harmed low-income children",
      "Has partial Māori ancestry but opposes Māori co-governance arrangements"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Brooke van Velden",
    partyName: "ACT New Zealand",
    role: "Deputy Leader, Minister for Workplace Relations and Safety, Minister for Internal Affairs",
    type: "electorate",
    electorate: "Tāmaki",
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "Policy analyst and political advisor",
      "University of Auckland graduate"
    ],
    career_in_politics: [
      "List MP since 2020",
      "Won Tāmaki electorate in 2023",
      "Deputy Leader of ACT since 2020",
      "Minister for Workplace Relations and Safety since 2023"
    ],
    key_positions: [
      "Workplace flexibility and reduced employment regulation",
      "90-day no-cause eviction trial periods — reinstated under her watch",
      "Individual employment contracts over collective bargaining"
    ],
    accomplishments: [
      "First ACT MP to win Tāmaki electorate",
      "Reinstated 90-day no-cause evictions for tenants",
      "Scrapped Fair Pay Agreements introduced by Labour"
    ],
    controversies: [
      "Fair Pay Agreement repeal criticised by unions as stripping worker protections",
      "90-day eviction policy criticised by housing advocates as harmful to renters"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Nicole McKee",
    partyName: "ACT New Zealand",
    role: "Associate Minister of Justice, Associate Minister of Police",
    type: "list",
    electorate: null,
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "CEO of the Council of Licensed Firearms Owners (COLFO)",
      "Prominent firearms rights advocate"
    ],
    career_in_politics: [
      "List MP since 2020",
      "Ranked 3rd on ACT list",
      "Associate Minister of Justice and Police since 2023"
    ],
    key_positions: [
      "Firearms law reform — rollback of post-Christchurch attack restrictions",
      "Law and order",
      "Individual rights"
    ],
    accomplishments: [
      "Led ACT's firearms policy work",
      "Advocate for licensed firearms owners' rights"
    ],
    controversies: [
      "Push to soften firearms laws following Christchurch mosque attacks drew significant criticism from survivors and victim advocates",
      "Background as firearms lobby CEO seen as conflict of interest by critics"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Todd Stephenson",
    partyName: "ACT New Zealand",
    role: "MP",
    type: "list",
    electorate: null,
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "Health industry professional",
      "Based in Southland"
    ],
    career_in_politics: [
      "List MP since 2023 — new entrant ranked 4th on ACT list"
    ],
    key_positions: [
      "Health system efficiency",
      "Regional economic development",
      "Reduced regulation"
    ],
    accomplishments: [
      "Entered Parliament as one of ACT's new 2023 intake"
    ],
    controversies: [
      "Limited public profile as a first-term MP"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Andrew Hoggard",
    partyName: "ACT New Zealand",
    role: "MP, Associate Minister of Agriculture",
    type: "list",
    electorate: null,
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "Farmer",
      "President of Federated Farmers of New Zealand"
    ],
    career_in_politics: [
      "List MP since 2023 — ranked 5th on ACT list",
      "Associate Minister of Agriculture"
    ],
    key_positions: [
      "Reducing agricultural regulation",
      "Farmer rights and rural communities",
      "Rollback of freshwater and emissions regulations on farming"
    ],
    accomplishments: [
      "Brought significant farming sector credibility to ACT caucus",
      "Former Federated Farmers president — well-known in rural NZ"
    ],
    controversies: [
      "Environmental advocates criticise his push to weaken freshwater regulations protecting waterways from agricultural runoff"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Karen Chhour",
    partyName: "ACT New Zealand",
    role: "Minister for Children (Oranga Tamariki)",
    type: "list",
    electorate: null,
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "Former state care recipient — personal experience with Oranga Tamariki system",
      "Community advocate"
    ],
    career_in_politics: [
      "List MP since 2020",
      "Ranked 6th on ACT list in 2023",
      "Minister for Children since 2023"
    ],
    key_positions: [
      "Oranga Tamariki reform",
      "Child protection system overhaul",
      "Reducing ideology-driven policy in child welfare"
    ],
    accomplishments: [
      "Brought lived experience of state care to the children's portfolio",
      "Oversaw significant reforms to Oranga Tamariki"
    ],
    controversies: [
      "Proposed removing Section 7AA of the Oranga Tamariki Act — a provision requiring the agency to give effect to Treaty of Waitangi principles — drew strong opposition from Māori groups and child advocates",
      "Critics argued her reforms risk harming Māori children disproportionately in the care system"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Mark Cameron",
    partyName: "ACT New Zealand",
    role: "MP",
    type: "list",
    electorate: null,
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "Farmer and rural business owner"
    ],
    career_in_politics: [
      "List MP since 2020",
      "Ranked 7th on ACT list in 2023"
    ],
    key_positions: [
      "Rural communities",
      "Farming and agricultural deregulation",
      "Property rights"
    ],
    accomplishments: [
      "Consistent rural voice within ACT caucus"
    ],
    controversies: [
      "Limited public profile"
    ],
    last_updated: new Date(),
    isActive: true,
  },
  {
    name: "Simon Court",
    partyName: "ACT New Zealand",
    role: "MP",
    type: "list",
    electorate: null,
    political_spectrum: "libertarian-right",
    career_before_politics: [
      "Engineer and environmental consultant"
    ],
    career_in_politics: [
      "List MP since 2020",
      "Ranked 8th on ACT list in 2023"
    ],
    key_positions: [
      "Resource Management Act reform",
      "Reducing environmental regulatory burden",
      "Infrastructure development"
    ],
    accomplishments: [
      "Active in RMA reform select committee work"
    ],
    controversies: [
      "Referred to Parliament's Privileges Committee in 2023 for leaking confidential select committee vote — found to have committed a clear breach and apologised"
    ],
    last_updated: new Date(),
    isActive: true,
  }
];

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏛️  ACT MPs seed script ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅  Connected to MongoDB\n');
  }

  // Get ACT party
  let actParty;
  if (!DRY_RUN) {
    actParty = await Party.findOne({ slug: 'act' });
    if (!actParty) {
      console.error('❌  ACT Party not found. Run seed-data.js first.');
      process.exit(1);
    }
  }

  // Seed MPs
  console.log(`📦 Seeding ${actMPs.length} ACT MPs…`);
  if (!DRY_RUN) {
    for (const mpData of actMPs) {
      const mp = {
        ...mpData,
        fullName: mpData.name,
        slug: mpData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        party: actParty._id,
      };
      await MP.updateOne({ slug: mp.slug }, { $set: mp }, { upsert: true });
      console.log(`   ✓ ${mpData.name}`);
    }
  } else {
    actMPs.forEach((mp) => console.log(`   [dry] ${mp.name}`));
  }

  console.log('\n🎉 Done!\n');
  if (!DRY_RUN) await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});