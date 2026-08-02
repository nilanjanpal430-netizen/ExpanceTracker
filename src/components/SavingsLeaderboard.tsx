import React from "react";
import { LeaderboardUser, AppSettings } from "../types";
import { formatCurrency } from "../utils/formatters";
import { Trophy, Flame, Award, Users, Star, Sparkles } from "lucide-react";

interface SavingsLeaderboardProps {
  users: LeaderboardUser[];
  settings: AppSettings;
}

export const SavingsLeaderboard: React.FC<SavingsLeaderboardProps> = ({ users, settings }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-200" />
            <h3 className="text-base font-extrabold tracking-tight">Campus Top Savers Leaderboard</h3>
          </div>
          <p className="text-xs text-amber-100/90">
            Compare monthly savings with college mates and keep your savings streak burning!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-xs">
            <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>Top Saver Spotlight</span>
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {users.map((u) => {
          let rankBadge = `${u.rank}`;
          let rankBg = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
          if (u.rank === 1) rankBg = "bg-amber-400 text-slate-900 font-extrabold shadow-xs";
          else if (u.rank === 2) rankBg = "bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-extrabold";
          else if (u.rank === 3) rankBg = "bg-amber-700 text-white font-extrabold";

          return (
            <div
              key={u.rank}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                u.isCurrentUser
                  ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-xs"
                  : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${rankBg}`}>
                  {rankBadge}
                </div>

                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {u.avatar}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{u.name}</span>
                    {u.isCurrentUser && (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        You
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-semibold">
                      <Flame className="w-3 h-3" />
                      <span>{u.streakDays}d streak</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                      <Award className="w-3 h-3" />
                      <span>{u.badgesCount} badges</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {formatCurrency(u.monthlySavings, settings)}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Saved this month</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
