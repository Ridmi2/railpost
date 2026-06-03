import { useEffect, useState } from 'react';
import { Package, Search, X, RefreshCw } from 'lucide-react';
import { senderApi } from '../../api/endpoints/senderApi';
import toast from 'react-hot-toast';
import ShareQrModal from '../../components/ui/ShareQrModal';

const STATUS_COLORS = {
  PENDING_DROP_OFF: 'bg-amber-100 text-amber-700',
  BOOKED:           'bg-blue-100 text-blue-700',
  DISPATCHED:       'bg-violet-100 text-violet-700',
  IN_TRANSIT:       'bg-cyan-100 text-cyan-700',
  ARRIVED:          'bg-indigo-100 text-indigo-700',
  DELIVERED:        'bg-green-100 text-green-700',
  CANCELLED:        'bg-red-100 text-red-700',
  EXPIRED:          'bg-gray-100 text-gray-600',
};

export default function MyShipments() {
  const [shipments, setShipments] = useState([]);
  const [incoming,  setIncoming]  = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'incoming'
  const [filtered,  setFiltered]  = useState([]);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('ALL');
  const [loading,   setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [sharingQr,  setSharingQr] = useState(null);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const [shipmentsRes, incomingRes] = await Promise.all([
        senderApi.getShipments(),
        senderApi.getIncoming()
      ]);
      setShipments(shipmentsRes.data.data || []);
      setIncoming(incomingRes.data.data || []);
    } catch {
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShipments(); }, []);

  useEffect(() => {
    let list = activeTab === 'bookings' ? shipments : incoming;
    if (filter !== 'ALL') list = list.filter(s => s.status === filter);
    if (search) list = list.filter(s =>
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      s.destinationStationName?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [shipments, incoming, activeTab, filter, search]);

  const cancel = async (cargoId) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(cargoId);
    try {
      await senderApi.cancelBooking(cargoId);
      toast.success('Booking cancelled');
      fetchShipments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally {
      setCancelling(null);
    }
  };

  const FILTERS = ['ALL','PENDING_DROP_OFF','DISPATCHED','IN_TRANSIT','ARRIVED','DELIVERED','CANCELLED'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Shipments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track your sent and incoming cargo</p>
        </div>
        <button onClick={fetchShipments}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600
                     border border-gray-200 rounded-lg px-3 py-2 bg-white transition-colors w-full sm:w-auto">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
          My Bookings ({shipments.length})
        </button>
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'incoming' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
          Incoming Deliveries ({incoming.length})
        </button>
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="Search by tracking number, receiver or station..."
                   className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                              focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500">
            {FILTERS.map(f => (
              <option key={f} value={f}>{f === 'ALL' ? 'All Status' : f.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No shipments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Tracking #','Receiver','Destination','Category','Status','Booked','Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-blue-600">
                      {s.trackingNumber}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      <p>{s.receiverName}</p>
                      <p className="text-xs text-gray-400">{s.receiverPhone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{s.destinationStationName}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {s.category?.replace('_', ' ')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                                       ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {s.statusLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      {s.status === 'PENDING_DROP_OFF' && activeTab === 'bookings' && (
                        <button onClick={() => cancel(s.id)} disabled={cancelling === s.id}
                          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1
                                     disabled:opacity-50 font-medium mb-1">
                          <X size={12} />
                          {cancelling === s.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                      {s.status !== 'PENDING_DROP_OFF' && s.status !== 'CANCELLED' && (
                        <button onClick={() => setSharingQr(s.trackingNumber)}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                          Share QR
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {sharingQr && (
        <ShareQrModal 
          trackingNumber={sharingQr} 
          onClose={() => setSharingQr(null)} 
        />
      )}
    </div>
  );
}
