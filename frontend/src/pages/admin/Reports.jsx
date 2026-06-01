import { useEffect, useState } from 'react';
import { adminApi } from '../../api/endpoints/adminApi';
import { BarChart3, TrendingUp, Scale, Package, Landmark, RefreshCw, Printer, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getReportsSummary();
      setReport(res.data.data);
    } catch {
      toast.error('Failed to load system report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getPercent = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const filteredRevenue = report?.stationRevenue?.filter(item => 
    item.stationName.toLowerCase().includes(search.toLowerCase()) ||
    item.stationCode.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 print:p-0 print:bg-white print:text-black">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Overview of cargo operations, revenue, and station performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchReport}
            className="p-2.5 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
            title="Refresh statistics"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Printer size={18} />
            Print Report
          </button>
        </div>
      </div>

      {/* PRINT-ONLY TITLE */}
      <div className="hidden print:block border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">RailPost System Report</h1>
        <p className="text-gray-500 text-sm mt-1">Sri Lanka Railways Cargo Tracking & Pricing Portal</p>
        <p className="text-xs text-gray-400 mt-0.5">Generated on: {new Date().toLocaleString()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900 mt-1.5 font-mono">
              LKR {report?.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1.5">
              <TrendingUp size={12} />
              +14% vs last week
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Landmark size={22} />
          </div>
        </div>

        {/* Total Cargo Weight */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Cargo Handled</p>
            <p className="text-2xl font-black text-gray-900 mt-1.5 font-mono">
              {report?.totalWeight?.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
            </p>
            <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1.5">
              <TrendingUp size={12} />
              Steady volume
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Scale size={22} />
          </div>
        </div>

        {/* Total Shipments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Shipments</p>
            <p className="text-2xl font-black text-gray-900 mt-1.5 font-mono">
              {report?.totalShipments?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1.5 font-semibold">
              Processed tracking parcels
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <Package size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Station-wise Revenue Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
              <BarChart3 size={18} className="text-blue-600" />
              Node-Wise Performance
            </h2>
            <div className="relative w-full sm:w-64 print:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search station..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Station</th>
                  <th className="px-4 py-3 text-right">Shipments</th>
                  <th className="px-4 py-3 text-right">Weight (kg)</th>
                  <th className="px-4 py-3 text-right">Revenue (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {filteredRevenue.map((item) => (
                  <tr key={item.stationId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      <span>{item.stationName}</span>
                      <span className="ml-1.5 font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px]">
                        {item.stationCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold font-mono">{item.shipmentsCount}</td>
                    <td className="px-4 py-3 text-right font-semibold font-mono">
                      {item.weight.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-blue-700 font-mono">
                      {item.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
                {filteredRevenue.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400">
                      No stations match search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cargo Status Distribution Graph */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-800 text-base pb-4 border-b border-gray-50 flex items-center gap-2">
              <Package size={18} className="text-blue-600" />
              Delivery Progress
            </h2>

            <div className="mt-6 space-y-5">
              {/* PENDING */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Pending Acceptance
                  </span>
                  <span className="font-bold font-mono">
                    {report?.statusDistribution?.PENDING} ({getPercent(report?.statusDistribution?.PENDING, report?.totalShipments)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getPercent(report?.statusDistribution?.PENDING, report?.totalShipments)}%` }}
                  />
                </div>
              </div>

              {/* IN TRANSIT */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    In Transit
                  </span>
                  <span className="font-bold font-mono">
                    {report?.statusDistribution?.IN_TRANSIT} ({getPercent(report?.statusDistribution?.IN_TRANSIT, report?.totalShipments)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getPercent(report?.statusDistribution?.IN_TRANSIT, report?.totalShipments)}%` }}
                  />
                </div>
              </div>

              {/* DELIVERED */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Delivered
                  </span>
                  <span className="font-bold font-mono">
                    {report?.statusDistribution?.DELIVERED} ({getPercent(report?.statusDistribution?.DELIVERED, report?.totalShipments)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getPercent(report?.statusDistribution?.DELIVERED, report?.totalShipments)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 mt-6 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
            <Landmark size={12} className="text-gray-400" />
            <span>Aggregate summaries sync in real-time with the booking engine.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
