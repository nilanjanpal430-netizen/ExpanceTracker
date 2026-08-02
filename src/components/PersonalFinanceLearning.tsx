import React, { useState } from "react";
import { LearningLesson, AppSettings } from "../types";
import { BookOpen, CheckCircle2, Award, Clock, HelpCircle, ChevronRight, Sparkles, Check, X } from "lucide-react";

interface PersonalFinanceLearningProps {
  lessons: LearningLesson[];
  setLessons: React.Dispatch<React.SetStateAction<LearningLesson[]>>;
  settings: AppSettings;
}

export const PersonalFinanceLearning: React.FC<PersonalFinanceLearningProps> = ({
  lessons,
  setLessons,
  settings
}) => {
  const [selectedLesson, setSelectedLesson] = useState<LearningLesson | null>(lessons[0] || null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleFinishQuiz = () => {
    setShowQuizResults(true);
    if (selectedLesson) {
      setLessons((prev) =>
        prev.map((l) => (l.id === selectedLesson.id ? { ...l, isCompleted: true } : l))
      );
    }
  };

  const completedCount = lessons.filter((l) => l.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-800/80 text-blue-200">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">Student Personal Finance Academy</h2>
          </div>
          <p className="text-xs text-indigo-200/80">
            Bite-sized financial lessons on budgeting, credit cards, scam safety & investing.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-indigo-200 font-bold block">Lessons Completed</span>
          <span className="text-xl font-black text-white flex items-center justify-end gap-1">
            <Award className="w-4 h-4 text-amber-300" />
            <span>{completedCount} / {lessons.length}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Catalog Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Lesson Catalog
          </h3>

          <div className="space-y-2">
            {lessons.map((lesson) => {
              const isSelected = selectedLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setSelectedQuizAnswers({});
                    setShowQuizResults(false);
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    }`}>
                      {lesson.category}
                    </span>
                    {lesson.isCompleted && (
                      <CheckCircle2 className={`w-4 h-4 ${isSelected ? "text-emerald-300" : "text-emerald-500"}`} />
                    )}
                  </div>

                  <h4 className="font-bold text-xs leading-snug">{lesson.title}</h4>

                  <div className={`flex items-center gap-2 text-[10px] mt-2 ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                    <Clock className="w-3 h-3" />
                    <span>{lesson.readTime}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Lesson Viewer & Quiz */}
        {selectedLesson && (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {selectedLesson.category}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white pt-1">{selectedLesson.title}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{selectedLesson.readTime}</span>
              </p>
            </div>

            {/* Markdown Lesson Content */}
            <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-3 text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {selectedLesson.contentMarkdown}
            </div>

            {/* Quiz Section */}
            {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Interactive Knowledge Check</span>
                </h3>

                {selectedLesson.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{q.question}</p>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selectedQuizAnswers[qIdx] === oIdx;
                        const isCorrect = q.correctAnswerIndex === oIdx;

                        let optClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                        if (isChosen) {
                          optClass = "bg-indigo-600 border-indigo-600 text-white font-bold";
                        }
                        if (showQuizResults) {
                          if (isCorrect) optClass = "bg-emerald-600 text-white font-bold border-emerald-600";
                          else if (isChosen && !isCorrect) optClass = "bg-rose-600 text-white font-bold border-rose-600";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border ${optClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults && (
                      <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                ))}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleFinishQuiz}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Submit Answers & Mark Complete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
