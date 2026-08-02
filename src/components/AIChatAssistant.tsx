import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, RefreshCw } from "lucide-react";
import { AppSettings, Expense, Income, Budget } from "../types";

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
  settings: AppSettings;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  isOpen,
  onClose,
  expenses,
  incomes,
  budget,
  settings
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      role: "assistant",
      content:
        "Hi! I'm **Penny**, your AI Student Financial Assistant. Ask me anything about saving money on food, hostel rent, textbooks, managing your budget, or planning for a new laptop!"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const contextData = {
        totalExpense: expenses.reduce((a, b) => a + b.amount, 0),
        totalIncome: incomes.reduce((a, b) => a + b.amount, 0),
        monthlyBudget: budget.monthlyBudget,
        currencySymbol: settings.currencySymbol
      };

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          })),
          contextData
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}_res`,
            role: "assistant",
            content: data.reply || "I analyzed your budget. Let me know if you need specific tips!"
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}_err`,
            role: "assistant",
            content: "Sorry, I am currently unable to reach my financial AI engine. Please try again."
          }
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "How can I save ₹1,500 on food this month?",
    "Should I buy reference textbooks or rent PDFs?",
    "How to manage pocket money vs hostel mess fees?",
    "Tips for saving up for a laptop on a student budget"
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Penny AI Financial Assistant</h3>
              <p className="text-[10px] text-indigo-300">Powered by Gemini 3.6 Flash</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  AI
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Penny is crafting financial advice...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium whitespace-nowrap hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Penny about money, budgeting, food savings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
