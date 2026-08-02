import React from "react";
import { Sparkles, Plus, Mic, ArrowRight, ShieldCheck, Wallet, PieChart } from "lucide-react";

interface OnboardingBannerProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onVoiceInput: () => void;
  onSetBudget: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  onAddIncome,
  onAddExpense,
  onVoiceInput,
  onSetBudget
}) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden border border-indigo-800/60 space-y-6">
      {/* Background Decorative Rings */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>New Account Started</span>
        </span>
        <span className="text-xs text-indigo-200/80 font-semibold">ScholarSpend Ready</span>
      </div>

      {/* Main Required Onboarding Heading & Message */}
      <div className="space-y-2 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Welcome to ScholarSpend!
        </h2>
        <p className="text-base sm:text-lg font-medium text-indigo-100 leading-relaxed">
          Welcome to ScholarSpend! Add your first income or expense to begin managing your finances.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={onAddIncome}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add First Income</span>
        </button>

        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add First Expense</span>
        </button>

        <button
          onClick={onVoiceInput}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all active:scale-95"
        >
          <Mic className="w-4 h-4 text-indigo-400" />
          <span>Voice Expense Log</span>
        </button>

        <button
          onClick={onSetBudget}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 text-slate-200 border border-indigo-700/60 font-semibold text-xs sm:text-sm transition-all"
        >
          <span>Set Monthly Budget</span>
          <ArrowRight className="w-4 h-4 text-indigo-400" />
        </button>
      </div>

      {/* 3 Quick Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-indigo-800/40">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Wallet className="w-4 h-4" />
            <span>1. Income Allowance</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Log pocket money, scholarships, or freelance income to establish your working budget.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Plus className="w-4 h-4" />
            <span>2. Log Daily Expenses</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Track hostel, canteen food, books, or transport spending with receipt OCR or voice.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <PieChart className="w-4 h-4" />
            <span>3. AI Insights</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Get personalized Financial Health Scores, Sunday reports, and budget safety alerts.
          </p>
        </div>
      </div>
    </div>
  );
};
