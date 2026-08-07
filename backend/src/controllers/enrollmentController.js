import asyncHandler from 'express-async-handler';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Enroll the logged-in user in a course
// @route   POST /api/enrollments/:courseId
// @access  Private
export const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (existing) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: courseId,
  });

  course.studentsCount += 1;
  await course.save();

  res.status(201).json({ success: true, data: enrollment });
});

// @desc    Get the logged-in user's enrolled courses
// @route   GET /api/enrollments/me
// @access  Private
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: enrollments });
});

// @desc    Get all enrollments (admin)
// @route   GET /api/enrollments
// @access  Private/Admin
export const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({})
    .populate('user', 'name email')
    .populate('course', 'title price')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: enrollments });
});

// @desc    Dashboard summary stats (admin)
// @route   GET /api/enrollments/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalCourses, totalStudents, totalEnrollments, courses] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments({ role: 'student' }),
    Enrollment.countDocuments(),
    Course.find({}, 'price studentsCount'),
  ]);

  const revenue = courses.reduce((sum, c) => sum + c.price * c.studentsCount, 0);

  // Enrollments grouped by month (last 7 months) for the dashboard chart
  const monthly = await Enrollment.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 7 },
  ]);

  res.json({
    success: true,
    data: { totalCourses, totalStudents, totalEnrollments, revenue, monthly },
  });
});
