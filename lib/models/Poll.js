import mongoose from 'mongoose';

// For election-vote / local-council polls: options is an array of party/candidate names.
// For pairwise polls: options is empty; events holds refs to two CivicEvent docs.
const pollOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    voteCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const pollSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['election-vote', 'local-council', 'pairwise', 'general'],
      default: 'general',
    },
    question: { type: String, required: true, trim: true },
    // Used for election-vote, local-council, general polls
    options: [pollOptionSchema],
    // Used for pairwise polls — exactly 2 CivicEvent refs per comparison
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    isActive: { type: Boolean, default: true },
    totalVotes: { type: Number, default: 0 },
    // Admin-defined display order
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pollSchema.index({ type: 1, isActive: 1 });
pollSchema.index({ isActive: 1, displayOrder: 1 });

const Poll = mongoose.models.Poll || mongoose.model('Poll', pollSchema);

export default Poll;
