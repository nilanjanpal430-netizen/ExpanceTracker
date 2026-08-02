import React, { useState } from "react";
import { Expense, Income, Budget, FeeReminder, AppSettings } from "../types";
import { Award, ShieldCheck, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

interface FinancialHealthScoreProps {
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
  feeReminders: FeeReminder[];
  settings: AppSettings;
}

export const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({
  expenses,
  incomes,
  budget,
  feeReminders,
  settings
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // 1. Budget Management Score (Max 30)
  const totalSpent = expenses.reduce((a, b) => a + b.amount, 0);
  const budgetRatio = totalSpent / (budget.monthlyBudget || 1);
  let budgetScore = 30;
  if (budgetRatio > 1) budgetScore = 10;
  else if (budgetRatio > 0.85) budgetScore = 20;
  else if (budgetRatio > 0.7) budgetScore = 26;

  // 2. Savings Rate Score (Max 30)
  const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);
  const netSavings = Math.max(0, totalIncome - totalSpent);
  const savingsRate = totalIncome > 0 ? netSavings / totalIncome : 0;
  let savingsScore = 30;
  if (savingsRate < 0.1) savingsScore = 8;
  else if (savingsRate < 0.2) savingsScore = 18;
  else if (savingsRate < 0.3) savingsScore = 25;

  // 3. Unnecessary Spending Control Score (Max 20)
  const nonEssentialSpent = expenses
    .filter((e) => ["Shopping", "Entertainment", "Others"].includes(e.category))
    .reduce((a, b) => a + b.amount, 0);
  const nonEssentialRatio = totalSpent > 0 ? nonEssentialSpent / totalSpent : 0;
  let spendingScore = 20;
  if (nonEssentialRatio > 0.4) spendingScore = 8;
  else if (nonEssentialRatio > 0.25) spendingScore = 14;

  // 4. Bill Payment History Score (Max 20)
  const totalBills = feeReminders.length;
  const paidBills = feeReminders.filter((f) => f.isPaid).length;
  const billRatio = totalBills > 0 ? paidBills / totalBills : 1;
  const billScore = Math.round(billRatio * 20);

  const totalScore = Math.min(100, budgetScore + savingsScore + spendingScore + billScore);

  let statusText = "Needs Work";
  let statusBg = "bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400";
  if (totalScore >= 80) {
    statusText = "Excellent";
    statusBg = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400";
  } else if (totalScore >= 65) {
    statusText = "Good Financial Health";
    statusBg = "bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:text-indigo-400";
  } else if (totalScore >= 50) {
    statusText = "Fair";
    statusBg = "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400";
  }

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Financial Health Score</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                AI Evaluated
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">4 key pillars of student fiscal health</p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalScore}<span className="text-sm text-slate-400 font-bold">/100</span>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${statusBg}`}>
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Gauge */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              totalScore >= 80
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : totalScore >= 65
                ? "bg-gradient-to-r from-indigo-500 to-blue-400"
                : "bg-gradient-to-r from-amber-500 to-rose-400"
            }`}
            style={{ width: `${totalScore}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>0 (Critical)</span>
          <span>50 (Fair)</span>
          <span>80+ (Excellent)</span>
        </div>
      </div>

      {/* Breakdown Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <span>{showDetails ? "Hide Score Breakdown" : "View Detailed 4-Pillar Score Breakdown"}</span>
        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          {/* Pillar 1: Budget Management */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Budget Management</span>
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{budgetScore}/30</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Spent {formatCurrency(totalSpent, settings)} of {formatCurrency(budget.monthlyBudget, settings)} cap ({Math.round(budgetRatio * 100)}%).
            </p>
          </div>

          {/* Pillar 2: Savings Rate */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Savings Rate</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{savingsScore}/30</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Saved {formatCurrency(netSavings, settings)} ({Math.round(savingsRate * 100)}% of total income).
            </p>
          </div>

          {/* Pillar 3: Unnecessary Spending */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Discretionary Spending</span>
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">{spendingScore}/20</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Shopping & entertainment represents {Math.round(nonEssentialRatio * 100)}% of total spending.
            </p>
          </div>

          {/* Pillar 4: Bill Payment History */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Bill Payment History</span>
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-extrabold">{billScore}/20</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {paidBills} of {totalBills} campus fees and bills marked as paid.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
