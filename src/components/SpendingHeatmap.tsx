import React from "react";
import { Expense, AppSettings } from "../types";
import { formatCurrency } from "../utils/formatters";
import { Calendar, Flame, Layers } from "lucide-react";

interface SpendingHeatmapProps {
  expenses: Expense[];
  settings: AppSettings;
}

export const SpendingHeatmap: React.FC<SpendingHeatmapProps> = ({ expenses, settings }) => {
  // Map spending amount by date YYYY-MM-DD
  const dailyTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  // Find max spending day value
  const maxVal = Math.max(...Object.values(dailyTotals), 1);

  // Generate 30 calendar days leading up to today
  const today = new Date();
  const daysList: { dateStr: string; dayNum: number; monthName: string; amount: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const amount = dailyTotals[dateStr] || 0;
    daysList.push({
      dateStr,
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("en-IN", { month: "short" }),
      amount
    });
  }

  // Get intensity color class
  const getIntensityColor = (amt: number) => {
    if (amt === 0) return "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700/60";
    const ratio = amt / maxVal;
    if (ratio > 0.6) return "bg-rose-500 text-white font-extrabold shadow-sm shadow-rose-500/30 border-rose-600";
    if (ratio > 0.3) return "bg-amber-500 text-white font-extrabold shadow-xs border-amber-600";
    return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-semibold border-amber-200 dark:border-amber-800/80";
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-xs">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">30-Day Spending Intensity Heatmap</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Spot high-expenditure days at a glance</p>
          </div>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 inline-block" />
            <span>₹0</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Moderate</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>High</span>
          </span>
        </div>
      </div>

      {/* Grid of 30 Day Blocks */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 pt-2">
        {daysList.map((day) => (
          <div
            key={day.dateStr}
            className={`p-2 rounded-2xl border text-center transition-all hover:scale-105 cursor-pointer relative group ${getIntensityColor(
              day.amount
            )}`}
          >
            <span className="text-[10px] uppercase block opacity-80">{day.monthName}</span>
            <span className="text-xs font-black block leading-none">{day.dayNum}</span>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-32 p-2 rounded-xl bg-slate-900 text-white text-[11px] shadow-xl text-center pointer-events-none">
              <span className="block font-bold">{day.dateStr}</span>
              <span className="block text-amber-300 font-extrabold">{formatCurrency(day.amount, settings)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
