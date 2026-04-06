import api from './axios';

// Auth
export const register        = (data) => api.post('/register/', data);
export const login           = (data) => api.post('/login/', data);
export const getProfile      = ()     => api.get('/profile/');
export const getDashboard    = ()     => api.get('/dashboard/');

// Public
export const getServices     = ()     => api.get('/services/');
export const getTestimonials = ()     => api.get('/testimonials/');
export const submitContact   = (data) => api.post('/contact/', data);

// ── NEW: Consultation Request ─────────────────────────────────────────────────
export const submitConsultation = (data) => api.post('/consultation/', data);

// Admin — Stats & Users
export const getAdminStats       = ()           => api.get('/admin/stats/');
export const getAdminUsers       = ()           => api.get('/admin/users/');
export const getAdminMessages    = (type)       => api.get('/admin/messages/', { params: type ? { type } : {} });
export const updateMessageStatus = (id, status) => api.patch(`/admin/messages/${id}/`, { status });

// Admin — Services CRUD
export const adminGetServices   = ()         => api.get('/admin/services/');
export const adminCreateService = (data)     => api.post('/admin/services/', data);
export const adminUpdateService = (id, data) => api.put(`/admin/services/${id}/`, data);
export const adminDeleteService = (id)       => api.delete(`/admin/services/${id}/`);

// Admin — Testimonials CRUD
export const adminGetTestimonials   = ()         => api.get('/admin/testimonials/');
export const adminCreateTestimonial = (data)     => api.post('/admin/testimonials/', data);
export const adminUpdateTestimonial = (id, data) => api.put(`/admin/testimonials/${id}/`, data);
export const adminDeleteTestimonial = (id)       => api.delete(`/admin/testimonials/${id}/`);

// Admin — Consultations
export const adminGetConsultations      = ()           => api.get('/admin/consultations/');
export const adminUpdateConsultation    = (id, status) => api.patch(`/admin/consultations/${id}/`, { status });