import api from '../api/axios.js';

export const getCourses = (params = {}) => api.get('/courses', { params });
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (payload) => api.post('/courses', payload);
export const updateCourse = (id, payload) => api.put(`/courses/${id}`, payload);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const addCourseReview = (id, payload) => api.post(`/courses/${id}/reviews`, payload);
