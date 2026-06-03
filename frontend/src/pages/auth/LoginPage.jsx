import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Lock, Mail, Train } from 'lucide-react';
import { authApi } from '../../api/endpoints/authApi';
import useAuthStore from '../../store/authStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const ROLE_REDIRECT = {
  ADMIN:           '/admin/dashboard',
  STATION_MASTER:  '/station-master/dashboard',
  STATION_OFFICER: '/officer/dashboard',
  SENDER:          '/sender/dashboard',
  REVIEWER:        '/track',
};

export default function LoginPage() {
  const navigate    = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { token, ...user } = res.data.data;
      setAuth(user, token);
      toast.success(`Welcome, ${user.fullName}!`);
      navigate(ROLE_REDIRECT[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e3a6e] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8 relative">
          <Link to="/" className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-sm font-medium">Home</span>
          </Link>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 border-4 border-blue-300">
            <Train className="text-blue-700" size={36} />
          </div>
          <h1 className="text-3xl font-bold text-white">RailPost</h1>
          <p className="text-blue-200 text-sm mt-1 font-medium">Sri Lanka Railway Cargo Service</p>
          <p className="text-blue-300 text-xs mt-0.5">Cargo Logistics Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-3">
              <Lock className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Authorized Access Only</h2>
            <p className="text-gray-400 text-sm">Sign in to continue to RailPost</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your username or email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder:text-gray-300 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder:text-gray-300 transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                         text-white font-semibold py-3 rounded-lg transition-colors
                         flex items-center justify-center gap-2 text-sm shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-blue-300 text-xs">
            © 2026 Sri Lanka Railways — Department of Railways
          </p>
          <p className="text-blue-400 text-xs">
            Government of Sri Lanka &nbsp;|&nbsp; RailPost Cargo System v1.0
          </p>
        </div>

      </div>
    </div>
  );
}