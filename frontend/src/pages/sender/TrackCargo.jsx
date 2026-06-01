import { useState } from 'react';
import { Search, Package, Loader2, CheckCircle, Clock,
         Truck, MapPin, AlertCircle } from 'lucide-react';
import { senderApi } from '../../api/endpoints/senderApi';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  'PENDING_DROP_OFF','BOOKED','DISPATCHED','IN_TRANSIT','ARRIVED','DELIVERED'
];

const STATUS_ICONS = {
  PENDING_DROP_OFF: Clock,
  BOOKED:           Package,
  DISPATCHED:       Truck,
  IN_TRANSIT:       Truck,
  ARRIVED:          MapPin,
  DELIVERED:        CheckCircle,
  CANCELLED:        AlertCircle,
  EXPIRED:          AlertCircle,
};

const STATUS_COLORS = {
  PENDING_DROP_OFF: 'text-amber-500 bg-amber-50 border-amber-200',
  BOOKED:           'text-blue-600 bg-blue-50 border-blue-200',
  DISPATCHED:       'text-violet-600 bg-violet-50 border-violet-200',
  IN_TRANSIT:       'text-cyan-600 bg-cyan-50 border-cyan-200',
  ARRIVED:          'text-indigo-600 bg-indigo-50 border-indigo-200',
  DELIVERED:        'text-green-600 bg-green-50 border-green-200',
  CANCELLED:        'text-red-600 bg-red-50 border-red-200',
  EXPIRED:          'text-gray-500 bg-gray-50 border-gray-200',
};

export default function TrackCargo() {
  const [query,   setQuery]   = useState('');
  const [cargo,   setCargo]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const track = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await senderApi.trackCargo(query.trim().toUpperCase());
      setCargo(res.data.data);
    } catch (err) {
      setCargo(null);
      if (err.response?.status === 404)
        toast.error('No cargo found with that tracking number');
      else
        toast.error('Tracking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = cargo ? STATUS_STEPS.indexOf(cargo.status) : -1;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Track Cargo</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Enter your tracking number to get real-time status
        </p>
      </div>

      {/* Search */}
      <form onSubmit={track}
        className="flex gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={query} onChange={e => setQuery(e.target.value)}
                 placeholder="e.g. RP20260530XXXXXX"
                 className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
        </div>
        <button type="submit" disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white
                     font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Track
        </button>
      </form>

      {/* Result */}
      {loading && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Looking up your cargo...</p>
        </div>
      )}

      {!loading && searched && !cargo && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <AlertCircle size={40} className="text-red-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Cargo not found</p>
          <p className="text-gray-400 text-sm mt-1">
            Check your tracking number and try again
          </p>
        </div>
      )}

      {!loading && cargo && (
        <div className="space-y-4">
          {/* Status card */}
          <div className={`rounded-xl p-5 border ${STATUS_COLORS[cargo.status]}`}>
            <div className="flex items-center gap-3">
              {(() => { const Icon = STATUS_ICONS[cargo.status] || Package;
                return <Icon size={24} />; })()}
              <div>
                <p className="font-bold text-lg">{cargo.statusLabel}</p>
                <p className="text-sm opacity-75 font-mono">{cargo.trackingNumber}</p>
              </div>
            </div>
          </div>

          {/* Progress bar (for non-cancelled/expired) */}
          {stepIndex >= 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-4">Shipment Progress</p>
              <div className="flex items-center gap-1">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                    text-xs font-bold flex-shrink-0
                                    ${i <= stepIndex
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-200 text-gray-400'}`}>
                      {i < stepIndex ? '✓' : i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`h-1 flex-1 mx-1 rounded
                                      ${i < stepIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {STATUS_STEPS.map(s => (
                  <p key={s} className="text-xs text-gray-400 text-center flex-1 leading-tight">
                    {s.replace('_', ' ').replace('OFF','')}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Cargo details */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="font-semibold text-gray-800 mb-4">Shipment Details</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Receiver',     cargo.receiverName],
                ['Destination',  cargo.destinationStationName || '—'],
                ['Category',     cargo.category?.replace('_',' ')],
                ['Declared Value', cargo.declaredValue ? `LKR ${cargo.declaredValue.toLocaleString()}` : '—'],
                ['Weight',       cargo.weight ? `${cargo.weight} kg` : 'Pending (at station)'],
                ['Total Cost',   cargo.totalCost ? `LKR ${cargo.totalCost.toLocaleString()}` : 'Pending'],
                ['Train',        cargo.trainNumber || '—'],
                ['Booked On',    new Date(cargo.createdAt).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className="text-gray-800 font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status timeline */}
          {cargo.statusHistory?.length > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="font-semibold text-gray-800 mb-4">Status Timeline</p>
              <div className="space-y-3">
                {[...cargo.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {h.status?.replace(/_/g, ' ')}
                      </p>
                      {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(h.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
