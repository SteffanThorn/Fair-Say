import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, trim: true, default: '' },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    // Unsubscribe token (UUID sent in every email footer)
    unsubscribeToken: { type: String, unique: true, sparse: true },
    // Optional: which content categories they care about
    interests: [{ type: String }],
  },
  { timestamps: false }
);

newsletterSubscriberSchema.index({ email: 1 });
newsletterSubscriberSchema.index({ isActive: 1 });

const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

export default NewsletterSubscriber;
