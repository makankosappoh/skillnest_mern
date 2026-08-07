import asyncHandler from 'express-async-handler';
import Course from '../models/Course.js';

// @desc    Get all courses (public) — supports search, filters, sort, pagination
// @route   GET /api/courses?keyword=&category=&level=&sort=&page=&limit=
// @access  Public
export const getCourses = asyncHandler(async (req, res) => {
  const { keyword, category, level, sort, page = 1, limit = 9 } = req.query;

  const query = { status: 'published' };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (category) {
    query.category = category;
  }
  if (level) {
    query.level = level;
  }

  let sortOption = { createdAt: -1 }; // Newest by default
  if (sort === 'popular') sortOption = { studentsCount: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'price-asc') sortOption = { price: 1 };
  if (sort === 'price-desc') sortOption = { price: -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [courses, total] = await Promise.all([
    Course.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Course.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: courses,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

// @desc    Get single course by id
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'reviews.user',
    'name'
  );

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json({ success: true, data: course });
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: course });
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  Object.assign(course, req.body);
  const updated = await course.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  await course.deleteOne();
  res.json({ success: true, data: {} });
});

// @desc    Add a review to a course (must be enrolled — enforced in route layer via middleware if desired)
// @route   POST /api/courses/:id/reviews
// @access  Private
export const addCourseReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const alreadyReviewed = course.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this course');
  }

  course.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  course.numReviews = course.reviews.length;
  course.rating =
    course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length;

  await course.save();
  res.status(201).json({ success: true, message: 'Review added' });
});
