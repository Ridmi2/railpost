import { useEffect, useState } from 'react';
import { adminApi } from '../../api/endpoints/adminApi';
import { Search, Plus, X, Train, Clock, Calendar, MapPin, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { railwayLines } from '../../data/railwayLines';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminTrains() {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    line: '',
    trainType: 'NORMAL',
    sourceStationId: '',
    destinationStationId: '',
    trips: [{ tripName: 'Trip 1', departureTime: '', arrivalTime: '', direction: 'OUTBOUND', stationTimes: {} }],
    runsOn: [],
    stopStations: []
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trainsRes, stationsRes] = await Promise.all([
        adminApi.getTrains(),
        adminApi.getStations()
      ]);
      setTrains(trainsRes.data.data || []);
      setStations((stationsRes.data.data || []).filter(s => s.status === 'ACTIVE'));
    } catch {
      toast.error('Failed to load trains or stations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminApi.toggleTrain(id);
      toast.success('Train status updated');
      setTrains(prev =>
        prev.map(t => t.id === id ? { ...t, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : t)
      );
    } catch {
      toast.error('Failed to update train status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'line') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        sourceStationId: '',
        destinationStationId: '',
        stopStations: []
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTripChange = (index, field, value) => {
    setFormData(prev => {
      const newTrips = [...prev.trips];
      newTrips[index] = { ...newTrips[index], [field]: value };
      return { ...prev, trips: newTrips };
    });
  };

  const handleAddTrip = () => {
    setFormData(prev => {
      const currentCount = prev.trips.length;
      // Default to alternating direction
      const lastDirection = prev.trips[currentCount - 1]?.direction || 'OUTBOUND';
      const nextDirection = lastDirection === 'OUTBOUND' ? 'RETURN' : 'OUTBOUND';
      
      return {
        ...prev,
        trips: [
          ...prev.trips,
          { 
            tripName: `Trip ${currentCount + 1}`, 
            departureTime: '', 
            arrivalTime: '', 
            direction: nextDirection,
            stationTimes: {}
          }
        ]
      };
    });
  };

  const handleStationTimeChange = (tripIndex, stationId, time) => {
    setFormData(prev => {
      const newTrips = [...prev.trips];
      const trip = { ...newTrips[tripIndex] };
      trip.stationTimes = { ...(trip.stationTimes || {}), [stationId]: time };
      newTrips[tripIndex] = trip;
      return { ...prev, trips: newTrips };
    });
  };

  const handleRemoveTrip = (index) => {
    setFormData(prev => {
      const newTrips = prev.trips.filter((_, i) => i !== index);
      // Renumber trips
      const renumberedTrips = newTrips.map((t, i) => ({ ...t, tripName: `Trip ${i + 1}` }));
      return { ...prev, trips: renumberedTrips };
    });
  };

  const handleStopStationToggle = (stationId) => {
    setFormData(prev => {
      const current = prev.stopStations || [];
      if (current.includes(stationId)) {
        return { ...prev, stopStations: current.filter(id => id !== stationId) };
      } else {
        return { ...prev, stopStations: [...current, stationId] };
      }
    });
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const current = prev.runsOn;
      if (current.includes(day)) {
        return { ...prev, runsOn: current.filter(d => d !== day) };
      } else {
        return { ...prev, runsOn: [...current, day] };
      }
    });
  };

  const handleSelectAllDays = () => {
    setFormData(prev => {
      if (prev.runsOn.length === DAYS_OF_WEEK.length) {
        return { ...prev, runsOn: [] };
      } else {
        return { ...prev, runsOn: [...DAYS_OF_WEEK] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) return toast.error('Train name is required');
    if (!formData.line) return toast.error('Line is required');
    if (!formData.sourceStationId) return toast.error('Source station is required');
    if (!formData.destinationStationId) return toast.error('Destination station is required');
    if (formData.sourceStationId === formData.destinationStationId) {
      return toast.error('Source and Destination stations cannot be the same');
    }
    
    // Validate trips
    if (formData.trips.length === 0) return toast.error('At least one trip is required');
    for (let i = 0; i < formData.trips.length; i++) {
      const t = formData.trips[i];
      if (!t.departureTime || !t.arrivalTime) {
        return toast.error(`Departure and Arrival times are required for ${t.tripName}`);
      }
    }

    if (formData.runsOn.length === 0) return toast.error('Please select at least one operating day');

    if (step === 1 && formData.stopStations.length > 0) {
      setStep(2);
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminApi.createTrain(formData);
      toast.success(res.data.message || 'Train registered successfully');
      setShowModal(false);
      setStep(1);
      setFormData({
        name: '',
        line: '',
        trainType: 'NORMAL',
        sourceStationId: '',
        destinationStationId: '',
        trips: [{ tripName: 'Trip 1', departureTime: '', arrivalTime: '', direction: 'OUTBOUND', stationTimes: {} }],
        runsOn: [],
        stopStations: []
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register train');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTrains = trains.filter(train => {
    const matchesSearch =
      (train.trainNo && train.trainNo.toLowerCase().includes(search.toLowerCase())) ||
      (train.name && train.name.toLowerCase().includes(search.toLowerCase())) ||
      (train.sourceStationName && train.sourceStationName.toLowerCase().includes(search.toLowerCase())) ||
      (train.destinationStationName && train.destinationStationName.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter = statusFilter === 'ALL' || train.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const filteredStations = formData.line 
    ? stations.filter(s => s.line === formData.line)
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trains & Schedules</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage schedules, routes, and active cargo trains</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
            title="Refresh list"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus size={18} />
            Register Train
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search trains by train number, name, station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="ALL">All Trains</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Trains list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="h-5 bg-gray-100 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredTrains.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <Train size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-900">No trains registered</h3>
          <p className="text-gray-500 text-sm mt-1">Register a cargo train and schedule to assign shipments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTrains.map(train => (
            <div key={train.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                {/* Title & Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        #{train.trainNo}
                      </span>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                        {train.trainType === 'EXPRESS' ? 'Express/Mail' : 'Normal'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-1.5 text-base">{train.name}</h3>
                    {train.line && <p className="text-xs text-gray-500">{train.line}</p>}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    train.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {train.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Route stations */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Departure</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin size={12} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-800 line-clamp-1">{train.sourceStationName}</span>
                    </div>
                  </div>
                  <div className="text-gray-300 font-medium">➔</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Arrival</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin size={12} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-800 line-clamp-1">{train.destinationStationName}</span>
                    </div>
                  </div>
                </div>

                {/* Timing info - Grouped by Direction */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 bg-gray-50/75 p-3 rounded-lg border border-gray-100">
                  {/* Outbound Column */}
                  <div>
                    <div className="pb-1 border-b border-gray-200 mb-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide truncate" title={`${train.sourceStationName} ➔ ${train.destinationStationName}`}>
                        {train.sourceStationName} ➔ {train.destinationStationName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {train.trips?.filter(t => t.direction === 'OUTBOUND').length > 0 ? (
                        train.trips.filter(t => t.direction === 'OUTBOUND').map((trip, idx) => (
                          <div key={idx} className="bg-white p-1.5 rounded border border-gray-100 shadow-sm flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 w-10">{trip.tripName}</span>
                            <div className="flex flex-col text-right">
                              <span className="text-xs font-bold text-blue-600">{trip.departureTime}</span>
                              <span className="text-xs font-bold text-blue-800">{trip.arrivalTime}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No outbound trips</p>
                      )}
                    </div>
                  </div>

                  {/* Return Column */}
                  <div>
                    <div className="pb-1 border-b border-gray-200 mb-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide truncate" title={`${train.destinationStationName} ➔ ${train.sourceStationName}`}>
                        {train.destinationStationName} ➔ {train.sourceStationName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {train.trips?.filter(t => t.direction === 'RETURN').length > 0 ? (
                        train.trips.filter(t => t.direction === 'RETURN').map((trip, idx) => (
                          <div key={idx} className="bg-white p-1.5 rounded border border-gray-100 shadow-sm flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 w-10">{trip.tripName}</span>
                            <div className="flex flex-col text-right">
                              <span className="text-xs font-bold text-orange-600">{trip.departureTime}</span>
                              <span className="text-xs font-bold text-orange-800">{trip.arrivalTime}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No return trips</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Days of operation */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Calendar size={12} />
                    Operating Days
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {DAYS_OF_WEEK.map(d => {
                      const runs = train.runsOn.includes(d);
                      return (
                        <span
                          key={d}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            runs
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-gray-100 text-gray-400 border border-gray-100'
                          }`}
                        >
                          {d.slice(0, 3)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status Action */}
              <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-end">
                <button
                  onClick={() => handleToggleStatus(train.id, train.status)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    train.status === 'ACTIVE'
                      ? 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200'
                      : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                  }`}
                >
                  {train.status === 'ACTIVE' ? 'Suspend Train' : 'Resume Train'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Train Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Train className="text-blue-600" size={20} />
                Register Cargo Train & Schedule
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Line *
                  </label>
                  <select
                    name="line"
                    required
                    value={formData.line}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="">Select Line</option>
                    {Object.keys(railwayLines).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Train Type *
                  </label>
                  <select
                    name="trainType"
                    required
                    value={formData.trainType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="NORMAL">Normal Train</option>
                    <option value="EXPRESS">Express / Intercity / Mail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Train Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Udarata Menike"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Source Station *
                  </label>
                  <select
                    name="sourceStationId"
                    required
                    value={formData.sourceStationId}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="">Select Origin Station</option>
                    {filteredStations.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Destination Station *
                  </label>
                  <select
                    name="destinationStationId"
                    required
                    value={formData.destinationStationId}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="">Select Destination Station</option>
                    {filteredStations.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Trips Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Train Trips / Schedule
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTrip}
                    className="text-xs flex items-center gap-1 bg-white border border-gray-200 hover:bg-gray-100 text-blue-600 px-2 py-1 rounded shadow-sm font-semibold transition-all"
                  >
                    <Plus size={14} /> Add Trip
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.trips.map((trip, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 relative shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {trip.tripName}
                        </span>
                        {formData.trips.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTrip(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all"
                            title="Remove Trip"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr] gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Direction</label>
                          <select
                            value={trip.direction}
                            onChange={(e) => handleTripChange(idx, 'direction', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="OUTBOUND">Outbound ➔</option>
                            <option value="RETURN">Return ➔</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Departure *</label>
                          <input
                            type="time"
                            required
                            value={trip.departureTime}
                            onChange={(e) => handleTripChange(idx, 'departureTime', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Arrival *</label>
                          <input
                            type="time"
                            required
                            value={trip.arrivalTime}
                            onChange={(e) => handleTripChange(idx, 'arrivalTime', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.line && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Stop Stations (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                    {filteredStations.map(s => {
                      const isSelected = formData.stopStations.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleStopStationToggle(s.id)}
                          className={`px-2 py-1.5 rounded text-xs text-left border transition-all truncate ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700 border-blue-300 font-bold'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                          title={s.name}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Operating Days *
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllDays}
                    className="text-[10px] text-blue-600 hover:text-blue-700 font-bold transition-all"
                  >
                    {formData.runsOn.length === DAYS_OF_WEEK.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = formData.runsOn.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm border border-blue-100">
                    <p className="font-bold mb-1">Set Stop Station Arrival Times</p>
                    <p className="text-xs">For each trip, set the arrival time for the intermediate stop stations you selected.</p>
                  </div>
                  {formData.trips.map((trip, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-sm text-blue-700 mb-3">{trip.tripName} ({trip.direction === 'OUTBOUND' ? 'Outbound ➔' : 'Return ➔'})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {formData.stopStations.map(stationId => {
                          const station = stations.find(s => s.id === stationId);
                          return (
                            <div key={stationId}>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 truncate" title={station?.name}>{station?.name}</label>
                              <input
                                type="time"
                                required
                                value={trip.stationTimes?.[stationId] || ''}
                                onChange={(e) => handleStationTimeChange(idx, stationId, e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer mr-auto"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setStep(1); }}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || stations.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <RefreshCw size={14} className="animate-spin" />}
                  {step === 1 && formData.stopStations.length > 0 ? 'Next Step ➔' : 'Register Train'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
