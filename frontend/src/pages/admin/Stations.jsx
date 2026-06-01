import { useEffect, useState } from 'react';
import { adminApi } from '../../api/endpoints/adminApi';
import { Search, Plus, X, Building2, MapPin, Phone, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    city: '',
    province: '',
    address: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStations();
      setStations(res.data.data || []);
    } catch {
      toast.error('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminApi.toggleStation(id);
      toast.success(`Station status updated successfully`);
      // Update local state directly for responsive feedback
      setStations(prev =>
        prev.map(s => s.id === id ? { ...s, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s)
      );
    } catch {
      toast.error('Failed to update station status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase().trim() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!/^[A-Z0-9]{2,8}$/.test(formData.code)) {
      toast.error('Station code must be 2 to 8 uppercase alphanumeric characters');
      return;
    }
    if (!formData.name.trim()) return toast.error('Station name is required');
    if (!formData.city.trim()) return toast.error('City is required');
    if (!formData.province.trim()) return toast.error('Province is required');

    setSubmitting(true);
    try {
      const res = await adminApi.createStation(formData);
      toast.success(res.data.message || 'Station registered successfully');
      setShowModal(false);
      setFormData({ code: '', name: '', city: '', province: '', address: '', phone: '' });
      fetchStations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create station');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = 
      station.code.toLowerCase().includes(search.toLowerCase()) ||
      station.name.toLowerCase().includes(search.toLowerCase()) ||
      station.city.toLowerCase().includes(search.toLowerCase()) ||
      station.province.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = statusFilter === 'ALL' || station.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Stations</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configure Sri Lanka Railways station nodes</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchStations}
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
            Add Station
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search stations by code, name, city, province..."
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
            <option value="ALL">All Stations</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Stations List/Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse py-2.5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div>
                    <div className="h-4 bg-gray-100 rounded w-28 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-20" />
                  </div>
                </div>
                <div className="h-8 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-900">No stations found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria or add a new station node.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Station Code</th>
                  <th className="px-6 py-4">Station Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredStations.map(station => (
                  <tr key={station.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-blue-600 tracking-wider">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs">
                        {station.code}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="font-semibold text-gray-900">{station.name}</div>
                      {station.address && <div className="text-xs text-gray-400 mt-0.5">{station.address}</div>}
                    </td>
                    <td className="px-6 py-4.5 text-gray-600">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{station.city}</span>
                      </div>
                      <div className="text-xs text-gray-400 ml-5 mt-0.5">{station.province} Province</div>
                    </td>
                    <td className="px-6 py-4.5 text-gray-600">
                      {station.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-gray-400" />
                          <span>{station.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        station.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          station.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                        {station.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleToggleStatus(station.id, station.status)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          station.status === 'ACTIVE'
                            ? 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200'
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                        }`}
                      >
                        {station.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Station Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="text-blue-600" size={20} />
                Register New Station
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Station Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    maxLength={8}
                    required
                    placeholder="e.g. FOT"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">2-8 letters uppercase.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Station Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Colombo Fort"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Colombo 01"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Province *
                  </label>
                  <select
                    name="province"
                    required
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="">Select Province</option>
                    {['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Olcott Mawatha, Colombo"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +94112421281"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw size={14} className="animate-spin" />}
                  Register Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
