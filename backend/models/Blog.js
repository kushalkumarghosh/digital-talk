import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
  numericId: { type: Number, index: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  category: { type: String },
  author: { type: String },
  published_date: { type: String },
  reading_time: { type: String },
  excerpt: { type: String },
  content: { type: String, required: true },
  published: { type: Boolean, default: true },
  authorUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

blogSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.numericId) {
    this.numericId = Math.floor(100000 + Math.random() * 900000);
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.slice(0, 160) + (this.content.length > 160 ? '…' : '');
  }
  next();
});

export default mongoose.model('Blog', blogSchema);
