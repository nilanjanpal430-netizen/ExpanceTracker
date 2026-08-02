import React, { useState } from "react";
import { Users, Plus, CheckCircle2, DollarSign, Split } from "lucide-react";
import { RoommateSplit, AppSettings } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface RoommateSplitterProps {
  splits: RoommateSplit[];
  setSplits: React.Dispatch<React.SetStateAction<RoommateSplit[]>>;
  settings: AppSettings;
}

export const RoommateSplitter: React.FC<RoommateSplitterProps> = ({
  splits,
  setSplits,
  settings
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidBy, setPaidBy] = useState("Alex (You)");
  const [roommatesInput, setRoommatesInput] = useState("Alex (You), Rohan, Priya");

  const handleAddSplit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(totalAmount);
    if (isNaN(total) || total <= 0) return;

    const names = roommatesInput
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    const share = Math.round((total / names.length) * 100) / 100;

    const newSplit: RoommateSplit = {
      id: `split_${Date.now()}`,
      title: title.trim() || "Shared Expense",
      totalAmount: total,
      paidBy,
      participants: names.map((name) => ({
        name,
        shareAmount: share,
        paid: name === paidBy
      })),
      date: new Date().toISOString().split("T")[0],
      settled: false
    };

    setSplits((prev) => [newSplit, ...prev]);
    setTitle("");
    setTotalAmount("");
    setShowAddModal(false);
  };

  const toggleParticipantPaid = (splitId: string, participantName: string) => {
    setSplits((prev) =>
      prev.map((s) => {
        if (s.id === splitId) {
          const updatedParticipants = s.participants.map((p) =>
            p.name === participantName ? { ...p, paid: !p.paid } : p
          );
          const allPaid = updatedParticipants.every((p) => p.paid);
          return { ...s, participants: updatedParticipants, settled: allPaid };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Roommate & Hostel Expense Splitter</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Split hostel mess bills, room Wi-Fi, snacks, or party expenses equally
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Bill Split</span>
        </button>
      </div>

      {/* Splits List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {splits.map((split) => (
          <div
            key={split.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {formatDate(split.date)} • Paid by {split.paidBy}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {split.title}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(split.totalAmount, settings)}
                </span>
                <div className="text-[11px] text-slate-500">
                  {formatCurrency(split.participants[0]?.shareAmount || 0, settings)} / person
                </div>
              </div>
            </div>

            {/* Participants Status */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Participants & Settlement:</span>
              <div className="space-y-1.5">
                {split.participants.map((p) => (
                  <div
                    key={p.name}
                    onClick={() => toggleParticipantPaid(split.id, p.name)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${p.paid ? "text-emerald-500" : "text-slate-300"}`}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                    </div>

                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        p.paid
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {p.paid ? "Paid" : `Owes ${formatCurrency(p.shareAmount, settings)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Split Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Create Shared Expense Split</h2>
            <form onSubmit={handleAddSplit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Bill Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groceries & Room Supplies"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Total Bill Amount</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Paid By</label>
                  <input
                    type="text"
                    required
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Roommates (Comma separated)</label>
                <input
                  type="text"
                  required
                  value={roommatesInput}
                  onChange={(e) => setRoommatesInput(e.target.value)}
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
                  Split Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
