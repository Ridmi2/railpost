import api from '../axiosConfig';

export const publicApi = {
  trackCargo: (trackingNumber) => api.get(`/public/cargo/track/${trackingNumber}`),
};
