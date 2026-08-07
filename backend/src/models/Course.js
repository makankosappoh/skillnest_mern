import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, default: '10 min' },
    locked: { type: Boolean, default: false },
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lessons: [lessonSchema],
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Programming', 'Design', 'Business', 'Data & AI', 'Health', 'Other'],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    duration: {
      type: String,
      default: '4 weeks',
    },
    instructor: {
      name: { type: String, required: true },
      title: { type: String, default: '' },
    },
    thumbnailColor: {
      type: String,
      default: 'c1', // maps to a Tailwind gradient class on the frontend (c1..c6)
    },
    curriculum: [moduleSchema],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);
export default Course;
