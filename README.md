# 🌱 Wealthly

> **Plan Today. A Better Tomorrow.**

Wealthly is a modern personal finance platform designed to help users track, understand, and improve their financial life from one place.

It combines **expense tracking, budgeting, savings goals, investments, analytics, subscriptions, and an AI-powered finance assistant** into a single personal finance workspace.

---

## ✨ Features

### 📊 Dashboard
- Total balance overview
- Income and expense summary
- Monthly spending overview
- Savings progress
- Emergency fund tracking
- Recent transactions
- Savings goals overview

### 💳 Transactions
- Track income and expenses
- Search transactions
- Filter by income/expense
- Transaction categories
- Transaction history

### 💰 Budget
- Monthly budget management
- Category-wise spending
- Budget utilization progress
- Add and manage budgets

### 🎯 Savings Goals
- Create savings goals
- Set target amounts
- Track progress
- Monitor total saved
- Goal-based financial planning

### 📈 Investments
- Track investment portfolio
- Invested amount vs current value
- Portfolio returns
- Monthly SIP tracking
- Asset allocation overview

### 🔎 Investment Discovery
Users can explore investment scenarios based on:

- Investment amount
- Investment duration
- Risk preference
- Financial goal
- SIP frequency

The discovery system is designed to eventually connect with reliable investment data sources and provide factual, transparent information about available investment options.

### 📄 Fund Details
Detailed investment information including:

- NAV
- Expense ratio
- AUM
- Minimum SIP
- Risk level
- Historical performance
- Portfolio allocation
- SIP projections

> Current fund information shown in the UI is demonstration data until the live investment data layer is connected.

### 🧮 SIP Calculator
Calculate illustrative investment growth using:

- Monthly SIP
- One-time investment
- Investment duration
- Expected annual return

The calculator shows:

- Total invested
- Estimated growth
- Future value
- Year-wise projection

### 📊 Analytics
- Monthly income
- Monthly expenses
- Savings rate
- Cash flow
- Spending breakdown
- Investment performance
- Financial insights

### 🔔 Subscriptions
- Track recurring subscriptions
- Monthly subscription cost
- Annual subscription cost
- Upcoming payments
- Add/delete subscriptions
- Subscription overview

### 🤖 AI Finance Assistant

Wealthly includes an AI finance assistant designed to understand natural-language financial queries.

Example:

> "Where did I spend the most this month?"

> "How much can I save this month?"

> "Add ₹450 dinner expense."

The planned architecture uses AI for language understanding while keeping calculations, validation, and database updates under the application's backend.

### ⚙️ Profile & Settings
- Personal profile
- Currency preferences
- Notifications
- Subscription reminders
- Security settings
- Data export

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Recharts

## Backend

- Python
- FastAPI

## Database & Authentication

- PostgreSQL
- Supabase
- Supabase Auth

## AI

- LLM API
- Structured AI parsing
- Natural-language finance queries

## Deployment

- Vercel
- Managed FastAPI hosting
- Supabase

---

# 🏗️ Architecture

```text
Wealthly
│
├── Frontend
│   ├── Next.js
│   ├── TypeScript
│   ├── Tailwind CSS
│   ├── shadcn/ui
│   └── Recharts
│
├── Backend
│   ├── FastAPI
│   ├── Business Logic
│   ├── Financial Calculations
│   ├── AI Services
│   └── Investment Data Layer
│
├── Database
│   └── PostgreSQL / Supabase
│
└── Authentication
    └── Supabase Auth
