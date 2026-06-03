import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, X, Users, Phone, Mail, CreditCard,
  Lock, RefreshCw, Search, Loader2, Eye, EyeOff,
  ToggleLeft, ToggleRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { stationMasterApi } from '../../api/endpoints/stationMasterApi';

const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
const schema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email:    z.string().regex(/^[a-zA-Z0-9]([a-zA-Z0-9.]{4,28})[a-zA-Z0-9]@gmail\.com$/,
                             'Must be a valid Gmail address'),
  phone:    z.string().regex(/^0[0-9]{9}$/, 'Must be 10 digits starting with 0'),
  nic:      z.string().regex(nicRegex, 'Invalid NIC — 9 digits + V/X or 12 digits'),
  password: z.string().min(8, 'At least 8 characters')
              .regex(/[A-Z]/, 'Must have uppercase')
              .regex(/[0-9]/, 'Must have number')
              .regex(/[!@#$%^&*]/, 'Must have special character'),
});

function Field({ label, error, icon: Icon, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />}
        {children}
      </div>
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const iCls = () =>
  'w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 transition-all';

export default function ManageOfficers() {
  const [officers,  setOfficers]  = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [toggling,  setToggling]  = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const res = await stationMasterApi.getOfficers();
      setOfficers(res.data.data || []);
    } catch {
      toast.error('Failed to load officers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOfficers(); }, []);

  useEffect(() => {
    if (!search) { setFiltered(officers); return; }
    setFiltered(officers.filter(o =>
      o.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    ));
  }, [officers, search]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await stationMasterApi.createOfficer(data);
      toast.success('Officer account created');
      setShowModal(false);
      reset();
      fetchOfficers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create officer');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id) => {
    setToggling(id);
    try {
      await stationMasterApi.toggleOfficer(id);
      toast.success('Status updated');
      fetchOfficers();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Officers</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Station officers assigned to your station
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchOfficers}
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200
                       rounded-lg px-3 py-2 bg-white hover:text-blue-600 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh
          </button>
          <button onClick={() => { reset(); setShowModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Plus size={16} />Add Officer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Officers', value: officers.length,
            color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Active',
            value: officers.filter(o => o.status === 'ACTIVE').length,
            color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Suspended',
            value: officers.filter(o => o.status === 'SUSPENDED').length,
            color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 border ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-75">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Search by name or email..."
                 className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Users size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No officers found</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add Officer" to create one
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Name & Contact','NIC','Status','Created','Actions'].map(h => (
                    <th key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold
                                 text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-cyan-100 rounded-full flex items-center
                                        justify-center flex-shrink-0">
                          <span className="text-cyan-700 font-semibold text-sm">
                            {o.fullName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{o.fullName}</p>
                          <p className="text-xs text-gray-400">{o.email}</p>
                          <p className="text-xs text-gray-400">{o.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono text-gray-600">{o.nic}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                        ${o.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleStatus(o.id)}
                        disabled={toggling === o.id}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                                    rounded-lg transition-colors disabled:opacity-50
                                    ${o.status === 'ACTIVE'
                                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                      : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                        {toggling === o.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : o.status === 'ACTIVE'
                            ? <><ToggleRight size={14} />Suspend</>
                            : <><ToggleLeft size={14} />Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md
                          max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add Station Officer</h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  Create officer account for your station
                </p>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" autoComplete="off">
              <Field label="Full Name" error={errors.fullName?.message} icon={Users}>
                <input {...register('fullName')} placeholder="Officer full name"
                       className={iCls()} />
              </Field>
              <Field label="Email" error={errors.email?.message} icon={Mail}>
                <input {...register('email')} type="email"
                       placeholder="officer@gmail.com" autoComplete="new-password" className={iCls()} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone" error={errors.phone?.message} icon={Phone}>
                  <input {...register('phone')} placeholder="07XXXXXXXX"
                         maxLength={10} className={iCls()} />
                </Field>
                <Field label="NIC" error={errors.nic?.message} icon={CreditCard}>
                  <input {...register('nic')} placeholder="NIC"
                         className={iCls()} />
                </Field>
              </div>
              <Field label="Password" error={errors.password?.message} icon={Lock}
                     hint="8+ chars, uppercase, number, special character">
                <input {...register('password')}
                       type={showPass ? 'text' : 'password'}
                       placeholder="Set password"
                       autoComplete="new-password"
                       className={`${iCls()} pr-10`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50
                             font-medium py-2.5 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                             text-white font-semibold py-2.5 rounded-lg text-sm
                             flex items-center justify-center gap-2 transition-colors">
                  {saving
                    ? <><Loader2 size={15} className="animate-spin" />Creating...</>
                    : <><Plus size={15} />Create Officer</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
