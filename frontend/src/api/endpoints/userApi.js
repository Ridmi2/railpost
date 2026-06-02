import axiosInstance from '../axiosConfig';

export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data.data;
  },

  // Update profile (fullName, phone)
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/me', data);
    return response.data.data;
  },

  // Change password
  changePassword: async (data) => {
    const response = await axiosInstance.put('/users/me/password', data);
    return response.data.data;
  }
};
