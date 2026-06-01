import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, Train,
  DollarSign, BarChart3, LogOut, Train as TrainIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const NAV_ITEMS = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'        },
  { to: '/admin/stations',   icon: Building2,        label: 'Manage Stations'  },
  { to: '/admin/masters',    icon: Users,            label: 'Station Masters'  },
  { to: '/admin/trains',     icon: Train,            label: 'Trains & Schedules'},
  { to: '/admin/costs',      icon: DollarSign,       label: 'Cost Config'      },
  { to: '/admin/reports',    icon: BarChart3,        label: 'System Reports'   },
];

export default function Sidebar() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-[#1e3a6e] flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800">
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <TrainIcon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-none">RailPost</p>
          <p className="text-blue-300 text-xs mt-0.5">Sri Lanka Railways</p>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-6 py-3 border-b border-blue-800">
        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-medium">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                     font-medium text-blue-200 hover:bg-red-600 hover:text-white
                     transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
