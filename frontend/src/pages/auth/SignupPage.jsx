import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Train, User, Mail, Phone, CreditCard, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/endpoints/authApi';

// ── NIC validation ─────────────────────────────────────────────────────────
// Old NIC: 9 digits + V or X  e.g. 123456789V
// New NIC: exactly 12 digits  e.g. 200012345678
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;

const schema = z.object({
  fullName: z.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters and spaces'),

  email: z.string()
    .email('Enter a valid email address'),

  phone: z.string()
    .regex(/^0[0-9]{9}$/, 'Phone must be a valid 10-digit Sri Lanka number starting with 0'),

  nic: z.string()
    .regex(nicRegex, 'Enter a valid NIC — 9 digits + V/X (old) or 12 digits (new)'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),

  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ── Field component ─────────────────────────────────────────────────────────
function Field({ label, error, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        )}
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading]       = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.register({
        fullName:        data.fullName,
        email:           data.email,
        phone:           data.phone,
        nic:             data.nic.toUpperCase(),
        password:        data.password,
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasIcon = true) =>
    `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-200 rounded-lg
     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
     placeholder:text-gray-300 transition-all`;

  return (
    <div className="min-h-screen bg-[#1e3a6e] flex items-center justify-center p-4 py-10 sm:p-8">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center
                            border-4 border-blue-300 shadow-lg">
              <Train className="text-blue-700" size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">RailPost</p>
              <p className="text-blue-200 text-xs">Sri Lanka Railway Cargo Service</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Sender Account</h2>
            <p className="text-gray-400 text-sm mt-1">
              Register to book and track cargo shipments
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">

            {/* Full Name */}
            <Field label="Full Name" error={errors.fullName?.message} icon={User}>
              <input
                {...register('fullName')}
                placeholder="Enter your full name"
                className={inputClass()}
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" error={errors.email?.message} icon={Mail}>
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                autoComplete="new-password"
                className={inputClass()}
              />
            </Field>

            {/* Phone */}
            <Field label="Phone Number" error={errors.phone?.message} icon={Phone}>
              <input
                {...register('phone')}
                placeholder="07XXXXXXXX"
                maxLength={10}
                className={inputClass()}
              />
            </Field>

            {/* NIC */}
            <Field label="NIC Number" error={errors.nic?.message} icon={CreditCard}>
              <input
                {...register('nic')}
                placeholder="Old: 123456789V  |  New: 200012345678"
                className={inputClass()}
              />
              <p className="text-xs text-gray-400 mt-1">
                Old NIC: 9 digits + V or X &nbsp;|&nbsp; New NIC: 12 digits
              </p>
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password?.message} icon={Lock}>
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
                className={`${inputClass()} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password" error={errors.confirmPassword?.message} icon={Lock}>
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={`${inputClass()} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </Field>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center">
              By registering you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                         text-white font-semibold py-3 rounded-lg transition-colors
                         flex items-center justify-center gap-2 text-sm shadow-md"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Creating account...</>
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-blue-400 text-xs mt-4">
          © 2026 Sri Lanka Railways — Government of Sri Lanka
        </p>
      </div>
    </div>
  );
}
