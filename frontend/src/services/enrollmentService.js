import api from '../api/axios.js';

export const enrollInCourse = (courseId) => api.post(`/enrollments/${courseId}`);
export const getMyEnrollments = () => api.get('/enrollments/me');
export const getAllEnrollments = () => api.get('/enrollments');
export const getDashboardStats = () => api.get('/enrollments/stats');
