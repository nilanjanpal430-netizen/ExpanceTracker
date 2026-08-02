import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { Budget, Expense, AppSettings, AIForecastResponse } from "../types";
import { formatCurrency } from "../utils/formatters";

interface BudgetForecastToolProps {
  budget: Budget;
  setBudget: React.Dispatch<React.SetStateAction<Budget>>;
  expenses: Expense[];
  settings: AppSettings;
}

export const BudgetForecastTool: React.FC<BudgetForecastToolProps> = ({
  budget,
  setBudget,
  expenses,
  settings
}) => {
  const [forecast, setForecast] = useState<AIForecastResponse | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [editBudgetInput, setEditBudgetInput] = useState(budget.monthlyBudget.toString());

  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Current month total spent
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Category spent map
  const categorySpentMap = expenses.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  // Fetch AI Forecast
  const fetchForecast = async () => {
    setLoadingForecast(true);
    try {
      const res = await fetch("/api/ai/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenses,
          budget: budget.monthlyBudget,
          dayOfMonth,
          totalDaysInMonth: daysInMonth,
          currencySymbol: settings.currencySymbol
        })
      });

      if (res.ok) {
        const data = await res.json();
        setForecast(data);
      }
    } catch (err) {
      console.warn("Forecast offline, using fallback calculation:", err);
    } finally {
      setLoadingForecast(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [budget.monthlyBudget, expenses.length]);

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(editBudgetInput);
    if (!isNaN(val) && val > 0) {
      setBudget((prev) => ({ ...prev, monthlyBudget: val }));
    }
  };

  const handleCategoryBudgetChange = (cat: string, value: number) => {
    setBudget((prev) => ({
      ...prev,
      categoryBudgets: {
        ...prev.categoryBudgets,
        [cat]: value
      }
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Monthly Budget & AI Forecast Engine</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set monthly budget caps & predict month-end expenses with AI spending velocity models
          </p>
        </div>

        {/* Set Budget Form */}
        <form onSubmit={handleUpdateBudget} className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">
              {settings.currencySymbol}
            </span>
            <input
              type="number"
              value={editBudgetInput}
              onChange={(e) => setEditBudgetInput(e.target.value)}
              className="pl-7 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs w-32 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
          >
            Update Budget
          </button>
        </form>
      </div>

      {/* AI Forecast Insight Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Gemini AI Budget Forecast</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-200 font-semibold border border-indigo-700">
                  Day {dayOfMonth} of {daysInMonth}
                </span>
              </h2>
              <p className="text-xs text-indigo-200">
                Predictive spending model based on your daily rate ({formatCurrency(Math.round(totalSpent / (dayOfMonth || 1)), settings)} / day)
              </p>
            </div>
          </div>

          <button
            onClick={fetchForecast}
            disabled={loadingForecast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingForecast ? "animate-spin" : ""}`} />
            <span>Re-run Forecast</span>
          </button>
        </div>

        {/* Forecast Stats Cards Grid */}
        {loadingForecast ? (
          <div className="py-12 flex items-center justify-center text-xs text-indigo-200 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
            <span>Calculating velocity and forecasting month-end expenditure...</span>
          </div>
        ) : forecast ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Predicted Month-End Total</span>
                <div className="text-2xl font-black text-white mt-1">
                  {formatCurrency(forecast.predictedMonthTotal, settings)}
                </div>
                <span className="text-[10px] text-indigo-300 mt-1 block">
                  Target Budget: {formatCurrency(budget.monthlyBudget, settings)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Risk Assessment</span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-lg font-black ${
                      forecast.riskLevel.includes("Safe")
                        ? "text-emerald-400"
                        : forecast.riskLevel.includes("Moderate")
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {forecast.riskLevel}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Based on velocity
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Suggested Daily Limit</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {formatCurrency(forecast.recommendedDailyLimit, settings)} / day
                </div>
                <span className="text-[10px] text-slate-300 mt-1 block">
                  For remaining {daysInMonth - dayOfMonth + 1} days
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>AI Action Plan to Stay Under Budget:</span>
              </div>
              <p className="text-slate-300">{forecast.summaryText}</p>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                {forecast.recommendations?.map((rec, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/50 text-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-xs text-indigo-300">
            Click "Re-run Forecast" to query Gemini AI for personalized budget projections.
          </div>
        )}
      </div>

      {/* Category Budget Allocation Caps */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Category Budget Limits & Spending Progress</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Set individual category spending caps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(budget.categoryBudgets).map(([cat, limit]) => {
            const numLimit = Number(limit);
            const spent = categorySpentMap[cat] || 0;
            const pct = Math.min(100, Math.round((spent / (numLimit || 1)) * 100));
            const isOver = spent > numLimit;

            return (
              <div key={cat} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{cat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Cap:</span>
                    <input
                      type="number"
                      value={numLimit}
                      onChange={(e) => handleCategoryBudgetChange(cat, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-bold text-right text-xs bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOver ? "bg-rose-500" : pct > 80 ? "bg-amber-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Spent: {formatCurrency(spent, settings)}</span>
                  <span className={isOver ? "text-rose-600 font-bold" : "text-emerald-600"}>
                    {isOver ? `Over by ${formatCurrency(spent - numLimit, settings)}` : `${formatCurrency(numLimit - spent, settings)} left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
