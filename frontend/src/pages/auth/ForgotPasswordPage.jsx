import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Mail, ArrowLeft, Send } from 'lucide-react';
import { authApi } from '../../api/endpoints/authApi';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data);
      setSuccess(true);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e3a6e] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to login
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <Mail className="text-blue-600" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter your registered email address and we will send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-sm">
            We have sent a password reset link to your email. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder:text-gray-300 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

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
                  Sending link...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
