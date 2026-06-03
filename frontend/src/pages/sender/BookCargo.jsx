import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Package, User, Phone, Mail, CreditCard,
         MapPin, FileText, DollarSign, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { senderApi } from '../../api/endpoints/senderApi';
import ReceiptModal from '../../components/ui/ReceiptModal';

const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;

const schema = z.object({
  receiverName:        z.string().min(3, 'Receiver name must be at least 3 characters'),
  receiverNic:         z.string().regex(nicRegex, 'Invalid NIC — 9 digits + V/X or 12 digits'),
  receiverEmail:       z.string().email('Invalid receiver email'),
  receiverPhone:       z.string().regex(/^0[0-9]{9}$/, 'Must be 10 digits starting with 0'),
  originStationId:     z.string().min(1, 'Please select an origin station'),
  destinationStationId: z.string().min(1, 'Please select a destination station'),
  category:            z.string().min(1, 'Please select a cargo category'),
  declaredValue:       z.string().min(1, 'Declared value is required')
                         .refine(v => !isNaN(v) && Number(v) > 0, 'Must be a positive number'),
  description:         z.string().max(500, 'Description too long').optional(),
});

const CATEGORIES = [
  { value: 'GENERAL_GOODS', label: 'General Goods'  },
  { value: 'FRAGILE',       label: 'Fragile Items'  },
  { value: 'PERISHABLE',    label: 'Perishable'     },
  { value: 'DOCUMENTS',     label: 'Documents'      },
  { value: 'ELECTRONICS',   label: 'Electronics'    },
  { value: 'HAZARDOUS',     label: 'Hazardous Materials' },
];

function Field({ label, error, icon: Icon, children, hint }) {
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

const inputClass = (hasIcon = true) =>
  `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
   focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 transition-all`;

export default function BookCargo() {
  const navigate = useNavigate();
  const [loading,   setLoading]   = useState(false);
  const [stations,  setStations]  = useState([]);
  const [receiptTracking, setReceiptTracking] = useState(null);

  useEffect(() => {
    senderApi.getStations()
      .then(r => setStations(r.data.data?.filter(s => s.status === 'ACTIVE') || []))
      .catch(() => toast.error('Failed to load stations'));
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await senderApi.bookCargo({
        ...data,
        declaredValue: Number(data.declaredValue),
      });
      const tracking = res.data.data.trackingNumber;
      setReceiptTracking(tracking);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Cargo</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Fill in the details below. Weight and cost will be confirmed at the station.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200
                      rounded-xl p-4 mb-6">
        <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Important — Drop off within 3 days</p>
          <p className="text-blue-600 mt-0.5">
            After booking, bring your cargo to any railway station within 3 days.
            The station officer will weigh it, confirm the cost, and dispatch it.
            Bookings expire automatically if not dropped off.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Receiver details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} className="text-blue-600" />
            Receiver Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" error={errors.receiverName?.message} icon={User}>
              <input {...register('receiverName')} placeholder="Receiver's full name"
                     className={inputClass()} />
            </Field>
            <Field label="NIC Number" error={errors.receiverNic?.message} icon={CreditCard}
                   hint="Old: 123456789V  |  New: 200012345678">
              <input {...register('receiverNic')} placeholder="NIC number"
                     className={inputClass()} />
            </Field>
            <Field label="Email Address" error={errors.receiverEmail?.message} icon={Mail}>
              <input {...register('receiverEmail')} type="email"
                     placeholder="Receiver's email" className={inputClass()} />
            </Field>
            <Field label="Phone Number" error={errors.receiverPhone?.message} icon={Phone}
                   hint="10-digit Sri Lanka number">
              <input {...register('receiverPhone')} placeholder="07XXXXXXXX"
                     maxLength={10} className={inputClass()} />
            </Field>
          </div>
        </div>

        {/* Cargo details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={18} className="text-blue-600" />
            Cargo Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Origin Station" error={errors.originStationId?.message} icon={MapPin}>
              <select {...register('originStationId')}
                      className={`${inputClass()} bg-white`}>
                <option value="">Select origin...</option>
                {stations.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
                ))}
              </select>
            </Field>

            <Field label="Destination Station" error={errors.destinationStationId?.message} icon={MapPin}>
              <select {...register('destinationStationId')}
                      className={`${inputClass()} bg-white`}>
                <option value="">Select destination...</option>
                {stations.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
                ))}
              </select>
            </Field>

            <Field label="Cargo Category" error={errors.category?.message} icon={Package}>
              <select {...register('category')} className={`${inputClass()} bg-white`}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Declared Value (LKR)" error={errors.declaredValue?.message}
                   icon={DollarSign} hint="Used to calculate insurance cost">
              <input {...register('declaredValue')} type="number" min="1"
                     placeholder="e.g. 5000" className={inputClass()} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Description (optional)" error={errors.description?.message}
                     icon={FileText}>
                <textarea {...register('description')} rows={3}
                          placeholder="Brief description of cargo contents..."
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg
                                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                     placeholder:text-gray-300 resize-none" />
              </Field>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            ⚖️ <strong>Note:</strong> Actual weight, train type (Express/Goods) and final cost
            will be determined by the station officer when you drop off the cargo.
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white font-semibold py-3 rounded-xl transition-colors
                     flex items-center justify-center gap-2 shadow-md">
          {loading
            ? <><Loader2 size={18} className="animate-spin" />Processing Booking...</>
            : <><Package size={18} />Confirm Booking</>}
        </button>
      </form>

      {receiptTracking && (
        <ReceiptModal 
          trackingNumber={receiptTracking} 
          onClose={() => setReceiptTracking(null)} 
          nextRoute="/sender/shipments"
        />
      )}
    </div>
  );
}
