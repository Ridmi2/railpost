import { useEffect, useState } from 'react';
import { adminApi } from '../../api/endpoints/adminApi';
import { DollarSign, Scale, Milestone, ShieldAlert, Sparkles, RefreshCw, Calculator, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCosts() {
  const [costConfig, setCostConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    baseWeightRate: 0,
    baseDistanceRate: 0,
    fragileMultiplier: 1,
    perishableMultiplier: 1
  });
  const [submitting, setSubmitting] = useState(false);

  // Calculator State
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcDistance, setCalcDistance] = useState(100);
  const [calcType, setCalcType] = useState('REGULAR');
  const [calcResult, setCalcResult] = useState(0);

  const fetchCostConfig = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCostConfig();
      const data = res.data.data;
      setCostConfig(data);
      setFormData({
        baseWeightRate: data.baseWeightRate,
        baseDistanceRate: data.baseDistanceRate,
        fragileMultiplier: data.fragileMultiplier,
        perishableMultiplier: data.perishableMultiplier
      });
    } catch {
      toast.error('Failed to load cost configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostConfig();
  }, []);

  // Update calculator when values change
  useEffect(() => {
    if (!formData) return;
    
    let multiplier = 1.0;
    if (calcType === 'FRAGILE') multiplier = formData.fragileMultiplier;
    if (calcType === 'PERISHABLE') multiplier = formData.perishableMultiplier;

    const baseCost = (calcWeight * formData.baseWeightRate) + (calcDistance * formData.baseDistanceRate);
    const finalCost = baseCost * multiplier;
    setCalcResult(finalCost);
  }, [calcWeight, calcDistance, calcType, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validations
    if (formData.baseWeightRate <= 0) return toast.error('Base weight rate must be positive');
    if (formData.baseDistanceRate <= 0) return toast.error('Base distance rate must be positive');
    if (formData.fragileMultiplier <= 0) return toast.error('Fragile multiplier must be positive');
    if (formData.perishableMultiplier <= 0) return toast.error('Perishable multiplier must be positive');

    setSubmitting(true);
    try {
      const res = await adminApi.updateCostConfig(formData);
      setCostConfig(res.data.data);
      toast.success('Pricing rules updated successfully');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cost config');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost & Pricing Rules</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configure tariffs, cargo multipliers, and pricing parameters</p>
        </div>
        <button
          onClick={fetchCostConfig}
          className="p-2.5 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
          title="Refresh rates"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tariff configuration */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                <DollarSign className="text-blue-600" size={20} />
                Global Tariffs & Multipliers
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-200 transition-all cursor-pointer"
                >
                  Edit Configuration
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-6">
              {/* Tariff grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Weight Rate */}
                <div className="p-4 rounded-xl bg-gray-50/75 border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Scale size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Base Weight Tariff</span>
                    {editing ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          step="0.01"
                          name="baseWeightRate"
                          value={formData.baseWeightRate}
                          onChange={handleInputChange}
                          className="w-24 px-2 py-1 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 font-bold"
                        />
                        <span className="text-xs text-gray-500 font-medium">LKR / kg</span>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <span className="text-2xl font-bold text-gray-900">LKR {costConfig?.baseWeightRate}</span>
                        <span className="text-xs text-gray-400 ml-1">per kg</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">Charge calculated based on shipment physical weight.</p>
                  </div>
                </div>

                {/* Distance Rate */}
                <div className="p-4 rounded-xl bg-gray-50/75 border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Milestone size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Base Distance Tariff</span>
                    {editing ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          step="0.01"
                          name="baseDistanceRate"
                          value={formData.baseDistanceRate}
                          onChange={handleInputChange}
                          className="w-24 px-2 py-1 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 font-bold"
                        />
                        <span className="text-xs text-gray-500 font-medium">LKR / km</span>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <span className="text-2xl font-bold text-gray-900">LKR {costConfig?.baseDistanceRate}</span>
                        <span className="text-xs text-gray-400 ml-1">per km</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">Charge calculated based on track route distance.</p>
                  </div>
                </div>
              </div>

              {/* Multipliers */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <ShieldAlert size={14} className="text-amber-500" />
                  Cargo Type Multipliers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fragile */}
                  <div className="p-3.5 rounded-lg border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Fragile Cargo</p>
                      <p className="text-xs text-gray-400 mt-0.5">Insurance & delicate handling fee</p>
                    </div>
                    {editing ? (
                      <input
                        type="number"
                        step="0.1"
                        name="fragileMultiplier"
                        value={formData.fragileMultiplier}
                        onChange={handleInputChange}
                        className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center text-gray-900 focus:outline-none focus:border-blue-500 font-bold"
                      />
                    ) : (
                      <span className="text-base font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                        {costConfig?.fragileMultiplier}x
                      </span>
                    )}
                  </div>

                  {/* Perishable */}
                  <div className="p-3.5 rounded-lg border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Perishable Cargo</p>
                      <p className="text-xs text-gray-400 mt-0.5">Speedy transit & cooling fee</p>
                    </div>
                    {editing ? (
                      <input
                        type="number"
                        step="0.1"
                        name="perishableMultiplier"
                        value={formData.perishableMultiplier}
                        onChange={handleInputChange}
                        className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center text-gray-900 focus:outline-none focus:border-blue-500 font-bold"
                      />
                    ) : (
                      <span className="text-base font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-lg">
                        {costConfig?.perishableMultiplier}x
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {editing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        baseWeightRate: costConfig.baseWeightRate,
                        baseDistanceRate: costConfig.baseDistanceRate,
                        fragileMultiplier: costConfig.fragileMultiplier,
                        perishableMultiplier: costConfig.perishableMultiplier
                      });
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {submitting && <RefreshCw size={14} className="animate-spin" />}
                    Save Rules
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="text-[11px] text-gray-400 mt-6 flex items-center gap-1">
            <HelpCircle size={12} />
            <span>Pricing formula: Total = (Weight * WeightRate + Distance * DistanceRate) * Multiplier</span>
          </div>
        </div>

        {/* Live Estimator (Aesthetic Preview) */}
        <div className="bg-gradient-to-br from-[#1e3a6e] to-[#0f1e3c] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <Calculator size={20} className="text-blue-300 animate-pulse" />
              <h2 className="font-bold text-base">Pricing Simulator</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-300">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Distance (km)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcDistance}
                    onChange={(e) => setCalcDistance(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-300">km</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Cargo Category
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white cursor-pointer select-transparent"
                >
                  <option value="REGULAR" className="bg-[#0f1e3c] text-white">Regular Cargo (1.0x)</option>
                  <option value="FRAGILE" className="bg-[#0f1e3c] text-white">Fragile (Special Care)</option>
                  <option value="PERISHABLE" className="bg-[#0f1e3c] text-white">Perishable (Cooling/Fast)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Big display */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Estimated Shipment Cost</span>
            <span className="text-4xl font-extrabold tracking-tight mt-2 block font-mono">
              LKR {calcResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-blue-300/60 mt-1 block flex items-center justify-center gap-1">
              <Sparkles size={10} /> Calculated in real time using above rates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
