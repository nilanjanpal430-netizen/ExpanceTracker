import React, { useState } from "react";
import { User, Settings as SettingsIcon, Bell, DollarSign, Moon, Sun, Save, Shield } from "lucide-react";
import { UserProfile, AppSettings } from "../types";

interface ProfileSettingsProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  setProfile,
  settings,
  setSettings
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [college, setCollege] = useState(profile.college);
  const [course, setCourse] = useState(profile.course);
  const [semester, setSemester] = useState(profile.semester);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name,
      email,
      phone,
      college,
      course,
      semester
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCurrencyChange = (curr: AppSettings["currency"]) => {
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    setSettings((prev) => ({
      ...prev,
      currency: curr,
      currencySymbol: symbols[curr]
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>Student Profile & App Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your college credentials, currency symbols, and notification settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Form (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Academic Profile Details</h2>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">College Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">College / Institute Name</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Course / Branch</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Current Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess && (
                <span className="text-emerald-600 font-semibold">✓ Profile details updated successfully!</span>
              )}
              <button
                type="submit"
                className="ml-auto flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preferences & Settings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">App Settings</h2>

          {/* Currency Switcher */}
          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">Select Currency</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "INR", symbol: "₹", name: "INR (₹)" },
                { code: "USD", symbol: "$", name: "USD ($)" },
                { code: "EUR", symbol: "€", name: "EUR (€)" },
                { code: "GBP", symbol: "£", name: "GBP (£)" }
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCurrencyChange(c.code as any)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    settings.currency === c.code
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">Theme Mode</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, theme: "light" }))}
                className={`flex-1 py-2 rounded-xl border font-semibold flex items-center justify-center gap-1.5 ${
                  settings.theme === "light"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, theme: "dark" }))}
                className={`flex-1 py-2 rounded-xl border font-semibold flex items-center justify-center gap-1.5 ${
                  settings.theme === "dark"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Budget Limit Notifications</span>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, notificationsEnabled: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Daily Expense Reminders</span>
              <input
                type="checkbox"
                checked={settings.dailyReminders}
                onChange={(e) => setSettings((s) => ({ ...s, dailyReminders: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
