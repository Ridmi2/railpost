import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock,
         Users, PlusCircle, RefreshCw, Building2 } from 'lucide-react';
import { stationMasterApi } from '../../api/endpoints/stationMasterApi';
import toast from 'react-hot-toast';

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100
                    flex items-start justify-between">
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

export default function StationMasterDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await stationMasterApi.getDashboard();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {stats?.stationName || 'Station'} Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {stats?.stationCode && (
              <span className="inline-flex items-center gap-1">
                <Building2 size={13} />
                Station Code: <strong>{stats.stationCode}</strong>
              </span>
            )}
          </p>
        </div>
        <button onClick={fetchStats}
          className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200
                     rounded-lg px-3 py-2 bg-white hover:text-blue-600 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard label="Registered Today" value={stats?.todayRegistered}
                    icon={Package} color="bg-blue-600" sub="Walk-in + online" />
          <StatCard label="Dispatched Today" value={stats?.todayDispatched}
                    icon={Truck} color="bg-violet-500" sub="Loaded on trains" />
          <StatCard label="Arrived at Station" value={stats?.totalArrived}
                    icon={Building2} color="bg-indigo-500" sub="Ready for delivery" />
          <StatCard label="Pending Delivery" value={stats?.pendingDelivery}
                    icon={Clock} color="bg-amber-500" sub="Awaiting pickup" />
          <StatCard label="Total Delivered" value={stats?.totalDelivered}
                    icon={CheckCircle} color="bg-emerald-500" sub="Successfully handed over" />
          <StatCard label="My Officers" value={stats?.totalOfficers}
                    icon={Users} color="bg-cyan-500" sub="Station officers" />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/station-master/register"
          className="flex items-center gap-4 p-5 bg-blue-600 hover:bg-blue-700
                     rounded-xl text-white transition-colors shadow-md">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <PlusCircle size={24} />
          </div>
          <div>
            <p className="font-semibold">Register Walk-in Cargo</p>
            <p className="text-blue-200 text-sm">New cargo from walk-in sender</p>
          </div>
        </Link>

        <Link to="/station-master/cargo"
          className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50
                     rounded-xl border border-gray-200 transition-colors">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
            <Package size={24} className="text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">View Station Cargo</p>
            <p className="text-gray-500 text-sm">All cargo at this station</p>
          </div>
        </Link>

        <Link to="/station-master/officers"
          className="flex items-center gap-4 p-5 bg-white hover:bg-gray-50
                     rounded-xl border border-gray-200 transition-colors">
          <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Users size={24} className="text-cyan-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Officers</p>
            <p className="text-gray-500 text-sm">Add or suspend officers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
