# Student Expense Tracker - API & Architecture Documentation

## Overview
Student Expense Tracker is a full-stack web application built with React, TypeScript, Express, Tailwind CSS, and Google Gemini 3.6 Flash AI. It helps college and university students manage daily expenses, set monthly budgets, predict month-end spending velocity, scan receipts using AI OCR, and securely back up data to the cloud.

---

## Database Schemas & Data Structures

### 1. Users Profile Table
```json
{
  "id": "user_101",
  "name": "Alex Sharma",
  "email": "alex.sharma@college.edu",
  "phone": "+91 98765 43210",
  "college": "National Institute of Science & Tech",
  "course": "B.Tech Computer Science",
  "semester": "Semester 5",
  "isLoggedIn": true
}
```

### 2. Expenses Table
```json
{
  "id": "exp_1",
  "title": "Burger & Dinner",
  "amount": 180,
  "category": "Food",
  "date": "2026-08-01",
  "notes": "Dinner with campus friends at Canteen",
  "paymentMethod": "UPI",
  "tags": ["Food", "Friends"],
  "receiptImage": "data:image/jpeg;base64,..."
}
```

### 3. Income Table
```json
{
  "id": "inc_1",
  "source": "Pocket Money",
  "amount": 10000,
  "date": "2026-08-01",
  "notes": "Monthly pocket money from Parents"
}
```

### 4. Monthly Budget Table
```json
{
  "monthlyBudget": 12000,
  "categoryBudgets": {
    "Food": 4000,
    "Transport": 1200,
    "Hostel": 3000,
    "Shopping": 1500,
    "Books": 1000,
    "Mobile Recharge": 500,
    "Entertainment": 800
  },
  "alertThreshold": 80
}
```

### 5. Savings Goals Table
```json
{
  "id": "goal_1",
  "goalName": "Buy Coding Laptop",
  "targetAmount": 60000,
  "savedAmount": 24500,
  "targetDate": "2026-12-15",
  "category": "Electronics"
}
```

---

## Server API Endpoints (Express + Gemini 3.6 Flash)

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{ "status": "ok", "timestamp": "2026-08-01T..." }`

### 2. AI Spending Insights & Analytics
- **Endpoint**: `POST /api/ai/insights`
- **Description**: Uses Gemini 3.6 Flash to analyze transaction history, generate spending health score (0-100), key observations, budget alerts, and student money-saving tips.
- **Request Body**:
  ```json
  {
    "expenses": [...],
    "income": [...],
    "budget": 12000,
    "currencySymbol": "₹"
  }
  ```
- **Response**:
  ```json
  {
    "headline": "You spent 35% more on food this week.",
    "keyInsights": ["Food accounts for 42% of total expenses."],
    "warnings": ["Budget limit close to 85%."],
    "savingTips": ["Use hostel mess pass on weekends."],
    "healthScore": 82,
    "suggestedDailyCap": 350
  }
  ```

### 3. Receipt OCR Auto-Fill
- **Endpoint**: `POST /api/ai/receipt-ocr`
- **Description**: Uses Gemini 3.6 Flash Vision to analyze receipt photos and extract expense title, amount, category, date, and notes automatically.
- **Request Body**:
  ```json
  {
    "imageBase64": "data:image/jpeg;base64,...",
    "mimeType": "image/jpeg"
  }
  ```
- **Response**:
  ```json
  {
    "title": "Campus Books & Stationery",
    "amount": 450,
    "category": "Books",
    "date": "2026-08-01",
    "notes": "Reference notebook"
  }
  ```

### 4. AI Budget Forecasting Engine
- **Endpoint**: `POST /api/ai/forecast`
- **Description**: Calculates spending velocity based on current day of month and projects month-end total, risk level, daily cap, and recommendations.
- **Request Body**:
  ```json
  {
    "expenses": [...],
    "budget": 12000,
    "dayOfMonth": 5,
    "totalDaysInMonth": 31,
    "currencySymbol": "₹"
  }
  ```

### 5. Interactive AI Student Financial Advisor
- **Endpoint**: `POST /api/ai/chat`
- **Description**: Interactive conversational assistant "Penny" for student budgeting questions.

### 6. Cloud Backup & Restore
- **Save Backup**: `POST /api/backup/save`
- **Restore Backup**: `GET /api/backup/load?userId=...`

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React Icons, Recharts, Canvas Confetti
- **Backend**: Express.js, @google/genai SDK, Node.js
- **Model**: Google Gemini 3.6 Flash
