import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle,
  Users, BarChart3, LogOut, Train, Bell, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const NAV = [
  { to: '/station-master/dashboard', icon: LayoutDashboard, label: 'Dashboard'         },
  { to: '/station-master/cargo',     icon: Package,         label: 'Station Cargo'      },
  { to: '/station-master/register',  icon: PlusCircle,      label: 'Register Cargo'     },
  { to: '/station-master/officers',  icon: Users,           label: 'Manage Officers'    },
  { to: '/station-master/reports',   icon: BarChart3,       label: 'Station Reports'    },
];

export default function StationMasterLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 min-h-screen bg-[#1e3a6e] flex flex-col">

        <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
            <Train size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">RailPost</p>
            <p className="text-blue-300 text-xs mt-0.5">Sri Lanka Railways</p>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-blue-800">
          <span className="text-xs bg-violet-500 text-white px-2 py-0.5 rounded font-medium">
            STATION MASTER
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 transition-colors ${isActive
                   ? 'bg-blue-600 text-white'
                   : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-blue-800">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                       text-blue-200 hover:bg-red-600 hover:text-white transition-colors w-full">
            <LogOut size={18} />Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3.5
                           flex items-center justify-between sticky top-0 z-10">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            Station Master Portal
          </p>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                <User size={15} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800 leading-none">{user?.fullName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
