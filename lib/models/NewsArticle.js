import mongoose from 'mongoose';

const newsArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    source: { type: String, trim: true },         // e.g. "RNZ", "Stuff", "NZ Herald"
    url: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    publishedDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ['national', 'local', 'politics', 'economy', 'environment'],
      default: 'politics',
    },
    imageUrl: { type: String, trim: true },
    // Unique ID from the upstream API (NewsAPI article URL hash)
    apiSourceId: { type: String, unique: true, sparse: true },
    // Which feed this came from: 'newsapi' | 'rss'
    feedSource: { type: String, default: 'newsapi' },
  },
  { timestamps: true }
);

// TTL index — auto-delete articles older than 7 days to keep the collection lean
newsArticleSchema.index({ publishedDate: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
newsArticleSchema.index({ category: 1, publishedDate: -1 });

const NewsArticle = mongoose.models.NewsArticle || mongoose.model('NewsArticle', newsArticleSchema);

export default NewsArticle;
