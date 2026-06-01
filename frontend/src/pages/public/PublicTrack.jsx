import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Package, Loader2, CheckCircle, Clock, Truck, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { publicApi } from '../../api/endpoints/publicApi';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['PENDING_DROP_OFF','BOOKED','DISPATCHED','IN_TRANSIT','ARRIVED','DELIVERED'];

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

export default function PublicTrack() {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(trackingNumber || '');
  const [cargo, setCargo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (trackingNumber) {
      handleTrack(trackingNumber);
    }
  }, [trackingNumber]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/track/${query.trim().toUpperCase()}`);
    }
  };

  const handleTrack = async (id) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await publicApi.trackCargo(id);
      setCargo(res.data.data);
    } catch (err) {
      setCargo(null);
      if (err.response?.status === 404) {
        toast.error('No cargo found with that tracking number');
      } else {
        toast.error('Tracking failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = cargo ? STATUS_STEPS.indexOf(cargo.status) : -1;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-[#1e3a6e] py-6 px-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </button>
          <div className="text-white font-bold tracking-wide">RAILPOST PUBLIC TRACKING</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Track Cargo</h1>
          <p className="text-gray-500 mt-2">Enter your tracking number to get real-time status updates</p>
        </div>

        {/* Search */}
        <form onSubmit={onSubmit} className="flex gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-8 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. RP20260530XXXXXX"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase" 
            />
          </div>
          <button type="submit" disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Track
          </button>
        </form>

        {/* Results */}
        {loading && (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100 max-w-xl mx-auto">
            <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Tracking your cargo journey...</p>
          </div>
        )}

        {!loading && searched && !cargo && (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100 max-w-xl mx-auto">
            <AlertCircle size={48} className="text-red-300 mx-auto mb-4" />
            <p className="text-gray-800 text-lg font-bold">Cargo not found</p>
            <p className="text-gray-500 mt-2">Double check your tracking number and try again.</p>
          </div>
        )}

        {!loading && cargo && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Header */}
            <div className={`rounded-2xl p-6 border shadow-sm ${STATUS_COLORS[cargo.status]}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  {(() => { const Icon = STATUS_ICONS[cargo.status] || Package; return <Icon size={28} />; })()}
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-75 uppercase tracking-wider mb-0.5">Current Status</p>
                  <p className="font-bold text-2xl tracking-tight">{cargo.statusLabel}</p>
                </div>
                <div className="ml-auto text-right flex items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold opacity-75 uppercase tracking-wider mb-0.5">Tracking Number</p>
                    <p className="font-mono font-bold text-lg">{cargo.trackingNumber}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm hidden sm:block">
                    <QRCodeSVG value={cargo.trackingNumber} size={64} level="H" />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {stepIndex >= 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-8">Journey Progress</p>
                <div className="flex items-center gap-1">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 relative transition-all duration-300
                        ${i <= stepIndex ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' : 'bg-gray-100 text-gray-400'}`}>
                        {i < stepIndex ? '✓' : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className="h-1.5 flex-1 -mx-2 relative">
                          <div className={`absolute inset-0 rounded-full transition-all duration-500
                            ${i < stepIndex ? 'bg-blue-600' : 'bg-gray-100'}`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  {STATUS_STEPS.map((s, i) => (
                    <div key={s} className="flex-1 text-center">
                      <p className={`text-[11px] font-bold uppercase tracking-wider leading-tight px-1
                        ${i <= stepIndex ? 'text-blue-700' : 'text-gray-400'}`}>
                        {s.replace('_', ' ').replace('OFF','')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Privacy Masked Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">Shipment Details</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Origin</p>
                      <p className="text-gray-900 font-medium">{cargo.originStationName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Destination</p>
                      <p className="text-gray-900 font-medium">{cargo.destinationStationName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Sender</p>
                      <p className="text-gray-900 font-medium">{cargo.senderName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Receiver</p>
                      <p className="text-gray-900 font-medium">{cargo.receiverName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {cargo.statusHistory?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <p className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">Tracking Log</p>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {[...cargo.statusHistory].reverse().map((h, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-blue-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900 text-sm">{h.status?.replace(/_/g, ' ')}</div>
                            <time className="font-mono text-xs font-medium text-indigo-500">{new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</time>
                          </div>
                          <div className="text-slate-500 text-xs">{h.location}</div>
                          <div className="text-slate-500 text-[11px] mt-1 italic">{new Date(h.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
