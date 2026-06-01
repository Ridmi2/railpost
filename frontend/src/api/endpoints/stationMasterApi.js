import api from '../axiosConfig';

export const stationMasterApi = {
  getDashboard:    ()      => api.get('/station-master/dashboard'),
  getStationCargo: ()      => api.get('/station-master/cargo'),
  registerWalkIn:  (data)  => api.post('/station-master/cargo/walk-in', data),
  getOfficers:     ()      => api.get('/station-master/officers'),
  createOfficer:   (data)  => api.post('/station-master/officers', data),
  toggleOfficer:   (id)    => api.patch(`/station-master/officers/${id}/toggle`),
  getStations:     ()      => api.get('/stations'),
};
