import React, { useState } from "react";
import { UserProfile, AppSettings, Expense } from "../types";
import {
  Menu,
  Plus,
  Mic,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  User,
  Wallet,
  X
} from "lucide-react";

interface TopBarProps {
  onOpenMobileSidebar: () => void;
  onOpenAddModal: () => void;
  onOpenVoiceModal: () => void;
  onOpenAIChat: () => void;
  onOpenAuthModal: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  profile: UserProfile;
  hasUnreadAlerts: boolean;
  expenses: Expense[];
  setActiveTab: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileSidebar,
  onOpenAddModal,
  onOpenVoiceModal,
  onOpenAIChat,
  onOpenAuthModal,
  settings,
  setSettings,
  profile,
  hasUnreadAlerts,
  expenses,
  setActiveTab
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light"
    }));
  };

  const searchFiltered = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2 lg:hidden cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">Expense Tracker</span>
          </div>
        </div>

        {/* Global Search Input Bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search expenses, tags, or categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full pl-9 pr-8 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Search Overlay */}
          {showSearchResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-3 max-h-60 overflow-y-auto z-40 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Matching Expenses ({searchFiltered.length})</div>
              {searchFiltered.length === 0 ? (
                <p className="text-slate-500 py-2 text-center">No transactions found</p>
              ) : (
                <div className="space-y-1">
                  {searchFiltered.slice(0, 5).map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setActiveTab("history");
                        setShowSearchResults(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{exp.title}</span>
                        <span className="text-[10px] text-slate-400">{exp.category} • {exp.date}</span>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">{settings.currencySymbol}{exp.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Voice Entry Button */}
          <button
            onClick={onOpenVoiceModal}
            className="p-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold transition-all"
            title="Voice Expense Log"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Quick Add Entry Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Add Entry</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {settings.theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Notification Alert Bell */}
          <button
            onClick={() => setActiveTab("history")}
            className="p-2 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadAlerts && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          {/* Profile Account */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="hidden md:inline text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[90px] truncate">
              {profile.name || "Student"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
