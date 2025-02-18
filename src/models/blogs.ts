import mongoose, { Document, Schema } from 'mongoose';

interface BlogPost extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const blogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BlogPostModel = mongoose.model<BlogPost>('BlogPost', blogPostSchema, 'blogPosts'); // Specify 'blogPosts' as the collection name

export default BlogPostModel;
