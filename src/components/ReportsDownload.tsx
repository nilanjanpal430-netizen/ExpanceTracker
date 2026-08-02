import React, { useState } from "react";
import { Expense, Income, Budget, AppSettings, UserProfile } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, Sparkles, Filter } from "lucide-react";

interface ReportsDownloadProps {
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
  profile: UserProfile;
  settings: AppSettings;
}

export const ReportsDownload: React.FC<ReportsDownloadProps> = ({
  expenses,
  incomes,
  budget,
  profile,
  settings
}) => {
  const [reportType, setReportType] = useState<"Monthly" | "Annual" | "Summary" | "Tax">("Monthly");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const totalSpent = expenses.reduce((a, b) => a + b.amount, 0);
  const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);

  const handleExportCSV = () => {
    const headers = ["ID,Title,Amount,Category,Date,PaymentMethod\n"];
    const rows = expenses.map(
      (e) => `"${e.id}","${e.title}",${e.amount},"${e.category}","${e.date}","${e.paymentMethod || "UPI"}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Student_Expense_Report_${reportType}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`CSV Report (${reportType}) exported successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold tracking-tight">Export & Financial Statement Reports</h3>
          </div>
          <p className="text-xs text-indigo-200/80">
            Generate printable PDFs, CSV exports, and tax-friendly summaries for parents or hostel verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Report Type Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(["Monthly", "Annual", "Summary", "Tax"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              reportType === type
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70"
            }`}
          >
            {type} Statement
          </button>
        ))}
      </div>

      {/* Printable Report View */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {profile.college || "National Institute of Tech"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student Statement for {profile.name || "Student"} ({profile.course || "B.Tech"})
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{reportType} Report</span>
            <span className="text-[10px] text-slate-400 block">{new Date().toLocaleDateString("en-IN")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Inflow</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome, settings)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Outflow</span>
            <span className="text-base font-black text-rose-600 dark:text-rose-400">
              {formatCurrency(totalSpent, settings)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Net Savings</span>
            <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {formatCurrency(Math.max(0, totalIncome - totalSpent), settings)}
            </span>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-1.5 pt-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Transaction Breakdown</h4>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {expenses.slice(0, 8).map((exp) => (
              <div key={exp.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{exp.title}</span>
                  <span className="text-[10px] text-slate-400 block">
                    {exp.category} • {formatDate(exp.date)}
                  </span>
                </div>
                <span className="font-black text-slate-900 dark:text-white">
                  {formatCurrency(exp.amount, settings)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
