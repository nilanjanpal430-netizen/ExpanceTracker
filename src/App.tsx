import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { VisualAnalytics } from "./components/VisualAnalytics";
import { SpendingHeatmap } from "./components/SpendingHeatmap";
import { CarbonFootprintTracker } from "./components/CarbonFootprintTracker";
import { BudgetForecastTool } from "./components/BudgetForecastTool";
import { ExpenseHistory } from "./components/ExpenseHistory";
import { SubscriptionTracker } from "./components/SubscriptionTracker";
import { SmartChallengeMode } from "./components/SmartChallengeMode";
import { EmergencyFundTracker } from "./components/EmergencyFundTracker";
import { StudentDiscountsAndPriceComp } from "./components/StudentDiscountsAndPriceComp";
import { RoommateSplitter } from "./components/RoommateSplitter";
import { FeeRemindersCalendar } from "./components/FeeRemindersCalendar";
import { PersonalFinanceLearning } from "./components/PersonalFinanceLearning";
import { SavingsLeaderboard } from "./components/SavingsLeaderboard";
import { ReportsDownload } from "./components/ReportsDownload";
import { SavingsGoals } from "./components/SavingsGoals";
import { CloudBackupSync } from "./components/CloudBackupSync";
import { ProfileSettings } from "./components/ProfileSettings";

// Modals
import { AddTransactionModal } from "./components/AddTransactionModal";
import { VoiceExpenseModal } from "./components/VoiceExpenseModal";
import { AIChatAssistant } from "./components/AIChatAssistant";
import { AuthModal } from "./components/AuthModal";

// Initial Mock Data
import {
  initialProfile,
  initialSettings,
  initialBudget,
  initialIncomes,
  initialExpenses,
  initialGoals,
  initialRoommateSplits,
  initialFeeReminders,
  initialSubscriptions,
  initialChallenges,
  initialEmergencyFund,
  initialDiscounts,
  initialPriceItems,
  initialScholarships,
  initialLeaderboard,
  initialLearningLessons
} from "./data/initialData";

import {
  Expense,
  Income,
  Budget,
  SavingsGoal,
  UserProfile,
  AppSettings,
  RoommateSplit,
  FeeReminder,
  SubscriptionItem,
  SmartChallenge,
  EmergencyFund,
  StudentDiscount,
  PriceItem,
  ScholarshipItem,
  LeaderboardUser,
  LearningLesson
} from "./types";

import { loadFromLocalStorage, saveToLocalStorage } from "./utils/storage";

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Application Data States initialized with localStorage persistence
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromLocalStorage("scholarspend_profile", initialProfile)
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromLocalStorage("scholarspend_settings", initialSettings)
  );
  const [budget, setBudget] = useState<Budget>(() =>
    loadFromLocalStorage("scholarspend_budget", initialBudget)
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadFromLocalStorage("scholarspend_expenses", initialExpenses)
  );
  const [incomes, setIncomes] = useState<Income[]>(() =>
    loadFromLocalStorage("scholarspend_incomes", initialIncomes)
  );
  const [goals, setGoals] = useState<SavingsGoal[]>(() =>
    loadFromLocalStorage("scholarspend_goals", initialGoals)
  );
  const [splits, setSplits] = useState<RoommateSplit[]>(() =>
    loadFromLocalStorage("scholarspend_splits", initialRoommateSplits)
  );
  const [feeReminders, setFeeReminders] = useState<FeeReminder[]>(() =>
    loadFromLocalStorage("scholarspend_feeReminders", initialFeeReminders)
  );
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() =>
    loadFromLocalStorage("scholarspend_subscriptions", initialSubscriptions)
  );
  const [challenges, setChallenges] = useState<SmartChallenge[]>(() =>
    loadFromLocalStorage("scholarspend_challenges", initialChallenges)
  );
  const [emergencyFund, setEmergencyFund] = useState<EmergencyFund>(() =>
    loadFromLocalStorage("scholarspend_emergencyFund", initialEmergencyFund)
  );
  const [discounts, setDiscounts] = useState<StudentDiscount[]>(() =>
    loadFromLocalStorage("scholarspend_discounts", initialDiscounts)
  );
  const [priceComparisons, setPriceComparisons] = useState<PriceItem[]>(() =>
    loadFromLocalStorage("scholarspend_priceItems", initialPriceItems)
  );
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(() =>
    loadFromLocalStorage("scholarspend_scholarships", initialScholarships)
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() =>
    loadFromLocalStorage("scholarspend_leaderboard", initialLeaderboard)
  );
  const [learningLessons, setLearningLessons] = useState<LearningLesson[]>(() =>
    loadFromLocalStorage("scholarspend_learningLessons", initialLearningLessons)
  );

  // Sync state changes to localStorage
  useEffect(() => { saveToLocalStorage("scholarspend_profile", profile); }, [profile]);
  useEffect(() => { saveToLocalStorage("scholarspend_settings", settings); }, [settings]);
  useEffect(() => { saveToLocalStorage("scholarspend_budget", budget); }, [budget]);
  useEffect(() => { saveToLocalStorage("scholarspend_expenses", expenses); }, [expenses]);
  useEffect(() => { saveToLocalStorage("scholarspend_incomes", incomes); }, [incomes]);
  useEffect(() => { saveToLocalStorage("scholarspend_goals", goals); }, [goals]);
  useEffect(() => { saveToLocalStorage("scholarspend_splits", splits); }, [splits]);
  useEffect(() => { saveToLocalStorage("scholarspend_feeReminders", feeReminders); }, [feeReminders]);
  useEffect(() => { saveToLocalStorage("scholarspend_subscriptions", subscriptions); }, [subscriptions]);
  useEffect(() => { saveToLocalStorage("scholarspend_challenges", challenges); }, [challenges]);
  useEffect(() => { saveToLocalStorage("scholarspend_emergencyFund", emergencyFund); }, [emergencyFund]);
  useEffect(() => { saveToLocalStorage("scholarspend_discounts", discounts); }, [discounts]);
  useEffect(() => { saveToLocalStorage("scholarspend_priceItems", priceComparisons); }, [priceComparisons]);
  useEffect(() => { saveToLocalStorage("scholarspend_scholarships", scholarships); }, [scholarships]);
  useEffect(() => { saveToLocalStorage("scholarspend_leaderboard", leaderboard); }, [leaderboard]);
  useEffect(() => { saveToLocalStorage("scholarspend_learningLessons", learningLessons); }, [learningLessons]);

  // Modal Dialog UI States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<"Expense" | "Income">("Expense");
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showAIChatModal, setShowAIChatModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Apply Dark Mode Class to HTML Root
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  // Transaction Handlers
  const handleAddExpense = (newExp: Omit<Expense, "id">) => {
    const expenseItem: Expense = {
      ...newExp,
      id: `exp_${Date.now()}`
    };
    setExpenses((prev) => [expenseItem, ...prev]);
  };

  const handleAddIncome = (newInc: Omit<Income, "id">) => {
    const incomeItem: Income = {
      ...newInc,
      id: `inc_${Date.now()}`
    };
    setIncomes((prev) => [incomeItem, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleOpenAddModal = (initialType?: "Expense" | "Income") => {
    setAddModalType(initialType || "Expense");
    setShowAddModal(true);
  };

  // Cloud Restore Snapshot Handler
  const handleRestoreData = (restored: any) => {
    if (restored.expenses) setExpenses(restored.expenses);
    if (restored.incomes) setIncomes(restored.incomes);
    if (restored.budget) setBudget(restored.budget);
    if (restored.goals) setGoals(restored.goals);
    if (restored.profile) setProfile(restored.profile);
    if (restored.settings) setSettings(restored.settings);
  };

  // Notification Alert Trigger
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const hasUnreadAlerts = totalSpent > budget.monthlyBudget * (budget.alertThreshold / 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white flex">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenAIChat={() => setShowAIChatModal(true)}
        profile={profile}
      />

      {/* 2. Main Content Layout Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Navigation Bar */}
        <TopBar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAddModal={() => handleOpenAddModal("Expense")}
          onOpenVoiceModal={() => setShowVoiceModal(true)}
          onOpenAIChat={() => setShowAIChatModal(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
          settings={settings}
          setSettings={setSettings}
          profile={profile}
          hasUnreadAlerts={hasUnreadAlerts}
          expenses={expenses}
          setActiveTab={setActiveTab}
        />

        {/* Tab View Contents */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <Dashboard
              expenses={expenses}
              incomes={incomes}
              budget={budget}
              goals={goals}
              settings={settings}
              profile={profile}
              feeReminders={feeReminders}
              onOpenAddModal={handleOpenAddModal}
              onOpenReceiptScan={() => handleOpenAddModal("Expense")}
              setActiveTab={setActiveTab}
              onCloudSync={() => setActiveTab("cloud")}
            />
          )}

          {activeTab === "history" && (
            <ExpenseHistory
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              settings={settings}
            />
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <VisualAnalytics expenses={expenses} incomes={incomes} settings={settings} />
              <SpendingHeatmap expenses={expenses} settings={settings} />
              <CarbonFootprintTracker expenses={expenses} settings={settings} />
            </div>
          )}

          {activeTab === "forecast" && (
            <BudgetForecastTool
              budget={budget}
              setBudget={setBudget}
              expenses={expenses}
              settings={settings}
            />
          )}

          {activeTab === "subscriptions" && (
            <SubscriptionTracker
              subscriptions={subscriptions}
              setSubscriptions={setSubscriptions}
              settings={settings}
            />
          )}

          {activeTab === "student-hub" && (
            <StudentDiscountsAndPriceComp
              discounts={discounts}
              priceComparisons={priceComparisons}
              scholarships={scholarships}
              settings={settings}
            />
          )}

          {activeTab === "challenges" && (
            <SmartChallengeMode
              challenges={challenges}
              setChallenges={setChallenges}
              settings={settings}
            />
          )}

          {activeTab === "emergency" && (
            <EmergencyFundTracker
              fund={emergencyFund}
              setFund={setEmergencyFund}
              settings={settings}
            />
          )}

          {activeTab === "split" && (
            <RoommateSplitter splits={splits} setSplits={setSplits} settings={settings} />
          )}

          {activeTab === "fees" && (
            <FeeRemindersCalendar
              reminders={feeReminders}
              setReminders={setFeeReminders}
              settings={settings}
            />
          )}

          {activeTab === "learning" && (
            <PersonalFinanceLearning
              lessons={learningLessons}
              setLessons={setLearningLessons}
              settings={settings}
            />
          )}

          {activeTab === "leaderboard" && (
            <SavingsLeaderboard users={leaderboard} settings={settings} />
          )}

          {activeTab === "reports" && (
            <ReportsDownload
              expenses={expenses}
              incomes={incomes}
              budget={budget}
              profile={profile}
              settings={settings}
            />
          )}

          {activeTab === "goals" && (
            <SavingsGoals goals={goals} setGoals={setGoals} settings={settings} />
          )}

          {activeTab === "cloud" && (
            <CloudBackupSync
              expenses={expenses}
              incomes={incomes}
              budget={budget}
              goals={goals}
              profile={profile}
              settings={settings}
              onRestoreData={handleRestoreData}
            />
          )}

          {activeTab === "settings" && (
            <ProfileSettings
              profile={profile}
              setProfile={setProfile}
              settings={settings}
              setSettings={setSettings}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddExpense={handleAddExpense}
        onAddIncome={handleAddIncome}
        initialType={addModalType}
        settings={settings}
      />

      <VoiceExpenseModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onAddExpense={handleAddExpense}
        settings={settings}
      />

      <AIChatAssistant
        isOpen={showAIChatModal}
        onClose={() => setShowAIChatModal(false)}
        expenses={expenses}
        incomes={incomes}
        budget={budget}
        settings={settings}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        profile={profile}
        setProfile={setProfile}
      />
    </div>
  );
}
