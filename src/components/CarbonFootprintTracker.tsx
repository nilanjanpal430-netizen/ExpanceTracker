import React from "react";
import { Expense, AppSettings } from "../types";
import { Leaf, Bike, Car, Footprints, Sparkles, ShieldCheck } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

interface CarbonFootprintTrackerProps {
  expenses: Expense[];
  settings: AppSettings;
}

export const CarbonFootprintTracker: React.FC<CarbonFootprintTrackerProps> = ({ expenses, settings }) => {
  // Estimate CO2 based on Transport & Food
  const transportSpent = expenses.filter((e) => e.category === "Transport").reduce((a, b) => a + b.amount, 0);
  const foodSpent = expenses.filter((e) => e.category === "Food").reduce((a, b) => a + b.amount, 0);

  // Rough estimation: ₹100 transport ~ 1.8 kg CO2, ₹100 food ~ 0.9 kg CO2
  const estTransportCO2 = Number(((transportSpent / 100) * 1.8).toFixed(1));
  const estFoodCO2 = Number(((foodSpent / 100) * 0.9).toFixed(1));
  const totalCO2 = Number((estTransportCO2 + estFoodCO2).toFixed(1));

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-xs">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Campus Eco & Carbon Footprint</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Green Living
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Environmental CO2 estimate based on your logged travel</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalCO2} kg</div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Est. CO2 Emissions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
            <span className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>Transport Carbon Impact</span>
            </span>
            <span>{estTransportCO2} kg CO2</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Based on {formatCurrency(transportSpent, settings)} spent on metro, cabs, and buses.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/60 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-teal-900 dark:text-teal-200">
            <span className="flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-teal-600" />
              <span>Dietary Carbon Impact</span>
            </span>
            <span>{estFoodCO2} kg CO2</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Based on {formatCurrency(foodSpent, settings)} spent on canteen food and deliveries.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5">
        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Bike className="w-4 h-4 text-emerald-500" />
          <span>Green Student Tip</span>
        </span>
        <p className="text-slate-600 dark:text-slate-300">
          Riding campus bicycles or walking to class instead of taking ride-hailing cabs for 3 days a week saves approx ₹350 and cuts 4.5 kg CO2 per month!
        </p>
      </div>
    </div>
  );
};
