import React, { useState } from "react";
import { Expense, ExpenseCategory, AppSettings } from "../types";
import { Mic, MicOff, Sparkles, CheckCircle2, ArrowRight, X } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

interface VoiceExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  settings: AppSettings;
}

export const VoiceExpenseModal: React.FC<VoiceExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  settings
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  // Smart Parser for "Spent ₹250 on lunch today"
  const parseExpenseString = (text: string) => {
    // Extract numbers
    const numMatch = text.match(/(\d+[\d,.]*)/);
    const amount = numMatch ? parseFloat(numMatch[1].replace(/,/g, "")) : 250;

    // Detect category keywords
    let category: ExpenseCategory = "Others";
    const lower = text.toLowerCase();
    if (lower.includes("lunch") || lower.includes("dinner") || lower.includes("food") || lower.includes("coffee") || lower.includes("burger")) {
      category = "Food";
    } else if (lower.includes("book") || lower.includes("textbook") || lower.includes("note")) {
      category = "Books";
    } else if (lower.includes("metro") || lower.includes("cab") || lower.includes("bus") || lower.includes("travel")) {
      category = "Transport";
    } else if (lower.includes("recharge") || lower.includes("jio") || lower.includes("mobile")) {
      category = "Mobile Recharge";
    } else if (lower.includes("shopping") || lower.includes("shirt") || lower.includes("jacket")) {
      category = "Shopping";
    } else if (lower.includes("movie") || lower.includes("netflix") || lower.includes("game")) {
      category = "Entertainment";
    }

    // Title cleaning
    let title = text || "Voice Logged Expense";
    if (title.length > 30) title = title.substring(0, 30) + "...";

    return {
      title,
      amount,
      category,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "UPI" as const
    };
  };

  const parsed = parseExpenseString(inputText || "Spent ₹250 on lunch today");

  const handleSpeechListen = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please type your phrase below.");
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleConfirm = () => {
    onAddExpense(parsed);
    setInputText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Voice & Smart Entry</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Speak or type phrases like: <em>"Spent ₹250 on lunch today"</em>
          </p>
        </div>

        {/* Big Mic Button */}
        <div className="flex justify-center py-2">
          <button
            onClick={handleSpeechListen}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30"
                : "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white hover:opacity-95 shadow-lg shadow-indigo-500/20"
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Input Field */}
        <div>
          <input
            type="text"
            placeholder="Spent ₹250 on lunch today..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Live Parsed Preview */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
          <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">
            AI Auto-Parsed Expense Preview
          </span>
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">{parsed.title}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{parsed.category} • Today</span>
            </div>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {formatCurrency(parsed.amount, settings)}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Confirm & Save Expense</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
