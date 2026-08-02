import React from "react";
import { SmartChallenge, AppSettings } from "../types";
import { formatCurrency } from "../utils/formatters";
import { Zap, Award, CheckCircle2, ShieldAlert, Plus, Trophy, Flame, Sparkles } from "lucide-react";

interface SmartChallengeModeProps {
  challenges: SmartChallenge[];
  setChallenges: React.Dispatch<React.SetStateAction<SmartChallenge[]>>;
  settings: AppSettings;
}

export const SmartChallengeMode: React.FC<SmartChallengeModeProps> = ({
  challenges,
  setChallenges,
  settings
}) => {
  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isJoined: !c.isJoined } : c))
    );
  };

  const incrementDay = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextDay = Math.min(c.durationDays, c.currentDay + 1);
        const completed = nextDay >= c.durationDays;
        return {
          ...c,
          currentDay: nextDay,
          isCompleted: completed
        };
      })
    );
  };

  const completedCount = challenges.filter((c) => c.isCompleted).length;
  const totalSavedInChallenges = challenges
    .filter((c) => c.isCompleted)
    .reduce((a, b) => a + b.targetSaving, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20 text-white">
              <Flame className="w-5 h-5 animate-bounce" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">Smart Saving Challenges</h2>
          </div>
          <p className="text-xs text-amber-100/90">
            Commit to short student habits, save big bucks, and unlock exclusive financial badges!
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
            <span className="text-[10px] uppercase tracking-widest text-amber-200 font-bold block">Badges Unlocked</span>
            <span className="text-xl font-black text-white flex items-center justify-end gap-1">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{completedCount} Rewards</span>
            </span>
          </div>
        </div>
      </div>

      {/* Challenges List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((chal) => {
          const progressPct = Math.round((chal.currentDay / chal.durationDays) * 100);

          return (
            <div
              key={chal.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                chal.isCompleted
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20"
                  : "border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{chal.title}</h3>
                    {chal.isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-300/60">
                        Completed 🎉
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{chal.description}</p>
                </div>

                <div className="px-2.5 py-1 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0 text-center">
                  <span className="text-[10px] uppercase font-bold block text-amber-600 dark:text-amber-400">Reward</span>
                  <span className="text-xs font-black">{chal.rewardBadge}</span>
                </div>
              </div>

              {/* Progress Bar & Day Controls */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>
                    Day {chal.currentDay} of {chal.durationDays}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Est. Savings: {formatCurrency(chal.targetSaving, settings)}
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div
                    className={`h-full transition-all duration-500 ${
                      chal.isCompleted
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleJoin(chal.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    chal.isJoined
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  {chal.isJoined ? "Leave Challenge" : "Join Challenge"}
                </button>

                {chal.isJoined && !chal.isCompleted && (
                  <button
                    onClick={() => incrementDay(chal.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Log Successful Day</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
