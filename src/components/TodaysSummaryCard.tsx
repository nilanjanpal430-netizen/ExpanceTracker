import React from "react";
import { Expense, Income, Budget, SavingsGoal, AppSettings } from "../types";
import { AnimatedCounter } from "./AnimatedCounter";
import { formatCurrency } from "../utils/formatters";
import { Calendar, TrendingUp, Wallet, Target, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TodaysSummaryCardProps {
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
  goals: SavingsGoal[];
  settings: AppSettings;
}

export const TodaysSummaryCard: React.FC<TodaysSummaryCardProps> = ({
  expenses,
  incomes,
  budget,
  goals,
  settings
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  // Today's spending
  const todayExpenses = expenses.filter((e) => e.date === todayStr);
  const todaySpent = todayExpenses.reduce((acc, e) => acc + e.amount, 0);

  // This week's spending (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= sevenDaysAgo && d <= now;
  });
  const thisWeekSpent = thisWeekExpenses.reduce((acc, e) => acc + e.amount, 0);

  // Remaining monthly budget
  const totalSpentMonth = expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = Math.max(0, budget.monthlyBudget - totalSpentMonth);

  // Savings goal progress
  const totalGoalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalGoalSaved = goals.reduce((acc, g) => acc + g.savedAmount, 0);
  const goalProgressPct = totalGoalTarget > 0 ? Math.min(100, Math.round((totalGoalSaved / totalGoalTarget) * 100)) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-indigo-800/50">
      {/* Background Subtle Shapes */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-20 top-0 w-40 h-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-800/80 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">Today's Executive Snapshot</h3>
              <p className="text-[11px] text-indigo-200/80">Real-time student cashflow summary</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-800/60 text-indigo-200 border border-indigo-700/50">
            {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>

        {/* 4 Summary Metric Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Today's Spending */}
          <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-indigo-200 text-xs font-semibold mb-1">
              <span>Today's Spending</span>
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              <AnimatedCounter value={todaySpent} settings={settings} />
            </div>
            <div className="text-[11px] text-indigo-300/80 mt-1 flex items-center gap-1">
              <span>{todayExpenses.length} transactions today</span>
            </div>
          </div>

          {/* This Week's Spending */}
          <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-indigo-200 text-xs font-semibold mb-1">
              <span>This Week's Spending</span>
              <TrendingUp className="w-3.5 h-3.5 text-sky-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              <AnimatedCounter value={thisWeekSpent} settings={settings} />
            </div>
            <div className="text-[11px] text-indigo-300/80 mt-1">
              <span>Last 7 calendar days</span>
            </div>
          </div>

          {/* Remaining Monthly Budget */}
          <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-indigo-200 text-xs font-semibold mb-1">
              <span>Remaining Budget</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              <AnimatedCounter value={remainingBudget} settings={settings} />
            </div>
            <div className="text-[11px] text-indigo-300/80 mt-1">
              <span>Cap: {formatCurrency(budget.monthlyBudget, settings)}</span>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between text-indigo-200 text-xs font-semibold mb-1">
              <span>Savings Goal Progress</span>
              <Target className="w-3.5 h-3.5 text-purple-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-xl sm:text-2xl font-black text-white">
                {goalProgressPct}%
              </div>
              <span className="text-[11px] text-indigo-200">
                ({formatCurrency(totalGoalSaved, settings)})
              </span>
            </div>
            {/* Miniature progress bar */}
            <div className="w-full bg-indigo-950/80 h-1.5 rounded-full overflow-hidden mt-2 border border-indigo-700/50">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-500"
                style={{ width: `${goalProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
