import { ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OfficerDashboard() {
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
      </div>
    </div>
  );
}
