import React, { useState } from "react";
import { CalendarDays, Plus, CheckCircle2, AlertCircle, Clock, GraduationCap } from "lucide-react";
import { FeeReminder, AppSettings } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface FeeRemindersCalendarProps {
  reminders: FeeReminder[];
  setReminders: React.Dispatch<React.SetStateAction<FeeReminder[]>>;
  settings: AppSettings;
}

export const FeeRemindersCalendar: React.FC<FeeRemindersCalendarProps> = ({
  reminders,
  setReminders,
  settings
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"College Fee" | "Hostel Rent" | "Scholarship Credit" | "Exam Fee">("College Fee");

  const handleAddFee = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    const newReminder: FeeReminder = {
      id: `fee_${Date.now()}`,
      title: title.trim() || "College Fee Deadline",
      amount: amt,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      type,
      isPaid: false
    };

    setReminders((prev) => [...prev, newReminder]);
    setTitle("");
    setAmount("");
    setShowAddModal(false);
  };

  const togglePaid = (id: string) => {
    setReminders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isPaid: !f.isPaid } : f))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Scholarship & Semester Fee Payment Calendar</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Never miss college tuition deadlines, hostel rent due dates, or scholarship credits
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fee Deadline</span>
        </button>
      </div>

      {/* Fee List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((fee) => {
          const due = new Date(fee.dueDate);
          const now = new Date();
          const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
          const isOverdue = daysLeft < 0 && !fee.isPaid;

          return (
            <div
              key={fee.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-4 relative ${
                isOverdue
                  ? "border-rose-300 dark:border-rose-900"
                  : "border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {fee.type}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {fee.title}
                  </h3>
                </div>

                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {formatCurrency(fee.amount, settings)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Due: {formatDate(fee.dueDate)}</span>
                </div>

                <button
                  onClick={() => togglePaid(fee.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    fee.isPaid
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : isOverdue
                      ? "bg-rose-600 text-white"
                      : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
                  }`}
                >
                  {fee.isPaid ? "✓ Marked Paid" : isOverdue ? "Overdue!" : `${daysLeft} days left`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Semester Fee Deadline</h2>
            <form onSubmit={handleAddFee} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Fee Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semester 5 Tuition Fee"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Amount</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="College Fee">College Fee</option>
                  <option value="Hostel Rent">Hostel Rent</option>
                  <option value="Scholarship Credit">Scholarship Credit</option>
                  <option value="Exam Fee">Exam Fee</option>
                </select>
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
