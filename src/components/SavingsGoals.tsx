import React, { useState } from "react";
import {
  PiggyBank,
  Plus,
  Target,
  Trophy,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";
import { SavingsGoal, AppSettings } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  setGoals: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
  settings: AppSettings;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  setGoals,
  settings
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const saved = parseFloat(savedAmount) || 0;
    if (isNaN(target) || target <= 0) return;

    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}`,
      goalName: goalName.trim() || "New Savings Goal",
      targetAmount: target,
      savedAmount: saved,
      targetDate
    };

    setGoals((prev) => [...prev, newGoal]);
    setGoalName("");
    setTargetAmount("");
    setSavedAmount("");
    setShowAddModal(false);

    if (saved >= target) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(contributeAmount);
    if (isNaN(amt) || amt <= 0 || !contributeGoalId) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === contributeGoalId) {
          const newSaved = g.savedAmount + amt;
          if (newSaved >= g.targetAmount && g.savedAmount < g.targetAmount) {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
          }
          return { ...g, savedAmount: newSaved };
        }
        return g;
      })
    );

    setContributeAmount("");
    setContributeGoalId(null);
  };

  const totalTargetSum = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSavedSum = goals.reduce((acc, g) => acc + g.savedAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-indigo-600" />
            <span>Student Savings Goals & Milestones</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set target funds for laptop, emergency cash, or semester trips
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Target</span>
        </button>
      </div>

      {/* Gamification Badges Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-200 animate-bounce" />
          <div>
            <h2 className="text-base font-bold">Student Saver Gamification Badges</h2>
            <p className="text-xs text-amber-100">Earn badges by staying disciplined and reaching savings targets</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-300 shrink-0" />
            <div>
              <div className="font-bold">Budget Boss</div>
              <div className="text-[10px] text-amber-100">Under budget 3 months</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-300 shrink-0" />
            <div>
              <div className="font-bold">Frugal Master</div>
              <div className="text-[10px] text-amber-100">Saved ₹5,000+ total</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-300 shrink-0" />
            <div>
              <div className="font-bold">Laptop Fund</div>
              <div className="text-[10px] text-amber-100">40% progress hit</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-300 shrink-0" />
            <div>
              <div className="font-bold">Emergency Safe</div>
              <div className="text-[10px] text-amber-100">Emergency fund ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.savedAmount / (goal.targetAmount || 1)) * 100));
          const isComplete = goal.savedAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 relative overflow-hidden"
            >
              {isComplete && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Goal Reached!</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                  {goal.category || "Target"}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {goal.goalName}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Progress</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{pct}%</span>
                </div>

                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-600 to-blue-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Saved: {formatCurrency(goal.savedAmount, settings)}</span>
                  <span>Target: {formatCurrency(goal.targetAmount, settings)}</span>
                </div>
              </div>

              {goal.targetDate && (
                <div className="text-[11px] text-slate-400">
                  Target Deadline: {formatDate(goal.targetDate)}
                </div>
              )}

              <button
                onClick={() => setContributeGoalId(goal.id)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs transition-all active:scale-95"
              >
                + Add Savings Contribution
              </button>
            </div>
          );
        })}
      </div>

      {/* Add New Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Savings Target</h2>
            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buy Laptop, Semester Trip"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Target Amount</label>
                  <input
                    type="number"
                    required
                    placeholder="60000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Already Saved</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={savedAmount}
                    onChange={(e) => setSavedAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {contributeGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Savings Contribution</h2>
            <form onSubmit={handleContribute} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Amount to Deposit ({settings.currencySymbol})</label>
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setContributeGoalId(null)}
                  className="px-4 py-2 rounded-xl border text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Deposit Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
