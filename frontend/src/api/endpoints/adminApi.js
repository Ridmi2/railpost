import api from '../axiosConfig';

export const adminApi = {
  // Dashboard
  getDashboard:          ()              => api.get('/admin/dashboard'),

  // Stations
  getStations:           ()              => api.get('/admin/stations'),
  createStation:         (data)          => api.post('/admin/stations', data),
  toggleStation:         (id)            => api.patch(`/admin/stations/${id}/toggle`),

  // Station Masters
  getStationMasters:     ()              => api.get('/admin/station-masters'),
  createStationMaster:   (data)          => api.post('/admin/station-masters', data),
  toggleStationMaster:   (id)            => api.patch(`/admin/station-masters/${id}/toggle`),
  reassignStation:       (id, stationId) => api.patch(`/admin/station-masters/${id}/reassign?stationId=${stationId}`),
};
