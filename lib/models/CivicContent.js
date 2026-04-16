import mongoose from 'mongoose';

const civicContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: [
        'how-government-works',
        'influence-avenues',
        'local-council',
        'mmp-explained',
        'select-committees',
        'oia-requests',
      ],
    },
    // URL-friendly slug within the section
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    // Stored as Markdown; rendered on the front end
    markdownContent: { type: String, default: '' },
    // Display order within the section (lower = first)
    order: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

civicContentSchema.index({ section: 1, order: 1 });
civicContentSchema.index({ slug: 1, section: 1 }, { unique: true });

const CivicContent =
  mongoose.models.CivicContent || mongoose.model('CivicContent', civicContentSchema);

export default CivicContent;
