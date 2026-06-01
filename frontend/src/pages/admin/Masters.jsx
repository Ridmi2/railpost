import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, X, UserCheck, Building2, Phone, Mail,
  CreditCard, Lock, RefreshCw, Search, Loader2,
  Eye, EyeOff, ToggleLeft, ToggleRight, MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/endpoints/adminApi';

// ── Validation ─────────────────────────────────────────────────────────────
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
const schema = z.object({
  fullName:  z.string().min(3, 'Name must be at least 3 characters'),
  email:     z.string().email('Invalid email address'),
  phone:     z.string().regex(/^0[0-9]{9}$/, 'Must be 10 digits starting with 0'),
  nic:       z.string().regex(nicRegex, 'Invalid NIC — 9 digits + V/X or 12 digits'),
  stationId: z.string().min(1, 'Please select a station'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
});

// ── Field component ────────────────────────────────────────────────────────
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

const inputCls = (icon = true) =>
  `w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
   focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 transition-all`;

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    ACTIVE:    'bg-green-100 text-green-700',
    SUSPENDED: 'bg-red-100 text-red-700',
    INACTIVE:  'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || styles.INACTIVE}`}>
      {status}
    </span>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Masters() {
  const [masters,    setMasters]    = useState([]);
  const [stations,   setStations]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [toggling,   setToggling]   = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mastersRes, stationsRes] = await Promise.all([
        adminApi.getStationMasters(),
        adminApi.getStations(),
      ]);
      setMasters(mastersRes.data.data || []);
      setStations(stationsRes.data.data?.filter(s => s.status === 'ACTIVE') || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (!search) { setFiltered(masters); return; }
    setFiltered(masters.filter(m =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.stationName?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [masters, search]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await adminApi.createStationMaster(data);
      toast.success('Station Master created successfully');
      setShowModal(false);
      reset();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create station master');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id) => {
    setToggling(id);
    try {
      await adminApi.toggleStationMaster(id);
      toast.success('Status updated');
      fetchAll();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Station Masters</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage station master accounts and assignments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll}
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200
                       rounded-lg px-3 py-2 bg-white hover:text-blue-600 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button onClick={() => { reset(); setShowModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Plus size={16} />
            Add Station Master
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Masters', value: masters.length,
            color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
          { label: 'Active',
            value: masters.filter(m => m.status === 'ACTIVE').length,
            color: 'bg-green-50 border-green-200', text: 'text-green-700' },
          { label: 'Suspended',
            value: masters.filter(m => m.status === 'SUSPENDED').length,
            color: 'bg-red-50 border-red-200', text: 'text-red-700' },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`rounded-xl p-4 border ${color}`}>
            <p className={`text-2xl font-bold ${text}`}>{value}</p>
            <p className={`text-sm ${text} opacity-75`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Search by name, email or station..."
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
            <UserCheck size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No station masters found</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add Station Master" to create one
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Name & Contact','NIC','Assigned Station','Status','Created','Actions'].map(h => (
                    <th key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center
                                        justify-center flex-shrink-0">
                          <span className="text-blue-700 font-semibold text-sm">
                            {m.fullName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.fullName}</p>
                          <p className="text-xs text-gray-400">{m.email}</p>
                          <p className="text-xs text-gray-400">{m.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono text-gray-600">{m.nic}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Building2 size={14} className="text-blue-500 flex-shrink-0" />
                        {m.stationName}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(m.id)}
                        disabled={toggling === m.id}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                                    rounded-lg transition-colors disabled:opacity-50
                                    ${m.status === 'ACTIVE'
                                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                      : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {toggling === m.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : m.status === 'ACTIVE' ? (
                          <><ToggleRight size={14} />Suspend</>
                        ) : (
                          <><ToggleLeft size={14} />Activate</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add Station Master</h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  Create a new station master account
                </p>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

              <Field label="Full Name" error={errors.fullName?.message} icon={UserCheck}>
                <input {...register('fullName')} placeholder="Full name"
                       className={inputCls()} />
              </Field>

              <Field label="Email Address" error={errors.email?.message} icon={Mail}>
                <input {...register('email')} type="email" placeholder="Email address"
                       className={inputCls()} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone" error={errors.phone?.message} icon={Phone}
                       hint="10 digits, starts with 0">
                  <input {...register('phone')} placeholder="07XXXXXXXX"
                         maxLength={10} className={inputCls()} />
                </Field>
                <Field label="NIC Number" error={errors.nic?.message} icon={CreditCard}
                       hint="Old or new format">
                  <input {...register('nic')} placeholder="NIC"
                         className={inputCls()} />
                </Field>
              </div>

              <Field label="Assign Station" error={errors.stationId?.message} icon={MapPin}>
                <select {...register('stationId')} className={`${inputCls()} bg-white`}>
                  <option value="">Select a station...</option>
                  {stations.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.city}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Password" error={errors.password?.message} icon={Lock}
                     hint="Minimum 8 characters">
                <input {...register('password')}
                       type={showPass ? 'text' : 'password'}
                       placeholder="Set a password"
                       className={`${inputCls()} pr-10`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50
                             font-medium py-2.5 rounded-lg transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                             text-white font-semibold py-2.5 rounded-lg transition-colors
                             flex items-center justify-center gap-2 text-sm">
                  {saving
                    ? <><Loader2 size={15} className="animate-spin" />Creating...</>
                    : <><Plus size={15} />Create Account</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
