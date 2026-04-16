#!/usr/bin/env node
/**
 * scripts/import-mps.js
 *
 * Imports MPs from a CSV export (data.govt.nz/parliament source).
 *
 * Usage:
 *   npx tsx scripts/import-mps.js --file ./data/mps.csv
 *   npx tsx scripts/import-mps.js --url https://example.com/mps.csv
 *   npx tsx scripts/import-mps.js --dry-run --file ./data/mps.csv
 *
 * Expected CSV columns (case-insensitive aliases supported):
 * - fullName | name
 * - party
 * - electorate
 * - role
 * - bioSummary | bio
 * - contactEmail | email
 * - photoUrl | photo
 * - parliamentPageUrl | profileUrl | parliamentUrl
 */

import 'dotenv/config';
import fs from 'fs/promises';
import mongoose from 'mongoose';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const fileArgIndex = args.indexOf('--file');
const urlArgIndex = args.indexOf('--url');
const filePath = fileArgIndex >= 0 ? args[fileArgIndex + 1] : '';
const csvUrl = urlArgIndex >= 0 ? args[urlArgIndex + 1] : '';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

if (!filePath && !csvUrl) {
  console.error('❌ Provide --file <path> or --url <csv-url>');
  process.exit(1);
}

const partySchema = new mongoose.Schema({ name: String, slug: String, color: String }, { timestamps: true });
const mpSchema = new mongoose.Schema({
  fullName: String,
  slug: String,
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  electorate: String,
  role: String,
  bioSummary: String,
  coreValues: [String],
  contactEmail: String,
  photoUrl: String,
  parliamentPageUrl: String,
  isActive: Boolean,
}, { timestamps: true });

const Party = mongoose.models.Party || mongoose.model('Party', partySchema);
const MP = mongoose.models.MP || mongoose.model('MP', mpSchema);

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCSVLine(line) {
  const out = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      out.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  out.push(current.trim());
  return out;
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter(Boolean);
  if (!lines.length) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

function pick(row, keys) {
  for (const k of keys) {
    if (row[k] && row[k].trim()) return row[k].trim();
  }
  return '';
}

async function readCSVText() {
  if (filePath) {
    return fs.readFile(filePath, 'utf8');
  }

  const response = await fetch(csvUrl);
  if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.status}`);
  return response.text();
}

async function main() {
  console.log(`\n🏛️ Import MPs ${DRY_RUN ? '(DRY RUN)' : ''}`);

  const csvText = await readCSVText();
  const rows = parseCSV(csvText);

  if (!rows.length) {
    console.error('❌ No rows parsed from CSV');
    process.exit(1);
  }

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const fullName = pick(row, ['fullname', 'name']);
    const partyName = pick(row, ['party']);
    const electorate = pick(row, ['electorate']);
    const role = pick(row, ['role']) || 'MP';

    if (!fullName || !partyName) {
      skipped += 1;
      continue;
    }

    const bioSummary = pick(row, ['biosummary', 'bio']);
    const contactEmail = pick(row, ['contactemail', 'email']);
    const photoUrl = pick(row, ['photourl', 'photo']);
    const parliamentPageUrl = pick(row, ['parliamentpageurl', 'profileurl', 'parliamenturl']);

    const partySlug = slugify(partyName);
    const mpSlug = slugify(fullName);

    if (DRY_RUN) {
      console.log(`[dry] ${fullName} (${partyName})`);
      created += 1;
      continue;
    }

    const party = await Party.findOneAndUpdate(
      { slug: partySlug },
      { $setOnInsert: { name: partyName, slug: partySlug, color: '#6b7280' } },
      { upsert: true, new: true }
    );

    await MP.updateOne(
      { slug: mpSlug },
      {
        $set: {
          fullName,
          slug: mpSlug,
          party: party._id,
          electorate: electorate || null,
          role,
          bioSummary,
          contactEmail,
          photoUrl,
          parliamentPageUrl,
          isActive: true,
        },
      },
      { upsert: true }
    );

    created += 1;
  }

  if (!DRY_RUN) {
    await mongoose.disconnect();
  }

  console.log(`\n✅ Imported: ${created}`);
  console.log(`⚠️ Skipped: ${skipped}\n`);
}

main().catch((error) => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});
