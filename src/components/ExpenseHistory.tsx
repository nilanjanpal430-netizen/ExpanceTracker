import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Trash2,
  Edit2,
  Eye,
  ArrowUpDown,
  Download,
  Receipt,
  X,
  CreditCard,
  Tag,
  Layers
} from "lucide-react";
import { Expense, ExpenseCategory, AppSettings } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { CategoryBadge, CategoryIcon, getCategoryStyles } from "./CategoryBadge";

interface ExpenseHistoryProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  settings: AppSettings;
}

const CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Transport",
  "Hostel",
  "Rent",
  "Shopping",
  "Stationery",
  "Mobile Recharge",
  "College Fees",
  "Internet",
  "Entertainment",
  "Health",
  "Books",
  "Others"
];

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({
  expenses,
  onDeleteExpense,
  settings
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [timeFilter, setTimeFilter] = useState<
    "All" | "Today" | "Yesterday" | "This Week" | "This Month" | "Last Month"
  >("All");
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>("All");
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // Filter Logic
  const filteredExpenses = expenses.filter((e) => {
    // Search matching title, category, notes
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.notes || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Category match
    if (selectedCategory !== "All" && e.category !== selectedCategory) {
      return false;
    }

    // Payment mode match
    if (paymentModeFilter !== "All" && e.paymentMethod !== paymentModeFilter) {
      return false;
    }

    // Time filter
    const expDate = new Date(e.date);
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    if (timeFilter === "Today") {
      return e.date === todayStr;
    } else if (timeFilter === "Yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return e.date === yesterday.toISOString().split("T")[0];
    } else if (timeFilter === "This Week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return expDate >= weekAgo;
    } else if (timeFilter === "This Month") {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    } else if (timeFilter === "Last Month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
    }

    return true;
  });

  const totalFilteredSum = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <span>Expense History & Transaction Records</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, filter, and inspect all student transaction records
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 flex items-center gap-2 text-xs">
          <span className="text-indigo-600 dark:text-indigo-300 font-medium">Filtered Total:</span>
          <span className="font-extrabold text-sm text-indigo-700 dark:text-indigo-200">
            {formatCurrency(totalFilteredSum, settings)}
          </span>
          <span className="text-slate-400">({filteredExpenses.length} entries)</span>
        </div>
      </div>

      {/* Filter Controls Panel */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Quick Category Filter Pills Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick Category Filter</span>
            </span>
            {selectedCategory !== "All" && (
              <button
                onClick={() => setSelectedCategory("All")}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scrollbar-none">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedCategory === "All"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 transition-all active:scale-95`}
                >
                  <CategoryBadge
                    category={cat}
                    size="md"
                    className={
                      isSelected
                        ? "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 font-extrabold shadow-xs"
                        : "opacity-80 hover:opacity-100"
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search expenses by name, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Time Filter */}
          <div>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="All">Time: All Time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>

          {/* Category Filter Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="All">Category: All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode Filter */}
          <div>
            <select
              value={paymentModeFilter}
              onChange={(e) => setPaymentModeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="All">Payment Mode: All Modes</option>
              <option value="UPI">UPI / GPay / Paytm</option>
              <option value="Cash">Cash</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="Bank Transfer">Bank Net Banking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="p-4">Title & Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment Mode</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    No expense records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${getCategoryStyles(exp.category)}`}>
                          <CategoryIcon category={exp.category} className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 dark:text-white font-bold">{exp.title}</span>
                          {exp.receiptImage && (
                            <button
                              onClick={() => setSelectedReceiptUrl(exp.receiptImage || null)}
                              className="p-1 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 hover:bg-indigo-100"
                              title="View Receipt Image"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <CategoryBadge category={exp.category} size="md" />
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-400">{formatDate(exp.date)}</td>

                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {exp.paymentMethod || "UPI"}
                    </td>

                    <td className="p-4 text-slate-500 max-w-[200px] truncate">
                      {exp.notes || "-"}
                    </td>

                    <td className="p-4 text-right font-black text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount, settings)}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Receipt Image Record</h3>
              <button onClick={() => setSelectedReceiptUrl(null)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedReceiptUrl} alt="Receipt Full" className="w-full max-h-[70vh] object-contain rounded-xl border" />
          </div>
        </div>
      )}
    </div>
  );
};
