import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, KeyRound } from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile
}) => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      setProfile({
        id: `user_${Date.now()}`,
        name: name.trim() || "Student",
        email: email.trim(),
        phone: "+91 98765 43210",
        college: college.trim() || "State University",
        course: "Computer Science",
        semester: "Semester 5",
        isLoggedIn: true
      });
      setSuccessMsg("Account created! Welcome to Student Expense Tracker.");
    } else if (mode === "login") {
      setProfile((prev) => ({
        ...prev,
        email: email || prev.email,
        isLoggedIn: true
      }));
      setSuccessMsg("Logged in successfully!");
    } else {
      setSuccessMsg("Password reset verification link sent to your email!");
    }

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  const handleDemoSwitch = () => {
    setProfile({
      id: "demo_101",
      name: "Alex Sharma",
      email: "alex.sharma@college.edu",
      phone: "+91 98765 43210",
      college: "Institute of Technology & Science",
      course: "B.Tech Computer Science",
      semester: "Semester 5",
      isLoggedIn: true
    });
    setSuccessMsg("Switched to Demo Student Account.");
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {mode === "login" ? "Student Login" : mode === "signup" ? "Create Student Account" : "Forgot Password"}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === "login"
              ? "Access your expense history & cloud backups"
              : mode === "signup"
              ? "Start tracking student expenses & budgets"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">College / Institute</label>
                <input
                  type="text"
                  placeholder="e.g. National Institute of Tech"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              required
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {mode !== "forgot" && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center text-xs">
          {mode === "login" ? (
            <>
              <button onClick={() => setMode("signup")} className="text-indigo-600 dark:text-indigo-400 font-semibold block w-full">
                Don't have an account? Sign Up
              </button>
              <button onClick={() => setMode("forgot")} className="text-slate-400 hover:text-slate-600 block w-full">
                Forgot password?
              </button>
            </>
          ) : (
            <button onClick={() => setMode("login")} className="text-indigo-600 dark:text-indigo-400 font-semibold block w-full">
              Already have an account? Log In
            </button>
          )}

          <button
            onClick={handleDemoSwitch}
            className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] hover:bg-slate-200 transition-colors"
          >
            ⚡ Quick Load Demo Student Profile
          </button>
        </div>
      </div>
    </div>
  );
};
