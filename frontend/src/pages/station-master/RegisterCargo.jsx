import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, User, Phone, Mail, CreditCard,
         Package, MapPin, DollarSign, FileText, Weight } from 'lucide-react';
import toast from 'react-hot-toast';
import { stationMasterApi } from '../../api/endpoints/stationMasterApi';
import ReceiptModal from '../../components/ui/ReceiptModal';

const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
const phoneRegex = /^0[0-9]{9}$/;
const gmailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9.]{4,28})[a-zA-Z0-9]@gmail\.com$/;

const schema = z.object({
  senderName:           z.string().min(3, 'Name must be at least 3 characters'),
  senderPhone:          z.string().regex(phoneRegex, 'Enter valid 10-digit phone'),
  senderEmail:          z.string().regex(gmailRegex, 'Enter valid Gmail').optional().or(z.literal('')),
  receiverName:         z.string().min(3, 'Name must be at least 3 characters'),
  receiverNic:          z.string().regex(nicRegex, 'Invalid NIC format'),
  receiverPhone:        z.string().regex(phoneRegex, 'Enter valid 10-digit phone'),
  receiverEmail:        z.string().regex(gmailRegex, 'Enter valid Gmail').optional().or(z.literal('')),
  category:             z.string().min(1, 'Select a category'),
  destinationStationId: z.string().min(1, 'Select destination station'),
  weight:               z.string().min(1, 'Weight is required')
                          .refine(v => !isNaN(v) && Number(v) > 0, 'Must be positive'),
  declaredValue:        z.string().min(1, 'Declared value is required')
                          .refine(v => !isNaN(v) && Number(v) > 0, 'Must be positive'),
  trainType:            z.string().min(1, 'Select train type'),
  description:          z.string().max(500).optional(),
});

const CATEGORIES = [
  { value: 'GENERAL_GOODS', label: 'General Goods'       },
  { value: 'FRAGILE',       label: 'Fragile Items'        },
  { value: 'PERISHABLE',    label: 'Perishable'           },
  { value: 'DOCUMENTS',     label: 'Documents'            },
  { value: 'ELECTRONICS',   label: 'Electronics'          },
  { value: 'HAZARDOUS',     label: 'Hazardous Materials'  },
];

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

const iCls = (icon = true) =>
  `w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-gray-200 rounded-lg
   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
   placeholder:text-gray-300 transition-all`;

export default function RegisterCargo() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [receiptTracking, setReceiptTracking] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    stationMasterApi.getStations()
      .then(r => setStations(r.data.data?.filter(s => s.status === 'ACTIVE') || []))
      .catch(() => toast.error('Failed to load stations'));
  }, []);

  const weightVal = watch('weight');
  const declaredVal = watch('declaredValue');
  const trainTypeVal = watch('trainType');

  // Live cost estimate
  useEffect(() => {
    const w = parseFloat(weightVal);
    const d = parseFloat(declaredVal);
    if (!isNaN(w) && !isNaN(d) && w > 0 && d > 0 && trainTypeVal) {
      const rate = trainTypeVal === 'EXPRESS' ? 15.0 : 8.0;
      const transport = Math.round(w * rate * 10) / 10;
      const insurance = Math.round(d * 0.02 * 100) / 100;
      setEstimatedCost({ transport, insurance, total: Math.round((transport + insurance) * 100) / 100 });
    } else {
      setEstimatedCost(null);
    }
  }, [weightVal, declaredVal, trainTypeVal]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await stationMasterApi.registerWalkIn({
        ...data,
        weight: Number(data.weight),
        declaredValue: Number(data.declaredValue),
        senderEmail: data.senderEmail || undefined,
        receiverEmail: data.receiverEmail || undefined,
      });
      const tn = res.data.data.trackingNumber;
      setReceiptTracking(tn);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Register Walk-in Cargo</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Register cargo for a walk-in sender. Weight and cost calculated here.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Sender */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} className="text-blue-600" />Sender Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" error={errors.senderName?.message} icon={User}>
              <input {...register('senderName')} placeholder="Sender full name" className={iCls()} />
            </Field>
            <Field label="Phone" error={errors.senderPhone?.message} icon={Phone}
                   hint="10-digit Sri Lankan number">
              <input {...register('senderPhone')} placeholder="07XXXXXXXX"
                     maxLength={10} className={iCls()} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Email (optional)" error={errors.senderEmail?.message} icon={Mail}>
                <input {...register('senderEmail')} type="email"
                       placeholder="sender@gmail.com" className={iCls()} />
              </Field>
            </div>
          </div>
        </div>

        {/* Receiver */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} className="text-emerald-600" />Receiver Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" error={errors.receiverName?.message} icon={User}>
              <input {...register('receiverName')} placeholder="Receiver full name" className={iCls()} />
            </Field>
            <Field label="NIC" error={errors.receiverNic?.message} icon={CreditCard}
                   hint="Old: 123456789V | New: 200012345678">
              <input {...register('receiverNic')} placeholder="NIC number" className={iCls()} />
            </Field>
            <Field label="Phone" error={errors.receiverPhone?.message} icon={Phone}>
              <input {...register('receiverPhone')} placeholder="07XXXXXXXX"
                     maxLength={10} className={iCls()} />
            </Field>
            <Field label="Email (optional)" error={errors.receiverEmail?.message} icon={Mail}>
              <input {...register('receiverEmail')} type="email"
                     placeholder="receiver@gmail.com" className={iCls()} />
            </Field>
          </div>
        </div>

        {/* Cargo */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={18} className="text-blue-600" />Cargo Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Destination Station" error={errors.destinationStationId?.message} icon={MapPin}>
              <select {...register('destinationStationId')} className={`${iCls()} bg-white`}>
                <option value="">Select station...</option>
                {stations.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
                ))}
              </select>
            </Field>
            <Field label="Cargo Category" error={errors.category?.message} icon={Package}>
              <select {...register('category')} className={`${iCls()} bg-white`}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Train Type" error={errors.trainType?.message} icon={Package}>
              <select {...register('trainType')}
                      className={`${iCls()} bg-white`}>
                <option value="">Select train type...</option>
                <option value="EXPRESS">Express Train (LKR 15/kg)</option>
                <option value="GOODS">Goods Train (LKR 8/kg)</option>
              </select>
            </Field>
            <Field label="Weight (kg)" error={errors.weight?.message} icon={Weight}
                   hint="Actual weight from station scale">
              <input {...register('weight')} type="number" step="0.1" min="0.1"
                     placeholder="e.g. 5.5"
                     className={iCls()} />
            </Field>
            <Field label="Declared Value (LKR)" error={errors.declaredValue?.message}
                   icon={DollarSign} hint="For insurance calculation (2%)">
              <input {...register('declaredValue')} type="number" min="1"
                     placeholder="e.g. 5000"
                     className={iCls()} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description (optional)" error={errors.description?.message}
                     icon={FileText}>
                <textarea {...register('description')} rows={2}
                          placeholder="Brief description of cargo..."
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg
                                     text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                     placeholder:text-gray-300 resize-none" />
              </Field>
            </div>
          </div>

          {/* Live cost estimate */}
          {estimatedCost && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Estimated Cost Breakdown
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Transport',  value: estimatedCost.transport  },
                  { label: 'Insurance',  value: estimatedCost.insurance  },
                  { label: 'Total',      value: estimatedCost.total, bold: true },
                ].map(({ label, value, bold }) => (
                  <div key={label} className={`bg-white rounded-lg p-2 ${bold ? 'ring-1 ring-blue-400' : ''}`}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className={`text-sm font-${bold ? 'bold' : 'semibold'} text-blue-700`}>
                      LKR {value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white font-semibold py-3 rounded-xl transition-colors
                     flex items-center justify-center gap-2 shadow-md">
          {loading
            ? <><Loader2 size={18} className="animate-spin" />Registering...</>
            : <><Package size={18} />Register Cargo & Generate QR</>}
        </button>
      </form>

      {receiptTracking && (
        <ReceiptModal 
          trackingNumber={receiptTracking} 
          onClose={() => setReceiptTracking(null)} 
          nextRoute="/station-master/cargo"
        />
      )}
    </div>
  );
}
