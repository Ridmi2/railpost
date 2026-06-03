import { ScanLine, TrendingDown, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { officerApi } from '../../api/endpoints/officerApi';
import toast from 'react-hot-toast';

export default function OfficerDashboard() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officerApi.getForecast()
      .then(res => setForecast(res.data.data))
      .catch(() => toast.error('Failed to load forecast'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Officer</h1>
        <p className="text-gray-500 mt-1">Manage cargo scanning, dispatch, and delivery from here.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <ScanLine className="text-blue-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Scan & Process Cargo</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Scan QR codes or enter tracking numbers to update cargo status (Dispatch, Transit, Arrival) or process OTP deliveries.
          </p>
          <Link 
            to="/officer/scan" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Start Scanning
          </Link>
        </div>

        {/* Incoming Forecast Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <TrendingDown className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Incoming Forecast</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Cargo currently dispatched or in-transit heading towards your station.
          </p>
          
          {loading ? (
            <div className="w-full flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : forecast ? (
            <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="text-4xl font-black text-indigo-700 mb-1">
                {forecast.incomingCount}
              </div>
              <div className="text-sm font-medium text-indigo-900 uppercase tracking-wider">
                Packages Expected
              </div>
              <div className="text-xs text-indigo-600 mt-2">
                Destination: {forecast.destinationStationName}
              </div>
            </div>
          ) : (
            <div className="w-full p-4 text-sm text-gray-400">Data unavailable</div>
          )}
        </div>
      </div>
    </div>
  );
}
