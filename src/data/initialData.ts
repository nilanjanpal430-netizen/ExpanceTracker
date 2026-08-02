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
} from "../types";

export const initialProfile: UserProfile = {
  id: "user_101",
  name: "Student User",
  email: "",
  phone: "",
  college: "University Campus",
  course: "",
  semester: "",
  isLoggedIn: true
};

export const initialSettings: AppSettings = {
  currency: "INR",
  currencySymbol: "₹",
  theme: "light",
  notificationsEnabled: true,
  dailyReminders: true,
  language: "English"
};

export const initialBudget: Budget = {
  monthlyBudget: 0,
  categoryBudgets: {
    Food: 0,
    Transport: 0,
    Hostel: 0,
    Shopping: 0,
    Books: 0,
    "Mobile Recharge": 0,
    Entertainment: 0,
    Stationery: 0,
    Others: 0
  },
  alertThreshold: 80
};

export const initialIncomes: Income[] = [];

export const initialExpenses: Expense[] = [];

export const initialGoals: SavingsGoal[] = [];

export const initialSubscriptions: SubscriptionItem[] = [];

export const initialChallenges: SmartChallenge[] = [
  {
    id: "chal_1",
    title: "No Food Delivery Challenge",
    description: "Cook or eat at campus canteen for 7 consecutive days without online food apps.",
    durationDays: 7,
    currentDay: 0,
    rewardBadge: "Home Chef Champ 🍳",
    badgeIcon: "Utensils",
    targetSaving: 800,
    isJoined: false,
    isCompleted: false,
    category: "Food"
  },
  {
    id: "chal_2",
    title: "Save ₹100 Every Day",
    description: "Set aside ₹100 into savings every single day for 14 days straight.",
    durationDays: 14,
    currentDay: 0,
    rewardBadge: "Daily Saver Badge 💰",
    badgeIcon: "Coins",
    targetSaving: 1400,
    isJoined: false,
    isCompleted: false,
    category: "Others"
  },
  {
    id: "chal_3",
    title: "Zero Shopping Week",
    description: "Avoid buying non-essential clothes, gear, or online gadgets for 7 days.",
    durationDays: 7,
    currentDay: 0,
    rewardBadge: "Frugal Master 🛍️",
    badgeIcon: "ShoppingBag",
    targetSaving: 1200,
    isJoined: false,
    isCompleted: false,
    category: "Shopping"
  },
  {
    id: "chal_4",
    title: "No Coffee Challenge",
    description: "Switch to hostel tea or water for 5 days instead of café espresso.",
    durationDays: 5,
    currentDay: 0,
    rewardBadge: "Caffeine Detox ☕",
    badgeIcon: "Coffee",
    targetSaving: 350,
    isJoined: false,
    isCompleted: false,
    category: "Food"
  }
];

export const initialEmergencyFund: EmergencyFund = {
  targetAmount: 0,
  currentAmount: 0,
  monthlyContribution: 0,
  lastUpdated: new Date().toISOString().split("T")[0],
  logs: []
};

export const initialDiscounts: StudentDiscount[] = [];

export const initialPriceItems: PriceItem[] = [];

export const initialScholarships: ScholarshipItem[] = [];

export const initialLeaderboard: LeaderboardUser[] = [];

export const initialLearningLessons: LearningLesson[] = [
  {
    id: "less_1",
    title: "How to Save Money in College",
    category: "Budgeting Basics",
    durationMinutes: 5,
    readTime: "4 min read",
    contentMarkdown: `
### Key Strategies for Student Savings
1. **Rule of 50/30/20**: Allocate 50% for needs (hostel, books), 30% for wants, and 20% for emergency savings.
2. **Avoid impulse food orders**: Small daily food orders add up fast over a month!
3. **Use Student Discounts**: Always carry your College ID for discounts on software, transport, books, and cafes.
    `,
    quiz: [
      {
        question: "What percentage of monthly allowance is recommended for savings under the 50/30/20 rule?",
        options: ["5%", "10%", "20%", "50%"],
        correctAnswerIndex: 2,
        explanation: "20% is recommended for savings and building an emergency safety cushion."
      }
    ],
    isCompleted: false
  },
  {
    id: "less_2",
    title: "Understanding Credit Cards & CIBIL",
    category: "Credit & Loans",
    durationMinutes: 6,
    readTime: "5 min read",
    contentMarkdown: `
### What Students Must Know About Credit
- Never spend more on credit than what you have cash for.
- Pay 100% of the total bill amount before the due date to avoid high interest charges.
- Building credit early with a student credit card improves loan eligibility for higher studies.
    `,
    quiz: [
      {
        question: "What happens if you only pay the minimum due amount on a credit card?",
        options: [
          "Zero interest charged",
          "High interest accumulates on remaining balance",
          "Your credit score automatically increases",
          "No impact"
        ],
        correctAnswerIndex: 1,
        explanation: "Paying minimum due triggers high interest charges on unpaid balance."
      }
    ],
    isCompleted: false
  },
  {
    id: "less_3",
    title: "Avoiding Student Scams & Phishing",
    category: "Financial Safety",
    durationMinutes: 4,
    readTime: "3 min read",
    contentMarkdown: `
### Top Red Flags for College Students
- Fake job offers requiring 'registration fee'.
- Fake scholarship calls asking for bank OTPs.
- Instant loan apps with hidden interest rates and invasive phone permissions.
    `,
    quiz: [
      {
        question: "Should a legitimate recruiter or scholarship provider ask for an advance fee or OTP?",
        options: ["Yes, for verification", "Never", "Only for high paying jobs", "Only for bank transfers"],
        correctAnswerIndex: 1,
        explanation: "No real recruiter or government body will EVER ask for an advance fee or confidential OTP."
      }
    ],
    isCompleted: false
  },
  {
    id: "less_4",
    title: "Investing Basics for Beginners",
    category: "Wealth Building",
    durationMinutes: 7,
    readTime: "6 min read",
    contentMarkdown: `
### Power of Compounding
Starting small during college yields massive long-term compound growth over time.
    `,
    quiz: [
      {
        question: "What is the biggest advantage of starting to invest early in college?",
        options: ["Guaranteed 100% returns", "Power of compounding over time", "Free tax exemptions", "No risk at all"],
        correctAnswerIndex: 1,
        explanation: "Time gives compound interest exponential runway to grow your money."
      }
    ],
    isCompleted: false
  }
];

export const initialRoommateSplits: RoommateSplit[] = [];

export const initialFeeReminders: FeeReminder[] = [];
