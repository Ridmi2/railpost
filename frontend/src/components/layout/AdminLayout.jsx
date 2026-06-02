import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthStore from '../../store/authStore';
import { Bell, User } from 'lucide-react';

export default function AdminLayout() {
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5
                           flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              Admin Portal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500
                               text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <Link to="/admin/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={15} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-none">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
