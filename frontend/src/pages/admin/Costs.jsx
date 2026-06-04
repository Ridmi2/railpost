import { useState, useEffect } from 'react';
import { DollarSign, Scale, Calculator, Info, ShieldCheck, Box } from 'lucide-react';
import { publicApi } from '../../api/endpoints/publicApi';

export default function AdminCosts() {
  // Calculator State
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcDistance, setCalcDistance] = useState(100);
  const [calcTrainType, setCalcTrainType] = useState('NORMAL');
  const [calcCategory, setCalcCategory] = useState('GENERAL');
  const [calcDeclaredValue, setCalcDeclaredValue] = useState(5000);
  
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const calculateCost = async () => {
      if (calcWeight > 0 && calcDistance > 0 && calcDeclaredValue >= 0) {
        setCalculating(true);
        try {
          const res = await publicApi.calculateCost({
            distance: Number(calcDistance),
            weight: Number(calcWeight),
            trainType: calcTrainType,
            category: calcCategory,
            declaredValue: Number(calcDeclaredValue)
          });
          setCalcResult(res.data.data);
        } catch (err) {
          console.error("Failed to simulate cost", err);
        } finally {
          setCalculating(false);
        }
      }
    };
    
    // Add a small debounce for fluid typing
    const timeout = setTimeout(calculateCost, 300);
    return () => clearTimeout(timeout);
  }, [calcWeight, calcDistance, calcTrainType, calcCategory, calcDeclaredValue]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sri Lanka Railways Cost Matrix</h1>
        <p className="text-gray-500 text-sm mt-0.5">Official Rate Structure & Insurance Rules (Read-only)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Rules Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg mb-6 pb-4 border-b border-gray-50">
              <Scale className="text-blue-600" size={20} />
              Special Cargo Rules
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RuleCard 
                title="Fish" 
                subtitle="Accompanied by owner"
                desc="50% above the normal charge." 
              />
              <RuleCard 
                title="Letters" 
                subtitle="Small parcels"
                desc="Flat rate of Rs. 20.00" 
              />
              <RuleCard 
                title="Furniture & Chicks" 
                subtitle="Ventilated boxes / small lots"
                desc="Normal Trains: 3x Normal Charge. Express/Intercity: 5x Normal Charge." 
              />
              <RuleCard 
                title="Machines" 
                subtitle="Not exceeding 50 Kg"
                desc="Standard rate applies." 
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg mb-6 pb-4 border-b border-gray-50">
              <ShieldCheck className="text-emerald-600" size={20} />
              Insurance Rules
            </h2>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 space-y-3">
              <InsuranceRow range="Under Rs. 1000/=" fee="No extra charge" />
              <InsuranceRow range="Rs. 1000/= to Rs. 5000/=" fee="1%" />
              <InsuranceRow range="Rs. 5001/= to Rs. 10000/=" fee="1.5%" />
              <InsuranceRow range="Rs. 10001/= to Rs. 20000/=" fee="2%" />
              <InsuranceRow range="Over Rs. 20000/=" fee="3%" />
            </div>
          </div>
        </div>

        {/* Live Estimator (Aesthetic Preview) */}
        <div className="bg-gradient-to-br from-[#1e3a6e] to-[#0f1e3c] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between sticky top-6 self-start">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <Calculator size={20} className="text-blue-300" />
              <h2 className="font-bold text-base">Pricing Simulator</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    value={calcDistance}
                    onChange={(e) => setCalcDistance(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Train Type
                </label>
                <select
                  value={calcTrainType}
                  onChange={(e) => setCalcTrainType(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white cursor-pointer"
                >
                  <option value="NORMAL" className="bg-[#0f1e3c]">Normal Train</option>
                  <option value="EXPRESS" className="bg-[#0f1e3c]">Mail/Express/Intercity</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Cargo Category
                </label>
                <select
                  value={calcCategory}
                  onChange={(e) => setCalcCategory(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white cursor-pointer"
                >
                  <option value="GENERAL" className="bg-[#0f1e3c]">General Goods</option>
                  <option value="LETTERS" className="bg-[#0f1e3c]">Letters</option>
                  <option value="FISH" className="bg-[#0f1e3c]">Fish</option>
                  <option value="FURNITURE" className="bg-[#0f1e3c]">Furniture / Small Lots</option>
                  <option value="CHICKS" className="bg-[#0f1e3c]">Chicks (Ventilated)</option>
                  <option value="LIGHT_WEIGHT" className="bg-[#0f1e3c]">Light Weight Articles</option>
                  <option value="MACHINES" className="bg-[#0f1e3c]">Machines (&lt;50kg)</option>
                  <option value="HIGH_VALUE" className="bg-[#0f1e3c]">High Value Items</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Declared Value (LKR)
                </label>
                <input
                  type="number"
                  value={calcDeclaredValue}
                  onChange={(e) => setCalcDeclaredValue(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 focus:border-blue-400 focus:outline-none rounded-lg px-3 py-2 text-sm font-semibold text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            {calculating || !calcResult ? (
              <div className="animate-pulse text-center space-y-2">
                <div className="h-4 bg-white/20 rounded w-1/3 mx-auto" />
                <div className="h-10 bg-white/20 rounded w-2/3 mx-auto" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-blue-200">
                  <span>Transport Cost</span>
                  <span className="font-mono">Rs. {calcResult.transportCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-emerald-300">
                  <span>Insurance Cost</span>
                  <span className="font-mono">Rs. {calcResult.insuranceCost.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-white/20 flex justify-between items-center font-bold text-xl">
                  <span>Total</span>
                  <span className="font-mono">Rs. {calcResult.totalCost.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ title, subtitle, desc }) {
  return (
    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-3">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
        <Box size={18} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-[10px] uppercase font-semibold text-blue-600 tracking-wider mb-1">{subtitle}</p>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

function InsuranceRow({ range, fee }) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-emerald-200/50 last:border-0 last:pb-0">
      <span className="text-sm font-medium text-emerald-900">{range}</span>
      <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{fee}</span>
    </div>
  );
}
