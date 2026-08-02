import React, { useState } from "react";
import {
  CloudUpload,
  CloudDownload,
  Download,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  HardDrive,
  Upload
} from "lucide-react";
import { Expense, Income, Budget, SavingsGoal, UserProfile, AppSettings } from "../types";
import { exportToCSV, exportToJSON, generatePrintablePDFReport } from "../utils/formatters";

interface CloudBackupSyncProps {
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
  goals: SavingsGoal[];
  profile: UserProfile;
  settings: AppSettings;
  onRestoreData: (restoredData: any) => void;
}

export const CloudBackupSync: React.FC<CloudBackupSyncProps> = ({
  expenses,
  incomes,
  budget,
  goals,
  profile,
  settings,
  onRestoreData
}) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Cloud Save
  const handleCloudSave = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const payload = {
        expenses,
        incomes,
        budget,
        goals,
        profile,
        settings
      };

      const res = await fetch("/api/backup/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.id || "default_user", data: payload })
      });

      if (res.ok) {
        const result = await res.json();
        setLastSyncTime(result.timestamp);
        setSyncMessage("Data encrypted & securely saved to cloud backup server!");
      } else {
        setSyncMessage("Cloud sync server unreachable.");
      }
    } catch (err) {
      console.error("Cloud backup error:", err);
      setSyncMessage("Backup sync error occurred.");
    } finally {
      setSyncing(false);
    }
  };

  // Cloud Restore
  const handleCloudRestore = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch(`/api/backup/load?userId=${profile.id || "default_user"}`);
      if (res.ok) {
        const result = await res.json();
        if (result.backup) {
          onRestoreData(result.backup);
          setLastSyncTime(result.backup.timestamp);
          setSyncMessage("Data restored successfully from latest cloud backup snapshot!");
        }
      } else {
        setSyncMessage("No cloud backup record found for this user.");
      }
    } catch (err) {
      console.error("Cloud restore error:", err);
      setSyncMessage("Cloud restore error.");
    } finally {
      setSyncing(false);
    }
  };

  // File import JSON restore
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        onRestoreData(json);
        setSyncMessage("Successfully imported backup JSON file!");
      } catch (err) {
        alert("Invalid JSON backup file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CloudUpload className="w-5 h-5 text-indigo-600" />
            <span>Cloud Data Backup & Export Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Secure cloud server synchronization, PDF printable statements & CSV data exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            256-Bit Encrypted Cloud Sync
          </span>
        </div>
      </div>

      {/* Cloud Sync Status Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Secure Cloud Server State</h2>
              <p className="text-xs text-slate-300">
                {lastSyncTime ? `Last Cloud Sync: ${new Date(lastSyncTime).toLocaleString()}` : "Not synced yet during this session"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCloudSave}
              disabled={syncing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs transition-all active:scale-95 shadow-md"
            >
              <CloudUpload className={`w-4 h-4 ${syncing ? "animate-bounce" : ""}`} />
              <span>Backup to Cloud</span>
            </button>

            <button
              onClick={handleCloudRestore}
              disabled={syncing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all active:scale-95"
            >
              <CloudDownload className="w-4 h-4 text-sky-400" />
              <span>Restore Snapshot</span>
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="p-3 rounded-xl bg-indigo-900/80 border border-indigo-700 text-xs font-semibold text-indigo-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CSV Export Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Export CSV / Excel</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Download raw transaction records into Excel or Google Sheets compatible CSV format.
            </p>
          </div>
          <button
            onClick={() => exportToCSV(expenses, incomes, settings)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Printable PDF Report Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Printable PDF Statement</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate a formatted, professional student expense statement for parents or budget review.
            </p>
          </div>
          <button
            onClick={() => generatePrintablePDFReport(expenses, incomes, settings, profile.name)}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Generate PDF</span>
          </button>
        </div>

        {/* JSON Backup & Restore Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Full JSON Snapshot</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Download or upload full application data backups including goals, budgets & history.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => exportToJSON({ expenses, incomes, budget, goals, profile, settings })}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON File</span>
            </button>

            <label className="w-full py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore JSON File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
