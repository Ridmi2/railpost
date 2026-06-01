import { useEffect, useState } from 'react';
import { Package, Search, RefreshCw } from 'lucide-react';
import { stationMasterApi } from '../../api/endpoints/stationMasterApi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING_DROP_OFF: 'bg-amber-100 text-amber-700',
  BOOKED:           'bg-blue-100 text-blue-700',
  DISPATCHED:       'bg-violet-100 text-violet-700',
  IN_TRANSIT:       'bg-cyan-100 text-cyan-700',
  ARRIVED:          'bg-indigo-100 text-indigo-700',
  DELIVERED:        'bg-green-100 text-green-700',
  CANCELLED:        'bg-red-100 text-red-700',
  EXPIRED:          'bg-gray-100 text-gray-500',
};

export default function StationCargo() {
  const [cargo,   setCargo]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('ALL');
  const [loading,  setLoading]  = useState(true);

  const fetchCargo = async () => {
    setLoading(true);
    try {
      const res = await stationMasterApi.getStationCargo();
      setCargo(res.data.data || []);
    } catch {
      toast.error('Failed to load cargo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCargo(); }, []);

  useEffect(() => {
    let list = cargo;
    if (status !== 'ALL') list = list.filter(c => c.status === status);
    if (search) list = list.filter(c =>
      c.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      c.receiverName?.toLowerCase().includes(search.toLowerCase()) ||
      c.senderName?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [cargo, status, search]);

  const STATUSES = ['ALL','BOOKED','DISPATCHED','IN_TRANSIT','ARRIVED','DELIVERED'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Station Cargo</h1>
          <p className="text-gray-500 text-sm mt-0.5">{cargo.length} total records</p>
        </div>
        <button onClick={fetchCargo}
          className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200
                     rounded-lg px-3 py-2 bg-white hover:text-blue-600 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="Search by tracking number, sender or receiver..."
                   className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                              focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500">
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s.replace('_',' ')}</option>
            ))}
          </select>
        </div>
      </div>

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
            <p className="text-gray-400 font-medium">No cargo records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Tracking #','Sender','Receiver','Destination','Weight','Cost','Status','Date'].map(h => (
                    <th key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-medium text-blue-600">
                      {c.trackingNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.senderName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <p>{c.receiverName}</p>
                      <p className="text-xs text-gray-400">{c.receiverPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.destinationStationName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.weight ? `${c.weight} kg` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.totalCost ? `LKR ${c.totalCost.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                                       ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.statusLabel || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
