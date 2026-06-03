import api from '../axiosConfig';

export const officerApi = {
  getCargo:         (trackingNumber) => api.get(`/officer/cargo/${trackingNumber}`),
  updateStatus:     (trackingNumber, data) => api.patch(`/officer/cargo/${trackingNumber}/status`, data),
  generateOtp:      (trackingNumber) => api.post(`/officer/cargo/${trackingNumber}/otp`),
  deliverCargo:     (trackingNumber, data) => api.post(`/officer/cargo/${trackingNumber}/deliver`, data),
  getTrains:        () => api.get('/officer/trains'),
  getForecast:      () => api.get('/officer/cargo/forecast'),
  dispatchCargo:    (data) => api.post('/officer/cargo/dispatch', data),
};
