import React, { useState, useRef } from "react";
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Check,
  Plus,
  RefreshCw,
  Tag,
  Calendar,
  CreditCard,
  FileText
} from "lucide-react";
import { Expense, ExpenseCategory, Income, IncomeSource, AppSettings } from "../types";
import { CategoryBadge, CategoryIcon } from "./CategoryBadge";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  onAddIncome: (income: Omit<Income, "id">) => void;
  initialType?: "Expense" | "Income";
  settings: AppSettings;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
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

const INCOME_SOURCES: IncomeSource[] = [
  "Pocket Money",
  "Scholarship",
  "Part-Time Job",
  "Freelance",
  "Parents",
  "Others"
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  onAddIncome,
  initialType = "Expense",
  settings
}) => {
  const [type, setType] = useState<"Expense" | "Income">(initialType);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [source, setSource] = useState<IncomeSource>("Pocket Money");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI" | "Card" | "Bank Transfer">("UPI");
  const [tagsInput, setTagsInput] = useState("");

  // Receipt OCR states
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleReceiptFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setOcrPreview(base64);
      setOcrScanning(true);
      setOcrSuccessMsg(null);

      try {
        const res = await fetch("/api/ai/receipt-ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.title) setTitle(data.title);
          if (data.amount) setAmount(data.amount.toString());
          if (data.category && EXPENSE_CATEGORIES.includes(data.category as ExpenseCategory)) {
            setCategory(data.category as ExpenseCategory);
          }
          if (data.date) setDate(data.date);
          if (data.notes) setNotes(data.notes);
          setOcrSuccessMsg("Gemini AI successfully scanned receipt & auto-filled details!");
          setType("Expense");
        }
      } catch (err) {
        console.error("Receipt OCR failed:", err);
      } finally {
        setOcrScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (type === "Expense") {
      const tags = tagsInput
        ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      onAddExpense({
        title: title.trim() || `${category} Expense`,
        amount: parsedAmount,
        category,
        date,
        notes: notes.trim(),
        paymentMethod,
        tags,
        receiptImage: ocrPreview || undefined
      });
    } else {
      onAddIncome({
        source,
        amount: parsedAmount,
        date,
        notes: notes.trim()
      });
    }

    // Reset & Close
    setTitle("");
    setAmount("");
    setNotes("");
    setOcrPreview(null);
    setOcrSuccessMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Log Financial Entry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record daily expenses or income sources
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entry Type Toggle */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setType("Expense")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === "Expense"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            - Add Expense
          </button>

          <button
            type="button"
            onClick={() => setType("Income")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === "Income"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            + Add Income
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* AI Receipt Scanner Bar (Only for Expense) */}
          {type === "Expense" && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Smart AI Receipt OCR Scan</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={ocrScanning}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-all"
                >
                  {ocrScanning ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                  <span>{ocrScanning ? "Scanning..." : "Upload Bill/Receipt"}</span>
                </button>
              </div>

              {ocrSuccessMsg && (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{ocrSuccessMsg}</span>
                </div>
              )}

              {ocrPreview && (
                <div className="flex items-center gap-3 pt-1">
                  <img src={ocrPreview} alt="Receipt Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-300" />
                  <span className="text-slate-500">Receipt image attached for record</span>
                </div>
              )}
            </div>
          )}

          {/* Title or Source Field */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              {type === "Expense" ? "Expense Name / Title" : "Income Source Title"}
            </label>
            <input
              type="text"
              required
              placeholder={type === "Expense" ? "e.g. Burger with friends, Campus Canteen" : "e.g. Monthly Pocket Money"}
              value={type === "Expense" ? title : source}
              onChange={(e) => type === "Expense" ? setTitle(e.target.value) : setSource(e.target.value as IncomeSource)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Amount Field */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Amount ({settings.currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">
                {settings.currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category Selector with Intuitive Icons */}
          {type === "Expense" ? (
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-[11px] font-semibold transition-all border text-left ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                      }`}
                    >
                      <CategoryIcon category={cat} className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Income Source Type
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as IncomeSource)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {INCOME_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date & Payment Method Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {type === "Expense" && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="UPI">UPI / GPay / Paytm</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Bank Transfer">Bank Net Banking</option>
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Dinner with friends, shared room expense..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl font-bold text-white shadow-md transition-all ${
                type === "Expense" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Save {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
