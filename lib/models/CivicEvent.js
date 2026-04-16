import mongoose from 'mongoose';

// Named CivicEvent to avoid confusion with the browser's built-in Event global,
// but registered in Mongoose as 'Event' for clean collection naming.
const civicEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    // e.g. "RNZ", "parliament.nz", "Auckland Council"
    source: { type: String, trim: true },
    category: {
      type: String,
      enum: ['parliament', 'council', 'budget', 'election', 'policy', 'other'],
      default: 'parliament',
    },
    // Bradley-Terry style score — recalculated after pairwise votes
    importanceScore: { type: Number, default: 1000 },
    // Optional YouTube video ID from NZ Parliament channel
    youtubeVideoId: { type: String, trim: true },
    // How many times this event has appeared in pairwise polls
    pairwiseCount: { type: Number, default: 0 },
    // Win/loss record for Bradley-Terry calculation
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

civicEventSchema.index({ date: -1 });
civicEventSchema.index({ category: 1, importanceScore: -1 });
civicEventSchema.index({ isActive: 1, importanceScore: -1 });

const CivicEvent =
  mongoose.models.Event || mongoose.model('Event', civicEventSchema);

export default CivicEvent;
