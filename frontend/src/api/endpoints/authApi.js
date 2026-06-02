import api from '../axiosConfig';

export const authApi = {
  login:          (credentials) => api.post('/auth/login', credentials),
  register:       (data)        => api.post('/auth/register', data),
  forgotPassword: (data)        => api.post('/auth/forgot-password', data),
  resetPassword:  (data)        => api.post('/auth/reset-password', data),
};
