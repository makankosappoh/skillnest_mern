import express from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  getAllEnrollments,
  getDashboardStats,
} from '../controllers/enrollmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:courseId', protect, enrollInCourse);
router.get('/me', protect, getMyEnrollments);
router.get('/stats', protect, admin, getDashboardStats);
router.get('/', protect, admin, getAllEnrollments);

export default router;
