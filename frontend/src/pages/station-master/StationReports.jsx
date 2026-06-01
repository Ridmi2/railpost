import { useState, useEffect } from 'react';
import { stationMasterApi } from '../../api/endpoints/stationMasterApi';
import { Loader2, Package, TrendingUp, Weight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StationReports() {
  const [cargo, setCargo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stationMasterApi.getStationCargo()
      .then(res => setCargo(res.data.data))
      .catch(() => toast.error('Failed to load cargo data for reports'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  const totalRevenue = cargo.reduce((sum, c) => sum + (c.totalCost || 0), 0);
  const totalWeight = cargo.reduce((sum, c) => sum + (c.weight || 0), 0);

  const statusCount = cargo.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Station Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of all cargo handled by your station</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Shipments</p>
            <p className="text-2xl font-bold text-gray-900">{cargo.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">LKR {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Weight size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Weight</p>
            <p className="text-2xl font-bold text-gray-900">{totalWeight.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shipments by Status</h2>
        {Object.keys(statusCount).length === 0 ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center">
            <AlertCircle className="mb-2 text-gray-400" size={32} />
            <p>No shipments recorded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(statusCount).map(([status, count]) => (
              <div key={status} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{status.replace(/_/g, ' ')}</span>
                <span className="text-lg font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
