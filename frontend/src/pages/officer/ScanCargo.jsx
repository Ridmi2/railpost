import { useState, useEffect } from 'react';
import { Search, Loader2, Package, CheckCircle, Truck, MapPin, KeyRound, AlertCircle, Camera, X } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { officerApi } from '../../api/endpoints/officerApi';
import toast from 'react-hot-toast';

export default function ScanCargo() {
  const [query, setQuery] = useState('');
  const [cargo, setCargo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  // Status update states
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [updateTrainType, setUpdateTrainType] = useState('');
  const [updateTrainId, setUpdateTrainId] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Dispatch states
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState('');

  // Fetch trains on mount
  useEffect(() => {
    officerApi.getTrains().then(res => setTrains(res.data.data || [])).catch(() => {});
  }, []);

  // Delivery states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [delivering, setDelivering] = useState(false);

  const searchCargo = async (e) => {
    if(e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setCargo(null);
    setOtpSent(false);
    setOtpCode('');
    
    try {
      const res = await officerApi.getCargo(query.trim().toUpperCase());
      setCargo(res.data.data);
      setNewStatus('');
      setLocation('');
      setNote('');
      setUpdateTrainType('');
      setUpdateTrainId('');
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('Cargo not found');
      } else {
        toast.error('Error fetching cargo details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!newStatus) {
      toast.error('Please select a status (or Keep Current)');
      return;
    }
    if (newStatus === 'DISPATCHED' && cargo.status !== 'DISPATCHED' && !selectedTrain) {
      toast.error('Please select a train for dispatch');
      return;
    }
    if (newStatus !== 'DISPATCHED' && !location && newStatus !== cargo.status) {
      toast.error('Please enter the current location');
      return;
    }

    setUpdating(true);
    try {
      let res;
      // Only call dispatchCargo if it's a NEW dispatch
      if (newStatus === 'DISPATCHED' && cargo.status !== 'DISPATCHED') {
        res = await officerApi.dispatchCargo({
          trainId: selectedTrain,
          cargoTrackingNumbers: [cargo.trackingNumber]
        });
        toast.success('Cargo dispatched successfully');
        setCargo(res.data.data[0]);
      } else {
        res = await officerApi.updateStatus(cargo.trackingNumber, {
          status: newStatus,
          location: location || cargo.destinationStationName, // fallback if keeping current
          note,
          trainType: updateTrainType || undefined,
          trainId: updateTrainId || undefined
        });
        toast.success('Status/Details updated successfully');
        setCargo(res.data.data);
      }
      setNewStatus('');
      setNote('');
      setSelectedTrain('');
      setUpdateTrainType('');
      setUpdateTrainId('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateOtp = async () => {
    try {
      const res = await officerApi.generateOtp(cargo.trackingNumber);
      toast.success(res.data.message); // Will show the demo OTP in toast
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate OTP');
    }
  };

  const handleVerifyDeliver = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setDelivering(true);
    try {
      const res = await officerApi.deliverCargo(cargo.trackingNumber, { otp: otpCode });
      toast.success('Cargo delivered successfully!');
      setCargo(res.data.data);
      setOtpSent(false);
      setOtpCode('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP or delivery failed');
    } finally {
      setDelivering(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scan & Process Cargo</h1>
        <p className="text-gray-500 text-sm mt-0.5">Enter tracking number to update transit status or deliver.</p>
      </div>

      <form onSubmit={searchCargo} className="flex gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            placeholder="Scan QR or Enter Tracking ID (e.g. RP...)"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg uppercase" 
            autoFocus
          />
        </div>
        <button 
          type="button"
          onClick={() => setShowScanner(!showScanner)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
          title="Scan with Camera"
        >
          <Camera size={20} />
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-3 rounded-lg transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Search'}
        </button>
      </form>

      {showScanner && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Scan QR Code using Camera</h3>
            <button onClick={() => setShowScanner(false)} className="text-gray-500 hover:text-gray-700 p-1 bg-gray-100 rounded-full">
              <X size={18} />
            </button>
          </div>
          <div className="overflow-hidden rounded-lg bg-black/5 mx-auto relative" style={{ maxWidth: '400px' }}>
            <Scanner 
              onScan={(result) => {
                if (result && result.length > 0) {
                  const text = result[0].rawValue;
                  setQuery(text);
                  setShowScanner(false);
                  toast.success("QR Code scanned successfully! Click Search to fetch.");
                }
              }}
              onError={(error) => console.log(error?.message)}
              components={{
                audio: false,
                finder: true
              }}
            />
          </div>
        </div>
      )}

      {cargo && (
        <div className="space-y-6">
          {/* Cargo Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">{cargo.trackingNumber}</p>
                  <p className="text-sm text-gray-500">{cargo.originStationName} → {cargo.destinationStationName}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                {cargo.statusLabel}
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Sender</p>
                <p className="font-medium text-gray-900">{cargo.senderName}</p>
                <p className="text-sm text-gray-500">{cargo.senderPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Receiver</p>
                <p className="font-medium text-gray-900">{cargo.receiverName}</p>
                <p className="text-sm text-gray-500">{cargo.receiverPhone}</p>
                <p className="text-sm text-gray-500">NIC: {cargo.receiverNic}</p>
              </div>
            </div>
          </div>

          {/* Action Area based on Status */}
          {cargo.status !== 'DELIVERED' && cargo.status !== 'CANCELLED' && (
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              
              {/* Delivery Section (If Arrived) */}
              {cargo.status === 'ARRIVED' ? (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <KeyRound className="text-emerald-500" /> Secure Delivery
                  </h3>
                  
                  {!otpSent ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center">
                      <p className="text-emerald-800 text-sm mb-4">Cargo has arrived. Generate an OTP to send to the receiver's mobile ({cargo.receiverPhone}) for pickup verification.</p>
                      <button 
                        onClick={handleGenerateOtp}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
                      >
                        Generate & Send OTP
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyDeliver} className="bg-emerald-50 border border-emerald-100 rounded-lg p-6">
                      <label className="block text-sm font-medium text-emerald-900 mb-2 text-center">
                        Enter 6-digit OTP provided by receiver
                      </label>
                      <div className="flex gap-3 justify-center mb-4">
                        <input 
                          type="text" 
                          maxLength={6}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="------"
                          className="w-48 text-center text-2xl tracking-widest py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      <div className="flex justify-center">
                        <button 
                          type="submit"
                          disabled={delivering || otpCode.length !== 6}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                          {delivering && <Loader2 className="animate-spin" size={18} />}
                          Verify & Complete Delivery
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* Transit Status Update Section */
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Truck className="text-blue-500" /> Update Transit Status
                  </h3>
                  <form onSubmit={handleUpdateStatus} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                        <select 
                          value={newStatus} 
                          onChange={e => setNewStatus(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select status...</option>
                          <option value={cargo.status}>-- Keep Current ({cargo.statusLabel}) --</option>
                          <option value="DISPATCHED">Dispatched (Loaded on Train)</option>
                          <option value="IN_TRANSIT">In Transit (Passing Through)</option>
                          <option value="IN_TRANSIT_HUB_SORTING">Unloaded for Transfer / Hub Sorting</option>
                          <option value="ARRIVED">Arrived (Final Destination)</option>
                        </select>
                      </div>
                      
                      {newStatus === 'DISPATCHED' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select Train</label>
                          <select 
                            value={selectedTrain}
                            onChange={e => setSelectedTrain(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select train...</option>
                            {trains.map(t => (
                              <option key={t.id} value={t.id}>{t.trainNo} - {t.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Location (Station)</label>
                          <input 
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="e.g. Colombo Fort"
                            className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Change Details (Optional)</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Update Train Type</label>
                        <select 
                          value={updateTrainType}
                          onChange={e => setUpdateTrainType(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">(No Change)</option>
                          <option value="EXPRESS">Express / Intercity</option>
                          <option value="NORMAL">Normal Train</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Re-assign Train</label>
                        <select 
                          value={updateTrainId}
                          onChange={e => setUpdateTrainId(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">(No Change)</option>
                          {trains.map(t => (
                            <option key={t.id} value={t.id}>{t.trainNo} - {t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                      <input 
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="e.g. Loaded onto Train 1005"
                        className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        disabled={updating || !newStatus}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                      >
                        {updating && <Loader2 className="animate-spin" size={16} />}
                        Update Status & Details
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {cargo.status === 'DELIVERED' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
              <CheckCircle className="text-emerald-500 mx-auto mb-2" size={32} />
              <h3 className="text-lg font-bold text-emerald-900">Cargo Delivered</h3>
              <p className="text-emerald-700 text-sm mt-1">This shipment was successfully delivered on {new Date(cargo.deliveredAt).toLocaleString()}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
