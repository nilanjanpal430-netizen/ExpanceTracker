import React from "react";
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Receipt,
  PiggyBank,
  CloudUpload,
  Users,
  CalendarDays,
  User,
  Settings,
  Bot,
  Plus,
  Sun,
  Moon,
  Bell,
  Sparkles,
  LogOut,
  Wallet
} from "lucide-react";
import { AppSettings, UserProfile } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  profile: UserProfile;
  onOpenAddModal: () => void;
  onOpenAIChat: () => void;
  onOpenAuthModal: () => void;
  hasUnreadNotifications: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  setSettings,
  profile,
  onOpenAddModal,
  onOpenAIChat,
  onOpenAuthModal,
  hasUnreadNotifications
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Visual Analytics", icon: PieChart },
    { id: "forecast", label: "Budget & Forecast", icon: TrendingUp },
    { id: "history", label: "Expense History", icon: Receipt },
    { id: "goals", label: "Savings Goals", icon: PiggyBank },
    { id: "cloud", label: "Cloud Backup", icon: CloudUpload },
    { id: "split", label: "Roommate Split", icon: Users },
    { id: "fees", label: "Fee Calendar", icon: CalendarDays },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light"
    }));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-lg leading-tight flex items-center gap-2">
                <span>Student Expense Tracker</span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Campus Financial Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2">
            {/* Quick Add Expense / Income Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Entry</span>
            </button>

            {/* AI Advisor Chat Button */}
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all active:scale-95"
              title="Ask Penny AI Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span className="hidden md:inline">AI Advisor</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {settings.theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Indicator */}
            <button
              onClick={() => setActiveTab("history")}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Budget Notifications"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            {/* Profile Avatar / Auth */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              title="User Account"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[90px] truncate">
                {profile.name || "Student"}
              </span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row for All Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
