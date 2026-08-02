import React, { useState } from "react";
import { EmergencyFund, AppSettings } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { ShieldCheck, Plus, Minus, ArrowUpRight, ArrowDownLeft, Lock, Sparkles, Target } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface EmergencyFundTrackerProps {
  fund: EmergencyFund;
  setFund: React.Dispatch<React.SetStateAction<EmergencyFund>>;
  settings: AppSettings;
}

export const EmergencyFundTracker: React.FC<EmergencyFundTrackerProps> = ({
  fund,
  setFund,
  settings
}) => {
  const [showModal, setShowModal] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");

  const pct = Math.min(100, Math.round((fund.currentAmount / (fund.targetAmount || 1)) * 100));

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !showModal) return;

    const numAmt = Number(amount);
    const isDeposit = showModal === "deposit";
    const newCurrent = isDeposit
      ? fund.currentAmount + numAmt
      : Math.max(0, fund.currentAmount - numAmt);

    const newLog = {
      id: `log_${Date.now()}`,
      amount: numAmt,
      type: showModal,
      date: new Date().toISOString().split("T")[0],
      note: note || (isDeposit ? "Manual emergency deposit" : "Emergency withdrawal")
    };

    setFund((prev) => ({
      ...prev,
      currentAmount: newCurrent,
      lastUpdated: new Date().toISOString().split("T")[0],
      logs: [newLog, ...prev.logs]
    }));

    setAmount("");
    setNote("");
    setShowModal(null);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold tracking-tight">Student Emergency Fund Cushion</h3>
          </div>
          <p className="text-xs text-emerald-200/80">
            Keep a dedicated safety net for sudden medical bills, urgent travel, or unexpected book costs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowModal("deposit")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setShowModal("withdraw")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all active:scale-95"
          >
            <Minus className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Target vs Current Gauge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Target */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Target Reserve</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(fund.targetAmount, settings)}
          </div>
        </div>

        {/* Current */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold block">Current Stash</span>
          <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
            <AnimatedCounter value={fund.currentAmount} settings={settings} />
          </div>
        </div>

        {/* Progress % */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Funded Percentage</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {pct}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Safety Cushion Progress</span>
          <span>{pct}% Funded</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
              {showModal} Emergency Stash
            </h3>

            <form onSubmit={handleAction} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Amount ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  placeholder="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Scholarship bonus deposit"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
                >
                  Confirm {showModal}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
