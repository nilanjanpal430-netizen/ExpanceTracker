export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Hostel"
  | "Rent"
  | "Shopping"
  | "Stationery"
  | "Mobile Recharge"
  | "College Fees"
  | "Internet"
  | "Entertainment"
  | "Health"
  | "Books"
  | "Others";

export type IncomeSource =
  | "Pocket Money"
  | "Scholarship"
  | "Part-Time Job"
  | "Freelance"
  | "Parents"
  | "Others";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  notes?: string;
  paymentMethod?: "Cash" | "UPI" | "Card" | "Bank Transfer";
  tags?: string[];
  receiptImage?: string; // base64 or preview url
}

export interface Income {
  id: string;
  source: IncomeSource;
  amount: number;
  date: string;
  notes?: string;
}

export interface Budget {
  monthlyBudget: number;
  categoryBudgets: Record<string, number>;
  alertThreshold: number; // e.g. 80 for 80%
}

export interface SavingsGoal {
  id: string;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
  category?: string;
  isCompleted?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  semester: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
}

export interface AppSettings {
  currency: "INR" | "USD" | "EUR" | "GBP";
  currencySymbol: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  dailyReminders: boolean;
  language: string;
}

export interface RoommateSplit {
  id: string;
  title: string;
  totalAmount: number;
  paidBy: string;
  participants: { name: string; shareAmount: number; paid: boolean }[];
  date: string;
  settled: boolean;
}

export interface FeeReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  type: "College Fee" | "Hostel Rent" | "Scholarship Credit" | "Exam Fee";
  isPaid: boolean;
}

export interface AIInsightsResponse {
  headline: string;
  keyInsights: string[];
  warnings: string[];
  savingTips: string[];
  healthScore: number;
  suggestedDailyCap: number;
}

export interface SubscriptionItem {
  id: string;
  name: string; // Netflix, Spotify, ChatGPT, YouTube Premium, Mobile Recharge
  amount: number;
  billingCycle: "Monthly" | "Yearly" | "Weekly";
  nextPaymentDate: string; // YYYY-MM-DD
  category: string;
  status: "Active" | "Paused" | "Cancelled";
  autoRenew: boolean;
  logoUrl?: string;
}

export interface SmartChallenge {
  id: string;
  title: string; // "No Food Delivery Challenge", "Save ₹100 Every Day", etc.
  description: string;
  durationDays: number;
  currentDay: number;
  rewardBadge: string;
  badgeIcon: string;
  targetSaving: number;
  isJoined: boolean;
  isCompleted: boolean;
  category: ExpenseCategory;
}

export interface EmergencyFund {
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  lastUpdated: string;
  logs: { id: string; amount: number; type: "deposit" | "withdraw"; date: string; note: string }[];
}

export interface StudentDiscount {
  id: string;
  shopName: string;
  category: "Cafes" | "Restaurants" | "Stationery" | "Libraries" | "Printing" | "Entertainment";
  discountText: string;
  code?: string;
  distanceKm: number;
  address: string;
  verified: boolean;
}

export interface PriceItem {
  id: string;
  itemName: string;
  category: string;
  shops: { shopName: string; price: number; location: string; isBestPrice?: boolean }[];
}

export interface ScholarshipItem {
  id: string;
  title: string;
  provider: string;
  amount: number;
  deadline: string;
  eligibleCourses: string[];
  minIncomeCap: number;
  category: string;
  applyUrl: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  monthlySavings: number;
  streakDays: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface LearningLesson {
  id: string;
  title: string; // "How to Save Money", "Budgeting Basics", "Avoiding Scams", "Understanding Credit Cards", "Investing for Beginners"
  category: string;
  durationMinutes: number;
  readTime: string;
  contentMarkdown: string;
  quiz: { question: string; options: string[]; correctAnswerIndex: number; explanation: string }[];
  isCompleted?: boolean;
}

export interface AIForecastResponse {
  predictedMonthTotal: number;
  projectedDeficitOrSurplus: number;
  riskLevel: "Safe" | "Moderate Risk" | "High Overspend Warning";
  recommendedDailyLimit: number;
  recommendations: string[];
  summaryText: string;
}
