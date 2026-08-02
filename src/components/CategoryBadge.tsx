import React from "react";
import {
  Utensils,
  Bus,
  Home,
  Building2,
  ShoppingBag,
  Pencil,
  Smartphone,
  GraduationCap,
  Wifi,
  Film,
  HeartPulse,
  BookOpen,
  Tag
} from "lucide-react";
import { ExpenseCategory } from "../types";

interface CategoryIconProps {
  category: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "w-3.5 h-3.5" }) => {
  switch (category) {
    case "Food":
      return <Utensils className={className} />;
    case "Transport":
      return <Bus className={className} />;
    case "Hostel":
      return <Home className={className} />;
    case "Rent":
      return <Building2 className={className} />;
    case "Shopping":
      return <ShoppingBag className={className} />;
    case "Stationery":
      return <Pencil className={className} />;
    case "Mobile Recharge":
      return <Smartphone className={className} />;
    case "College Fees":
      return <GraduationCap className={className} />;
    case "Internet":
      return <Wifi className={className} />;
    case "Entertainment":
      return <Film className={className} />;
    case "Health":
      return <HeartPulse className={className} />;
    case "Books":
      return <BookOpen className={className} />;
    case "Others":
    default:
      return <Tag className={className} />;
  }
};

export const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Food":
      return "bg-amber-100/80 text-amber-900 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60";
    case "Transport":
      return "bg-sky-100/80 text-sky-900 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60";
    case "Hostel":
      return "bg-indigo-100/80 text-indigo-900 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60";
    case "Rent":
      return "bg-violet-100/80 text-violet-900 border-violet-200/80 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60";
    case "Shopping":
      return "bg-pink-100/80 text-pink-900 border-pink-200/80 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800/60";
    case "Stationery":
      return "bg-teal-100/80 text-teal-900 border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60";
    case "Mobile Recharge":
      return "bg-emerald-100/80 text-emerald-900 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60";
    case "College Fees":
      return "bg-purple-100/80 text-purple-900 border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60";
    case "Internet":
      return "bg-cyan-100/80 text-cyan-900 border-cyan-200/80 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60";
    case "Entertainment":
      return "bg-fuchsia-100/80 text-fuchsia-900 border-fuchsia-200/80 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 dark:border-fuchsia-800/60";
    case "Health":
      return "bg-rose-100/80 text-rose-900 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60";
    case "Books":
      return "bg-blue-100/80 text-blue-900 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60";
    case "Others":
    default:
      return "bg-slate-100/80 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
};

interface CategoryBadgeProps {
  category: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  showIcon = true,
  size = "md",
  className = ""
}) => {
  const styles = getCategoryStyles(category);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5 font-semibold",
    lg: "px-3 py-1.5 text-xs gap-2 font-bold"
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4"
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${styles} ${sizeClasses} ${className}`}
    >
      {showIcon && <CategoryIcon category={category} className={iconSizes} />}
      <span>{category}</span>
    </span>
  );
};
