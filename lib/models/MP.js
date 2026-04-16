import mongoose from 'mongoose';

const mpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
    },
    partyName: {
      type: String,
      required: true,
      trim: true,
      enum: ['National', 'ACT', 'NZ First', 'Labour', 'Green', 'Te Pāti Māori'],
    },
    role: { type: String, trim: true, default: 'MP' },
    type: {
      type: String,
      trim: true,
      enum: ['electorate', 'list'],
      default: 'electorate',
    },
    electorate: { type: String, trim: true, default: null },
    political_spectrum: { type: String, trim: true },
    career_before_politics: [{ type: String, trim: true }],
    career_in_politics: [{ type: String, trim: true }],
    key_positions: [{ type: String, trim: true }],
    accomplishments: [{ type: String, trim: true }],
    controversies: [{ type: String, trim: true }],
    last_updated: { type: Date, default: Date.now },
    bioSummary: { type: String, default: '' },
    contactEmail: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    parliamentPageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

mpSchema.index({ slug: 1 });
mpSchema.index({ party: 1 });
mpSchema.index({ partyName: 1 });
mpSchema.index({ name: 1 });
mpSchema.index({ fullName: 'text' });

const MP = mongoose.models.MP || mongoose.model('MP', mpSchema);

export default MP;
