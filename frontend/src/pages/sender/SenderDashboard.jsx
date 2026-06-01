import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, PlusCircle, Search, RefreshCw } from 'lucide-react';
import { senderApi } from '../../api/endpoints/senderApi';
import toast from 'react-hot-toast';

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  PENDING_DROP_OFF: 'bg-amber-100 text-amber-700',
  BOOKED:           'bg-blue-100 text-blue-700',
  DISPATCHED:       'bg-violet-100 text-violet-700',
  IN_TRANSIT:       'bg-cyan-100 text-cyan-700',
  ARRIVED:          'bg-indigo-100 text-indigo-700',
  DELIVERED:        'bg-green-100 text-green-700',
  CANCELLED:        'bg-red-100 text-red-700',
  EXPIRED:          'bg-gray-100 text-gray-600',
};

export default function SenderDashboard() {
  const [stats, setStats]         = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, shipmentsRes] = await Promise.all([
        senderApi.getStats(),
        senderApi.getShipments(),
      ]);
      setStats(statsRes.data.data);
      setShipments(shipmentsRes.data.data?.slice(0, 5) || []);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and manage your cargo shipments</p>
        </div>
        <button onClick={fetchData}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600
                     border border-gray-200 rounded-lg px-3 py-2 bg-white transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Shipments"  value={stats?.totalShipments} icon={Package}
                  color="bg-blue-600" sub="All time" />
        <StatCard label="Pending Drop-Off" value={stats?.pendingDropOff} icon={Clock}
                  color="bg-amber-500" sub="Bring to station" />
        <StatCard label="In Transit"       value={stats?.inTransit}      icon={Truck}
                  color="bg-violet-500" sub="On the way" />
        <StatCard label="Delivered"        value={stats?.delivered}      icon={CheckCircle}
                  color="bg-emerald-500" sub="Successfully delivered" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Link to="/sender/book"
          className="flex items-center gap-4 p-5 bg-blue-600 hover:bg-blue-700
                     rounded-xl text-white transition-colors shadow-md">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <PlusCircle size={24} />
          </div>
          <div>
            <p className="font-semibold">Book New Cargo</p>
            <p className="text-blue-200 text-sm">Register a new shipment</p>
          </div>
        </Link>
        <Link to="/sender/track"
          className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50
                     rounded-xl border border-gray-200 transition-colors">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
            <Search size={24} className="text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Track Shipment</p>
            <p className="text-gray-500 text-sm">Check cargo status</p>
          </div>
        </Link>
        <Link to="/sender/shipments"
          className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50
                     rounded-xl border border-gray-200 transition-colors">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Package size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">My Shipments</p>
            <p className="text-gray-500 text-sm">View all your cargo</p>
          </div>
        </Link>
      </div>

      {/* Recent shipments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Shipments</h2>
          <Link to="/sender/shipments" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : shipments.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No shipments yet</p>
            <p className="text-gray-400 text-sm mt-1">Book your first cargo shipment</p>
            <Link to="/sender/book"
              className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white
                         px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              <PlusCircle size={16} />Book Cargo
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Tracking #','Receiver','Destination','Status','Booked'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-blue-600">
                      {s.trackingNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{s.receiverName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{s.destinationStationName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                                       ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {s.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
