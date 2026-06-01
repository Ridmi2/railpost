import api from '../axiosConfig';

export const senderApi = {
  getStats:      ()              => api.get('/sender/stats'),
  getShipments:  ()              => api.get('/sender/cargo'),
  bookCargo:     (data)          => api.post('/sender/cargo/book', data),
  trackCargo:    (trackingNum)   => api.get(`/sender/cargo/track/${trackingNum}`),
  cancelBooking: (cargoId)       => api.patch(`/sender/cargo/${cargoId}/cancel`),
  getStations:   ()              => api.get('/stations'),
};
