import mongoose from 'mongoose';

const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    spectrum: { type: String, trim: true },
    founded: Number,
    foundedYear: Number,
    current_leader: { type: String, trim: true },
    currentSeats: { type: Number, default: 0 },
    seats: { type: Number, default: 0 },
    government_status: { type: String, trim: true },
    core_policies: [{ type: String, trim: true }],
    coreValues: [{ type: String, trim: true }],
    history: { type: String, default: '' },
    controversies: [{ type: String, trim: true }],
    ideologyDescription: {
      type: String,
      default: '',
    },
    website: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    color: {
      type: String,
      trim: true,
      default: '#6b7280',
    },
    isParliamentary: { type: Boolean, default: true },
  },
  { timestamps: true }
);

partySchema.index({ name: 1 });
partySchema.index({ slug: 1 });

const Party = mongoose.models.Party || mongoose.model('Party', partySchema);

export default Party;
