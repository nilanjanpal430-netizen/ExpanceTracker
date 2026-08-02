import React, { useState } from "react";
import { SubscriptionItem, AppSettings } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { CreditCard, Calendar, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Pause, Play } from "lucide-react";
import { CategoryIcon, getCategoryStyles } from "./CategoryBadge";

interface SubscriptionTrackerProps {
  subscriptions: SubscriptionItem[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionItem[]>>;
  settings: AppSettings;
}

export const SubscriptionTracker: React.FC<SubscriptionTrackerProps> = ({
  subscriptions,
  setSubscriptions,
  settings
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("Entertainment");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Yearly" | "Weekly">("Monthly");

  const totalMonthly = subscriptions
    .filter((s) => s.status === "Active")
    .reduce((acc, s) => {
      if (s.billingCycle === "Monthly") return acc + s.amount;
      if (s.billingCycle === "Yearly") return acc + Math.round(s.amount / 12);
      if (s.billingCycle === "Weekly") return acc + s.amount * 4;
      return acc + s.amount;
    }, 0);

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !nextPaymentDate) return;

    const newSub: SubscriptionItem = {
      id: `sub_${Date.now()}`,
      name,
      amount: Number(amount),
      billingCycle,
      nextPaymentDate,
      category,
      status: "Active",
      autoRenew: true
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    setName("");
    setAmount("");
    setNextPaymentDate("");
    setShowAddModal(false);
  };

  const toggleStatus = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "Active" ? "Paused" : "Active" } : s))
    );
  };

  const handleDelete = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const getDaysRemaining = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-800/80 text-violet-200">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">Recurring Subscriptions Tracker</h2>
          </div>
          <p className="text-xs text-indigo-200/80">
            Never get surprised by auto-debits for Netflix, Spotify, ChatGPT, or mobile recharge packs.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right">
            <span className="text-[10px] uppercase tracking-widest text-indigo-200 font-bold block">Monthly Total</span>
            <span className="text-xl font-black text-white">{formatCurrency(totalMonthly, settings)}</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const daysLeft = getDaysRemaining(sub.nextPaymentDate);
          let daysBadge = `${daysLeft} days left`;
          let daysColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
          if (daysLeft < 0) {
            daysBadge = "Overdue";
            daysColor = "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold";
          } else if (daysLeft <= 3) {
            daysBadge = `Due in ${daysLeft} days!`;
            daysColor = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold";
          }

          return (
            <div
              key={sub.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                sub.status === "Paused"
                  ? "border-slate-200 dark:border-slate-800 opacity-60"
                  : "border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${getCategoryStyles(sub.category)}`}>
                    <CategoryIcon category={sub.category} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{sub.name}</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {sub.billingCycle} • {sub.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  title="Remove Subscription"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Price</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(sub.amount, settings)}
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] ${daysColor}`}>
                    {daysBadge}
                  </span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" />
                    <span>Next: {formatDate(sub.nextPaymentDate)}</span>
                  </div>
                </div>
              </div>

              {/* Status Action */}
              <div className="mt-3 flex items-center justify-between text-xs font-semibold pt-2 border-t border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Auto-Renew: <strong className="text-slate-800 dark:text-slate-200">{sub.autoRenew ? "Enabled" : "Off"}</strong>
                </span>

                <button
                  onClick={() => toggleStatus(sub.id)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all ${
                    sub.status === "Active"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100"
                  }`}
                >
                  {sub.status === "Active" ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Recurring Subscription</h3>

            <form onSubmit={handleAddSub} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Subscription Name</label>
                <input
                  type="text"
                  placeholder="e.g., Netflix Student, Spotify, ChatGPT"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="199"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Billing Cycle</label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Next Payment Date</label>
                <input
                  type="date"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
