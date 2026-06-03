import api from '../axiosConfig';

export const senderApi = {
  getStats:      ()              => api.get('/sender/stats'),
  getShipments:  ()              => api.get('/sender/shipments'),
  getIncoming:   ()              => api.get('/sender/incoming'),
  bookCargo:     (data)          => api.post('/sender/cargo/book', data),
  trackCargo:    (trackingNum)   => api.get(`/sender/cargo/track/${trackingNum}`),
  shareQrCode:   (trackingNum, email) => api.post(`/sender/cargo/track/${trackingNum}/share`, { email }),
  cancelBooking: (cargoId)       => api.patch(`/sender/cargo/${cargoId}/cancel`),
  getStations:   ()              => api.get('/stations'),
};
