import React from "react";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  TrendingUp,
  CreditCard,
  Tag,
  Flame,
  ShieldCheck,
  GraduationCap,
  Users,
  CalendarDays,
  FileText,
  BookOpen,
  Trophy,
  Settings,
  Sparkles,
  Wallet,
  X,
  ChevronRight
} from "lucide-react";
import { UserProfile, AppSettings } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenAIChat: () => void;
  profile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
  onOpenAIChat,
  profile
}) => {
  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "history", label: "Expenses & Receipts", icon: Receipt },
    { id: "analytics", label: "Analytics & Heatmap", icon: PieChart },
    { id: "forecast", label: "Budget & Forecast", icon: TrendingUp },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "student-hub", label: "Student Discounts & Prices", icon: Tag },
    { id: "challenges", label: "Smart Challenges", icon: Flame },
    { id: "emergency", label: "Emergency Fund", icon: ShieldCheck },
    { id: "split", label: "Expense Sharing / Split", icon: Users },
    { id: "fees", label: "Fee Reminders Calendar", icon: CalendarDays },
    { id: "learning", label: "Finance Academy", icon: BookOpen },
    { id: "leaderboard", label: "Savings Leaderboard", icon: Trophy },
    { id: "reports", label: "Reports & Statements", icon: FileText },
    { id: "settings", label: "Profile & Settings", icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between p-4 shadow-xl lg:shadow-none`}
      >
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setActiveTab("dashboard");
                onCloseMobile();
              }}
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Student Finance
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  AI Campus Suite
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Advisor Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-2 border border-indigo-800/60 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Penny AI Advisor</span>
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80">Get automated budget tips & instant advice.</p>
            <button
              onClick={() => {
                onOpenAIChat();
                onCloseMobile();
              }}
              className="w-full py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs transition-all shadow-xs"
            >
              Chat with Penny AI
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 scrollbar-thin">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-extrabold shadow-2xs border border-indigo-200/50 dark:border-indigo-800/50"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Card */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="truncate">
              <span className="font-bold text-slate-900 dark:text-white block truncate">{profile.name || "Alex Sharma"}</span>
              <span className="text-[10px] text-slate-400 block truncate">{profile.college || "Campus User"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
