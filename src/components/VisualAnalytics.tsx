import React, { useState } from "react";
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Calendar,
  Filter,
  ArrowUpRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import { Expense, Income, AppSettings } from "../types";
import { formatCurrency } from "../utils/formatters";
import { AnimatedCounter } from "./AnimatedCounter";

interface VisualAnalyticsProps {
  expenses: Expense[];
  incomes: Income[];
  settings: AppSettings;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#3b82f6", // blue
  Transport: "#10b981", // emerald
  Hostel: "#8b5cf6", // violet
  Rent: "#6366f1", // indigo
  Shopping: "#ec4899", // pink
  Stationery: "#f59e0b", // amber
  "Mobile Recharge": "#06b6d4", // cyan
  "College Fees": "#ef4444", // red
  Internet: "#14b8a6", // teal
  Entertainment: "#a855f7", // purple
  Health: "#f97316", // orange
  Books: "#84cc16", // lime
  Others: "#64748b" // slate
};

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({
  expenses,
  incomes,
  settings
}) => {
  const [timeFilter, setTimeFilter] = useState<"This Month" | "Last Month" | "All Time">("This Month");

  // Filter expenses by date
  const filteredExpenses = expenses.filter((e) => {
    const eDate = new Date(e.date);
    const now = new Date();
    if (timeFilter === "This Month") {
      return eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear();
    } else if (timeFilter === "Last Month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return eDate.getMonth() === lastMonth && eDate.getFullYear() === lastMonthYear;
    }
    return true;
  });

  const totalExpenseAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  // Category Pie Data
  const categoryTotals = filteredExpenses.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => {
    const numValue = Number(value);
    return {
      name,
      value: numValue,
      percentage: Math.round((numValue / (totalExpenseAmount || 1)) * 100)
    };
  });

  // Monthly Bar Chart Data (Jan - Aug)
  const monthlyDataMap: Record<string, number> = {
    Jan: 4500,
    Feb: 6100,
    Mar: 3900,
    Apr: 5200,
    May: 4800,
    Jun: 5900,
    Jul: 7100,
    Aug: totalExpenseAmount || 6200
  };

  const barData = Object.entries(monthlyDataMap).map(([month, amount]) => ({
    month,
    Expense: amount,
    Budget: 8000
  }));

  // Expense Trend Line Data (Day by Day)
  const sortedByDate = [...filteredExpenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const lineData = sortedByDate.slice(-10).map((e) => ({
    date: e.date.split("-").slice(1).join("/"),
    amount: e.amount,
    title: e.title
  }));

  // Top spending item
  const highestExpenseItem = [...filteredExpenses].sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Analytics Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Visual Analytics & Spending Breakdown</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive charts and spending distribution stats
          </p>
        </div>

        {/* Timeframe Filter Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-semibold">
          {(["This Month", "Last Month", "All Time"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                timeFilter === filter
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 shadow-xs">
          <span className="text-xs text-indigo-600 dark:text-indigo-300 font-bold uppercase tracking-wider">
            Total Analyzed Expenses
          </span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-indigo-100 mt-1">
            <AnimatedCounter value={totalExpenseAmount} settings={settings} />
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 block font-medium">
            {filteredExpenses.length} transactions logged
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 shadow-xs">
          <span className="text-xs text-purple-600 dark:text-purple-300 font-bold uppercase tracking-wider">
            Top Category
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-950 dark:text-purple-100 mt-1">
            {pieData[0]?.name || "N/A"}
          </div>
          <span className="text-xs text-purple-600 dark:text-purple-400 mt-1 block font-medium">
            {pieData[0] ? <AnimatedCounter value={pieData[0].value} settings={settings} /> : "0"} ({pieData[0]?.percentage || 0}%)
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 shadow-xs">
          <span className="text-xs text-rose-600 dark:text-rose-300 font-bold uppercase tracking-wider">
            Highest Single Expense
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-100 mt-1 truncate">
            {highestExpenseItem ? highestExpenseItem.title : "None"}
          </div>
          <span className="text-xs text-rose-600 dark:text-rose-400 mt-1 block font-medium">
            {highestExpenseItem ? <AnimatedCounter value={highestExpenseItem.amount} settings={settings} /> : "0"}
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie / Donut Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <span>Category Expense Breakdown</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Distribution %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name] || "#64748b"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val), settings), "Amount"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[item.name] || "#64748b" }}
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {item.name}:
                </span>
                <span className="text-slate-500 font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Monthly Spending Comparison</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">2026 Academic Year</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [formatCurrency(Number(val), settings), "Expense"]} />
                <Bar dataKey="Expense" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            Track month-over-month expenditure fluctuations across college semesters.
          </p>
        </div>
      </div>

      {/* Expense Trend Line Graph */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Daily Expense Velocity Trend</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Recent Transactions Velocity</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [formatCurrency(Number(val), settings), "Spent"]} />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
