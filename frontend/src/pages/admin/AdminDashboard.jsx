import { useEffect, useState } from 'react';
import {
  Building2, Users, UserCheck, UserCog,
  TrendingUp, Activity, RefreshCw
} from 'lucide-react';
import { adminApi } from '../../api/endpoints/adminApi';
import toast from 'react-hot-toast';

/* ── Stat card ────────────────────────────────────────────────── */
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

/* ── Activity dot ─────────────────────────────────────────────── */
const TYPE_COLORS = {
  station: 'bg-blue-500',
  user:    'bg-green-500',
  config:  'bg-amber-500',
};

function ActivityItem({ item }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${TYPE_COLORS[item.type] || 'bg-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">{item.message}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
      </div>
    </div>
  );
}

/* ── Main Dashboard ───────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDashboard();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            System overview — RailPost Cargo Management
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600
                     border border-gray-200 rounded-lg px-3 py-2 bg-white hover:border-blue-300
                     transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Stations"
            value={stats?.totalStations}
            icon={Building2}
            color="bg-blue-600"
            sub={`${stats?.activeStations} active`}
          />
          <StatCard
            label="Station Masters"
            value={stats?.totalStationMasters}
            icon={UserCheck}
            color="bg-emerald-500"
            sub="Managing operations"
          />
          <StatCard
            label="Station Officers"
            value={stats?.totalStationOfficers}
            icon={UserCog}
            color="bg-violet-500"
            sub="Frontline staff"
          />
          <StatCard
            label="Total Users"
            value={stats?.totalUsers}
            icon={Users}
            color="bg-amber-500"
            sub="All roles"
          />
        </div>
      )}

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Activity size={16} className="text-blue-600" />
              Recent System Activity
            </h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : stats?.recentActivity?.length ? (
            <div>
              {stats.recentActivity.map((item, i) => (
                <ActivityItem key={i} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">No recent activity</p>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Add New Station',       to: '/admin/stations',  color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'    },
              { label: 'Add Station Master',    to: '/admin/masters',   color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
              { label: 'Configure Cost Rules',  to: '/admin/costs',     color: 'bg-amber-50 text-amber-700 hover:bg-amber-100'  },
              { label: 'View System Reports',   to: '/admin/reports',   color: 'bg-violet-50 text-violet-700 hover:bg-violet-100'},
            ].map(({ label, to, color }) => (
              <a
                key={to}
                href={to}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${color}`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
