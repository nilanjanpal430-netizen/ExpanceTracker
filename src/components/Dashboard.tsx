import React, { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Camera,
  AlertTriangle,
  Receipt,
  Download,
  CloudCheck,
  ChevronRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Target,
  Zap,
  Flame,
  CreditCard,
  Tag,
  ShieldCheck,
  BookOpen,
  Trophy,
  FileText
} from "lucide-react";
import { Expense, Income, Budget, SavingsGoal, AppSettings, UserProfile, AIInsightsResponse, FeeReminder } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { CategoryBadge, CategoryIcon, getCategoryStyles } from "./CategoryBadge";
import { AnimatedCounter } from "./AnimatedCounter";
import { TodaysSummaryCard } from "./TodaysSummaryCard";
import { FinancialHealthScore } from "./FinancialHealthScore";
import { AIWeeklyReport } from "./AIWeeklyReport";
import { OnboardingBanner } from "./OnboardingBanner";

interface DashboardProps {
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
  goals: SavingsGoal[];
  settings: AppSettings;
  profile: UserProfile;
  feeReminders?: FeeReminder[];
  onOpenAddModal: (initialType?: "Expense" | "Income") => void;
  onOpenReceiptScan: () => void;
  setActiveTab: (tab: string) => void;
  onCloudSync: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  incomes,
  budget,
  goals,
  settings,
  profile,
  feeReminders = [],
  onOpenAddModal,
  onOpenReceiptScan,
  setActiveTab,
  onCloudSync
}) => {
  const [aiInsights, setAiInsights] = useState<AIInsightsResponse | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Totals calculations
  const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  // Monthly Budget calculations
  const monthlySpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = Math.max(0, budget.monthlyBudget - monthlySpent);
  const budgetPercentage = Math.min(100, Math.round((monthlySpent / (budget.monthlyBudget || 1)) * 100));

  // Expense Prediction: Predict month-end spending based on current daily pace
  const currentDayOfMonth = new Date().getDate();
  const totalDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dailyPace = monthlySpent / (currentDayOfMonth || 1);
  const predictedMonthEnd = Math.round(dailyPace * totalDaysInMonth);

  // Goal Countdown calculations
  const goalItem = goals[0] || null;
  const goalNeedMore = goalItem ? Math.max(0, goalItem.targetAmount - goalItem.savedAmount) : 0;
  const daysLeft = goalItem && goalItem.targetDate
    ? Math.max(
        1,
        Math.ceil((new Date(goalItem.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  // Category breakdown top categories
  const categoryTotals = expenses.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 4);

  // Fetch AI Insights
  const fetchAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenses,
          income: incomes,
          budget: budget.monthlyBudget,
          currencySymbol: settings.currencySymbol
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsights(data);
      }
    } catch (err) {
      console.warn("AI insights offline, falling back:", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, [expenses.length, incomes.length, budget.monthlyBudget]);

  return (
    <div className="space-y-6 pb-12">
      {/* Onboarding Banner for New Users */}
      {expenses.length === 0 && incomes.length === 0 && (
        <OnboardingBanner
          onAddIncome={() => onOpenAddModal("Income")}
          onAddExpense={() => onOpenAddModal("Expense")}
          onVoiceInput={() => setActiveTab("voice")}
          onSetBudget={() => setActiveTab("forecast")}
        />
      )}

      {/* 1. Today's Executive Summary Card at Top */}
      <TodaysSummaryCard
        expenses={expenses}
        incomes={incomes}
        budget={budget}
        goals={goals}
        settings={settings}
      />

      {/* 2. Top Banner Row: Financial Health Score & AI Weekly Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FinancialHealthScore
          expenses={expenses}
          incomes={incomes}
          budget={budget}
          feeReminders={feeReminders}
          settings={settings}
        />
        <AIWeeklyReport
          expenses={expenses}
          incomes={incomes}
          budget={budget}
          settings={settings}
        />
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {/* Bento Hero Box: Balance & Welcome (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900 dark:bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between border border-slate-800">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60">👋 Student Workspace</span>
              <span>•</span>
              <span className="text-slate-300">{profile.college || "University Student"}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {profile.name || "Student"}!
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              You are currently <span className="text-emerald-400 font-bold">{Math.max(0, 100 - budgetPercentage)}% under budget</span> for this month. Here is your live financial snapshot.
            </p>

            <div className="pt-2 flex flex-wrap items-baseline gap-3">
              <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Current Balance</span>
              <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                <AnimatedCounter value={currentBalance} settings={settings} />
              </span>
            </div>
          </div>

          {/* Quick Actions Row inside Hero */}
          <div className="flex flex-wrap items-center gap-2.5 pt-6 mt-4 border-t border-slate-800 relative z-10">
            <button
              onClick={() => onOpenAddModal("Expense")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>

            <button
              onClick={() => onOpenAddModal("Income")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income</span>
            </button>

            <button
              onClick={onOpenReceiptScan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
              title="Scan physical receipt with Gemini AI OCR"
            >
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>Scan Receipt</span>
            </button>

            <button
              onClick={onCloudSync}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors ml-auto"
              title="Sync with Cloud Backup"
            >
              <CloudCheck className="w-4 h-4 text-sky-400" />
            </button>
          </div>
        </div>

        {/* Bento Box: Expense Prediction & Goal Countdown (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Expense Prediction Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Zap className="w-4 h-4" />
                <span>Month-End Expense Prediction</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(predictedMonthEnd, settings)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
              At your current pace, you'll spend approximately <strong>{formatCurrency(predictedMonthEnd, settings)}</strong> this month.
            </p>
          </div>

          {/* Goal Countdown Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xs space-y-2 border border-indigo-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-300" />
                <span>Goal Countdown</span>
              </span>
              {goalItem && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px]">
                  {daysLeft} days left
                </span>
              )}
            </div>

            {goalItem ? (
              <>
                <div className="flex items-baseline justify-between pt-1">
                  <h4 className="font-extrabold text-sm text-white">{goalItem.goalName}</h4>
                  <span className="text-xs font-black text-amber-300">{formatCurrency(goalItem.targetAmount, settings)}</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-white/10 text-xs font-semibold text-indigo-200 flex items-center justify-between">
                  <span>Need {formatCurrency(goalNeedMore, settings)} more</span>
                  <span className="text-white font-bold">{daysLeft} days remaining</span>
                </div>
              </>
            ) : (
              <div className="py-3 text-center space-y-2">
                <p className="text-xs text-indigo-200">No active savings goals yet.</p>
                <button
                  onClick={() => setActiveTab("goals")}
                  className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-xs"
                >
                  + Add Savings Goal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Quick Navigation Hub Grid */}
        <div className="col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition-all text-left space-y-1 shadow-2xs group"
          >
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Subscriptions</h4>
            <span className="text-[10px] text-slate-400 block">Netflix, Spotify & recharge</span>
          </button>

          <button
            onClick={() => setActiveTab("student-hub")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition-all text-left space-y-1 shadow-2xs group"
          >
            <Tag className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Student Discounts</h4>
            <span className="text-[10px] text-slate-400 block">Cafes, books & printouts</span>
          </button>

          <button
            onClick={() => setActiveTab("challenges")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition-all text-left space-y-1 shadow-2xs group"
          >
            <Flame className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Smart Challenges</h4>
            <span className="text-[10px] text-slate-400 block">No food delivery, save ₹100</span>
          </button>

          <button
            onClick={() => setActiveTab("emergency")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition-all text-left space-y-1 shadow-2xs group"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Emergency Fund</h4>
            <span className="text-[10px] text-slate-400 block">Safety cushion reserve</span>
          </button>

          <button
            onClick={() => setActiveTab("learning")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition-all text-left space-y-1 shadow-2xs group"
          >
            <BookOpen className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Finance Academy</h4>
            <span className="text-[10px] text-slate-400 block">Lessons & quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition-all text-left space-y-1 shadow-2xs group"
          >
            <Trophy className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Leaderboard</h4>
            <span className="text-[10px] text-slate-400 block">Savings with friends</span>
          </button>
        </div>

        {/* Recent Expense History (7 Cols) */}
        <div className="col-span-12 lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" />
                <span>Recent Expense History</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest transactions logged by you</p>
            </div>

            <button
              onClick={() => setActiveTab("history")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No expenses logged yet</p>
              <button
                onClick={() => onOpenAddModal("Expense")}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                + Log First Expense
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {expenses.slice(0, 6).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${getCategoryStyles(item.category)}`}>
                      <CategoryIcon category={item.category} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <CategoryBadge category={item.category} size="sm" />
                        <span>•</span>
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-xs sm:text-sm text-rose-600 dark:text-rose-400">
                      -{formatCurrency(item.amount, settings)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Categories & Goals (5 Cols) */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Expenses by Category</h3>

            {sortedCategories.length === 0 ? (
              <div className="py-8 text-center text-xs font-medium text-slate-400">
                Category spending will appear here as you log expenses.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedCategories.map(([cat, amount]) => {
                  const numAmt = Number(amount);
                  const pct = Math.round((numAmt / (totalExpense || 1)) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{cat}</span>
                        <span>{formatCurrency(numAmt, settings)} ({pct}%)</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

