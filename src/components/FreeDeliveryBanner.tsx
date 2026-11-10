import React from 'react';
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FreeDeliveryBanner: React.FC = () => {
  const { getCartWeight, settings } = useApp();
  const currentWeight = getCartWeight();
  const threshold = settings.freeDeliveryThresholdKg; // 10.0 kg
  const isFree = currentWeight > threshold;
  const neededKg = Math.max(0, +(threshold - currentWeight + 0.1).toFixed(1));
  const progressPercent = Math.min(100, Math.round((currentWeight / threshold) * 100));

  return (
    <div className="bg-gradient-to-r from-[#126B45] to-[#1b8557] text-white rounded-xl shadow-md p-4 mb-6 border border-emerald-700/50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F2B84B] text-[#202C27] flex items-center justify-center shrink-0 font-bold shadow">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base sm:text-lg">
                Weight-Based Delivery Rule: Free Delivery Over {threshold} kg!
              </span>
              <span className="text-xs bg-[#F2B84B] text-[#202C27] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Strict Rule
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              {isFree ? (
                <span className="text-yellow-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 inline" /> Congratulations! Your order weight is {currentWeight.toFixed(1)} kg. You qualify for 100% FREE DELIVERY!
                </span>
              ) : (
                <span>
                  Current eligible weight: <strong className="text-yellow-300 font-bold">{currentWeight.toFixed(1)} kg</strong>.
                  {currentWeight === threshold ? (
                    <span className="text-amber-200 ml-1">
                      (Exactly {threshold} kg requires normal charges. Add 0.1 more kg to qualify for Free Delivery!)
                    </span>
                  ) : (
                    <span> Add <strong className="text-yellow-300 font-bold">{neededKg} more kg</strong> of eligible grocery items to unlock FREE delivery!</span>
                  )}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Weight gauge */}
        <div className="w-full md:w-64 shrink-0 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-600/30">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-emerald-200">Cart Weight: <span className="text-white font-bold">{currentWeight.toFixed(1)} kg</span></span>
            <span className="font-bold text-[#F2B84B]">{isFree ? 'FREE UNLOCKED' : `Target: >${threshold} kg`}</span>
          </div>
          <div className="w-full bg-emerald-900/80 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFree ? 'bg-[#F2B84B]' : 'bg-emerald-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-emerald-300/80 mt-1">
            <span>0 kg</span>
            <span>10 kg (Paid)</span>
            <span>&gt;10 kg (Free)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
