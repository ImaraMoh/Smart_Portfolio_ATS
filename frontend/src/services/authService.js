import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data),
  verifyPasswordResetOtp: (email, otp) => api.post('/auth/verify-reset-otp', { email, otp }).then((r) => r.data.data),
  resetPassword: (payload) => api.post('/auth/reset-password', payload).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data.data)
};
