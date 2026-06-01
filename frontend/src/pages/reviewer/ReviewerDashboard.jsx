import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ReviewerDashboard() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to the public tracking page securely
      navigate(`/track/${query.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Reviewer</h1>
        <p className="text-gray-500 mt-1">You have read-only access to track and audit shared shipments.</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Search className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Track a Shipment</h2>
            <p className="text-gray-500 text-sm">Enter the tracking number provided to you.</p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. RP2026..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg uppercase" 
            />
          </div>
          <button 
            type="submit" 
            disabled={!query.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Track
          </button>
        </form>
      </div>
    </div>
  );
}
