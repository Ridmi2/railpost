import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Lock, Loader2, Mail, CreditCard, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi } from '../../api/endpoints/userApi';
import useAuthStore from '../../store/authStore';

const profileSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().regex(/^0[0-9]{9}$/, 'Phone must be a valid 10-digit Sri Lanka number starting with 0')
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
});

function Field({ label, error, icon: Icon, children, disabled = false }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        )}
        <div className={disabled ? "opacity-60 cursor-not-allowed" : ""}>
          {children}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const { user: authUser, setAuth, token } = useAuthStore();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const { register: regProfile, handleSubmit: submitProfile, reset: resetProfile, formState: { errors: errProfile } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  const { register: regPass, handleSubmit: submitPass, reset: resetPass, formState: { errors: errPass } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const inputClass = (hasIcon = true, disabled = false) =>
    `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-200 rounded-lg
     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
     transition-all ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfileData(data);
        resetProfile({
          fullName: data.fullName,
          phone: data.phone
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [resetProfile]);

  const onUpdateProfile = async (data) => {
    setSavingProfile(true);
    try {
      const updated = await userApi.updateProfile(data);
      setProfileData(updated);
      setAuth({ ...authUser, fullName: updated.fullName }, token);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (data) => {
    setSavingPassword(true);
    try {
      await userApi.changePassword(data);
      toast.success('Password changed successfully');
      resetPass();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} className="text-blue-600" /> Personal Information
          </h2>
          
          <form onSubmit={submitProfile(onUpdateProfile)}>
            <Field label="Full Name" error={errProfile.fullName?.message} icon={User}>
              <input {...regProfile('fullName')} className={inputClass()} />
            </Field>

            <Field label="Phone Number" error={errProfile.phone?.message} icon={Phone}>
              <input {...regProfile('phone')} className={inputClass()} />
            </Field>

            <Field label="Email Address (Read-only)" icon={Mail} disabled>
              <input value={profileData?.email || ''} readOnly className={inputClass(true, true)} />
            </Field>

            <Field label="NIC (Read-only)" icon={CreditCard} disabled>
              <input value={profileData?.nic || ''} readOnly className={inputClass(true, true)} />
            </Field>

            <button
              type="submit"
              disabled={savingProfile}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg flex justify-center items-center gap-2 font-medium transition-colors"
            >
              {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-blue-600" /> Change Password
          </h2>
          
          <form onSubmit={submitPass(onChangePassword)}>
            <Field label="Current Password" error={errPass.currentPassword?.message} icon={Lock}>
              <input type="password" {...regPass('currentPassword')} className={inputClass()} placeholder="••••••••" />
            </Field>

            <Field label="New Password" error={errPass.newPassword?.message} icon={Lock}>
              <input type="password" {...regPass('newPassword')} className={inputClass()} placeholder="Min 8 chars, 1 uppercase, 1 number" />
            </Field>

            <button
              type="submit"
              disabled={savingPassword}
              className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg flex justify-center items-center gap-2 font-medium transition-colors"
            >
              {savingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
