import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Search, LogOut, Eye } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ReviewerLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive 
        ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-500/20' 
        : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`;

  return (
    <div className="flex h-screen bg-slate-50/50">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
        <div className="p-6 pb-2 border-b border-gray-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
              <Eye className="text-white" size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg leading-none">RailPost</p>
              <p className="text-indigo-600 text-xs font-semibold tracking-wide">REVIEWER PORTAL</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <NavLink to="/reviewer/dashboard" className={navClass}>
            <Search size={20} />
            Track Shared Cargo
          </NavLink>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              {user?.fullName?.charAt(0) || 'R'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 truncate">Auditor / Reviewer</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
        <div className="h-16 bg-white border-b border-gray-100 flex items-center px-8 shadow-sm z-0">
          <h2 className="font-semibold text-gray-800">Reviewer Workspace</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
