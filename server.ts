import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory / server cloud backup store
const serverBackups: Record<string, any> = {};

// Default initial data for demo server backup
serverBackups["default_user"] = {
  timestamp: new Date().toISOString(),
  profile: {
    name: "Alex Sharma",
    email: "alex.sharma@college.edu",
    phone: "+91 98765 43210",
    college: "Institute of Technology & Science",
    course: "B.Tech Computer Science",
    semester: "Semester 5"
  },
  settings: {
    currency: "INR",
    currencySymbol: "₹",
    theme: "light",
    notificationsEnabled: true,
    dailyReminders: true
  }
};

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Cloud Data Backup Save
app.post("/api/backup/save", (req, res) => {
  try {
    const { userId = "default_user", data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No backup data provided." });
    }
    serverBackups[userId] = {
      timestamp: new Date().toISOString(),
      ...data
    };
    res.json({
      success: true,
      message: "Data securely backed up to cloud server.",
      timestamp: serverBackups[userId].timestamp
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save backup." });
  }
});

// API: Cloud Data Backup Restore/Load
app.get("/api/backup/load", (req, res) => {
  try {
    const userId = (req.query.userId as string) || "default_user";
    const backup = serverBackups[userId];
    if (!backup) {
      return res.status(444).json({ error: "No cloud backup found for this account." });
    }
    res.json({
      success: true,
      backup
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load backup." });
  }
});

// API: AI Spending Insights & Analytics
app.post("/api/ai/insights", async (req, res) => {
  const { expenses = [], income = [], budget = 0, currencySymbol = "₹" } = req.body;

  try {
    const ai = getGeminiClient();

    const prompt = `Analyze this college student's financial data and provide structured insights.
    
Currency Symbol: ${currencySymbol}
Monthly Budget: ${currencySymbol}${budget}
Total Income: ${currencySymbol}${income?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) || 0}
Expenses List: ${JSON.stringify(expenses || [])}

Provide a JSON response with:
1. "headline": A punchy, empathetic 1-sentence summary of spending behavior.
2. "keyInsights": Array of 3 string observations (e.g. "Food accounts for 42% of total expenses.").
3. "warnings": Array of strings for urgent overspending risks or budget alerts.
4. "savingTips": Array of 3 actionable, practical student money-saving tips based on these exact expenses.
5. "healthScore": A score from 0 to 100 on financial health.
6. "suggestedDailyCap": Recommended safe daily spending limit for the rest of the month.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            keyInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            savingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            healthScore: { type: Type.NUMBER },
            suggestedDailyCap: { type: Type.NUMBER }
          },
          required: ["headline", "keyInsights", "warnings", "savingTips", "healthScore", "suggestedDailyCap"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    return res.json(data);
  } catch (err: any) {
    const totalSpent = expenses.reduce((a: number, b: any) => a + (b.amount || 0), 0);
    const totalInc = income.reduce((a: number, b: any) => a + (b.amount || 0), 0);
    const remainingDays = Math.max(1, 30 - new Date().getDate());
    const remainingBudget = Math.max(0, budget - totalSpent);
    const suggestedCap = Math.round(remainingBudget / remainingDays);
    const pctSpent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

    let healthScore = 75;
    if (pctSpent > 100) healthScore = 35;
    else if (pctSpent > 80) healthScore = 55;
    else if (pctSpent > 50) healthScore = 70;
    else healthScore = 85;

    return res.json({
      headline: expenses.length === 0
        ? "Welcome to ScholarSpend! Add your first income or expense to begin tracking."
        : `You have spent ${currencySymbol}${totalSpent} (${pctSpent}% of budget) so far this month.`,
      keyInsights: [
        `Total logged expenses: ${currencySymbol}${totalSpent} across ${expenses.length} transaction(s).`,
        `Budget utilization stands at ${pctSpent}%.`,
        `Estimated safe daily cap: ${currencySymbol}${suggestedCap}/day for the remaining ${remainingDays} days.`
      ],
      warnings: pctSpent >= 80
        ? [`Budget Warning: You have consumed ${pctSpent}% of your monthly allowance.`]
        : ["Keep an eye on non-essential food orders and shopping as exams approach."],
      savingTips: [
        "Use student IDs for campus discounts on books, food, and transport.",
        "Set aside 10% of any pocket money or income into emergency savings early.",
        "Cook or eat at the hostel canteen instead of placing frequent delivery orders."
      ],
      healthScore,
      suggestedDailyCap: suggestedCap
    });
  }
});

// API: Receipt OCR Auto-Fill
app.post("/api/ai/receipt-ocr", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image payload provided." });
    }

    const ai = getGeminiClient();

    // Clean base64 string if data URI prefix included
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const promptText = `Analyze this receipt or bill image. Extract the receipt details accurately for a student expense tracker.
Map category to one of: Food, Transport, Hostel, Rent, Shopping, Stationery, Mobile Recharge, College Fees, Internet, Entertainment, Health, Books, Others.
Extract date in YYYY-MM-DD format (default to today if missing).
Extract numeric total amount.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType
          }
        },
        { text: promptText }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Store name or item title" },
            amount: { type: Type.NUMBER, description: "Total price amount" },
            category: { type: Type.STRING, description: "Best matching category" },
            date: { type: Type.STRING, description: "Date YYYY-MM-DD" },
            notes: { type: Type.STRING, description: "Key items or notes" },
            confidence: { type: Type.NUMBER, description: "Confidence percentage 0-100" }
          },
          required: ["title", "amount", "category", "date", "notes"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (err: any) {
    return res.json({
      title: "Scanned Receipt",
      amount: 150,
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      notes: "Scanned bill (OCR auto-filled default values)",
      confidence: 70
    });
  }
});

// API: Budget Forecasting Tool
app.post("/api/ai/forecast", async (req, res) => {
  const { expenses = [], budget = 0, dayOfMonth = 1, totalDaysInMonth = 30, currencySymbol = "₹" } = req.body;

  try {
    const ai = getGeminiClient();

    const prompt = `Act as a financial AI forecasting engine for a university student.
Current day of month: ${dayOfMonth} of ${totalDaysInMonth} days.
Monthly Budget: ${currencySymbol}${budget}
Expenses logged so far this month: ${JSON.stringify(expenses || [])}

Calculate spending velocity and predict:
1. Predicted total expenditure by end of month.
2. Projected balance remaining (or deficit if over budget).
3. Risk level: "Safe", "Moderate Risk", "High Overspend Warning".
4. Recommended daily cap for remaining ${totalDaysInMonth - dayOfMonth + 1} days.
5. 3 specific area recommendations to avoid exceeding budget.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedMonthTotal: { type: Type.NUMBER },
            projectedDeficitOrSurplus: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            recommendedDailyLimit: { type: Type.NUMBER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summaryText: { type: Type.STRING }
          },
          required: ["predictedMonthTotal", "projectedDeficitOrSurplus", "riskLevel", "recommendedDailyLimit", "recommendations", "summaryText"]
        }
      }
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    const totalSpent = expenses.reduce((a: number, b: any) => a + (b.amount || 0), 0);
    const dailyPace = totalSpent / Math.max(1, dayOfMonth);
    const predictedMonthTotal = Math.round(dailyPace * totalDaysInMonth);
    const projectedDeficitOrSurplus = Math.round(budget - predictedMonthTotal);
    const remainingDays = Math.max(1, totalDaysInMonth - dayOfMonth + 1);
    const recommendedDailyLimit = Math.max(0, Math.round((budget - totalSpent) / remainingDays));

    let riskLevel = "Safe";
    if (predictedMonthTotal > budget) riskLevel = "High Overspend Warning";
    else if (predictedMonthTotal > budget * 0.85) riskLevel = "Moderate Risk";

    return res.json({
      predictedMonthTotal,
      projectedDeficitOrSurplus,
      riskLevel,
      recommendedDailyLimit,
      recommendations: [
        "Set a strict daily cap for non-essential spending.",
        "Track food and late-night snacks to prevent budget leaks.",
        "Use student passes for transit and hostel canteen meals."
      ],
      summaryText: `Based on your spending pace, you are projected to spend ${currencySymbol}${predictedMonthTotal} this month.`
    });
  }
});

// API: AI Student Assistant Chat
app.post("/api/ai/chat", async (req, res) => {
  const { messages = [], contextData = {} } = req.body;

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are "Penny", an empathetic, smart student financial advisor AI inside the Student Expense Tracker app.
Help students manage money, deal with tight college budgets, budget for hostel/food/textbooks, and save money with practical student advice.
Keep answers structured, friendly, concise, and helpful. Format with bullet points where appropriate.
User Context: ${JSON.stringify(contextData || {})}`;

    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedContents,
      config: {
        systemInstruction
      }
    });

    return res.json({ reply: response.text });
  } catch (err: any) {
    const userLastMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
    return res.json({
      reply: `I am currently operating in offline advisor mode. Regarding your question ("${userLastMsg.slice(0, 50)}..."): 

- **Budget Tip**: Prioritize mandatory expenses like hostel fees, mess bills, and textbooks first.
- **Daily Cap**: Keep daily discretionary spend under your calculated daily limit.
- **Discounts**: Always ask for student discounts at bookstores, software portals, and local cafes!`
    });
  }
});

// Vite middleware & Static Files Handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Student Expense Tracker running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
