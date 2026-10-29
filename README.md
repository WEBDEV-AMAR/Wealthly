# 💚 Wealthly — Plan Today. A Better Tomorrow.

**Wealthly** is a modern personal finance management platform designed to help users organize their financial lives in one place. It brings together income and expense tracking, budgeting, savings goals, investment tracking, subscriptions, and financial analytics through a clean, responsive interface.

The long-term vision is to make personal finance management more accessible to Indian users through personalized insights and AI-powered financial assistance.

> **Plan Today. A Better Tomorrow.**

---

## ✨ Features

### 🔐 Authentication & Security
- Email and password authentication powered by Supabase Auth.
- Google OAuth sign-in integration.
- User-specific authentication sessions.
- Protected application routes.
- Logout functionality.
- Dynamic user profiles using authentication metadata.
- Row Level Security (RLS) policies for user-specific financial data.

### 👋 Personalized Onboarding
A multi-step onboarding experience that collects a user's initial financial information.

- Income and salary details.
- Monthly expense categories.
- Subscription details and billing cycles.
- Savings goals and targets.
- Existing investments.
- Onboarding completion tracking.

Onboarding data is designed to be stored in the corresponding Supabase database tables.

### 📊 Dashboard
A centralized overview of personal finances featuring:

- Total balance and financial summaries.
- Income and expense overview.
- Recent transactions.
- Spending breakdowns.
- Savings goal progress.
- Financial overview cards.

The dashboard includes demo financial data while dynamic integration with the database is being developed.

### 💳 Transaction Management
- Income and expense transaction structure.
- Transaction categories.
- Transaction descriptions.
- Payment method support.
- Transaction date tracking.

### 💰 Budget Management
- Budget overview interface.
- Expense category breakdowns.
- Spending progress visualization.

### 🎯 Savings Goals
- Create and track savings goals.
- Set target amounts and dates.
- Record current savings.
- Monitor progress toward financial targets.

### 📈 Investment Tracking
- Mutual funds.
- Stocks.
- Fixed deposits.
- Gold.
- Index funds.
- Other investments.

Track invested amounts and current investment values.

### 🔎 Investment Discovery
An interface for exploring investment opportunities and financial products.

### 🧮 SIP & Investment Calculator
A dedicated calculator interface for investment planning and projected returns.

### 📉 Financial Analytics
Visualizations and summaries designed to help users understand spending patterns and financial activity.

### 🔄 Subscription Tracking
- Track recurring subscriptions.
- Store subscription amounts.
- Support monthly and yearly billing cycles.
- Record upcoming billing dates.

### 🤖 AI Finance Assistant — Planned
The long-term vision includes an AI-powered financial assistant that can help users understand their spending patterns, explore budgeting strategies, and receive personalized financial insights.

AI integration and live financial data capabilities are still under development.

### ⚙️ Profile & Settings
- User profile information.
- Account settings.
- Authentication-based logout.

---

## 🖥️ Application Pages

| Page | Route |
|---|---|
| Onboarding | `/onboarding` |
| Authentication | `/auth` |
| Dashboard | `/dashboard` |
| Transactions | `/transactions` |
| Budget | `/budget` |
| Savings Goals | `/goals` |
| Investments | `/investments` |
| Investment Discovery | `/investment-discovery` |
| Fund Details | `/fund-details` |
| SIP Calculator | `/calculator` |
| Analytics | `/analytics` |
| Subscriptions | `/subscriptions` |
| AI Assistant | `/ai-assistant` |
| Profile & Settings | `/settings` |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** — React framework and application routing.
- **React 19** — Component-based UI.
- **TypeScript** — Type-safe development.
- **Tailwind CSS 4** — Styling and responsive layouts.
- **shadcn/ui** — Reusable interface components.
- **Lucide React** — Icons.
- **Recharts** — Financial data visualization.

### Backend & Database
- **Supabase** — Authentication and backend services.
- **PostgreSQL** — Relational database.
- **Supabase Row Level Security (RLS)** — User-level data access policies.
- **Supabase SSR** — Authentication session handling across client and server contexts.

### Planned Integrations
- Python and FastAPI for additional backend services.
- An LLM API for AI-powered financial assistance.
- External financial data sources for investment discovery and market information.

---

## 🗄️ Database Structure

Wealthly uses Supabase with PostgreSQL.

| Table | Purpose |
|---|---|
| `profiles` | User profile information and onboarding status |
| `financial_income` | Salary and other income records |
| `transactions` | Income and expense transactions |
| `subscriptions` | Recurring subscription records |
| `goals` | Savings goals and target amounts |
| `investments` | Investment holdings and current values |

Financial tables associate records with authenticated users through `user_id`. The profile table uses the authenticated user's ID.

Row Level Security policies are configured to restrict access to users' own records.

---

## 🎨 Design Philosophy

Wealthly follows a modern fintech design approach focused on clarity, usability, and consistency.

- Dark charcoal backgrounds.
- Emerald and green accents.
- Clean typography and rounded cards.
- Responsive layouts for desktop and mobile.
- Consistent navigation and reusable UI components.
- A leaf-inspired brand identity.

The goal is to make financial information easier to understand without overwhelming users.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended).
- npm.
- Git.
- A Supabase account.

### 1. Clone the repository

```bash
git clone https://github.com/WEBDEV-AMAR/Wealthly.git
cd Wealthly
```

### 2. Navigate to the frontend

```bash
cd frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file inside the `frontend` directory.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with your own Supabase project credentials.

**Never commit `.env.local`, service-role keys, database passwords, OAuth secrets, or other private credentials to GitHub.**

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Supabase Configuration

To run the authentication and onboarding functionality, configure your own Supabase project.

1. Create a Supabase project.
2. Configure email authentication.
3. Configure Google OAuth credentials if Google sign-in is required.
4. Set the correct site URL and redirect URLs.
5. Create the required database tables.
6. Enable Row Level Security and configure the necessary policies.
7. Configure the required environment variables.

The application expects the database tables and columns described in the database structure section.

---

## 🔒 Security Considerations

- Keep private credentials out of source control.
- Use the publishable key in client-side configuration only as intended.
- Never expose a Supabase service-role key in the browser.
- Apply RLS policies to tables containing user-specific financial information.
- Validate user input before storing financial records.
- Use secure authentication and redirect configurations.
- Do not treat client-side route protection as the only layer of database security.

---

## 🗺️ Development Roadmap

- [x] Responsive fintech UI.
- [x] Authentication page.
- [x] Supabase email/password authentication.
- [x] Google OAuth integration.
- [x] Protected application routes.
- [x] Dynamic user profile information.
- [x] Initial Supabase database schema and RLS policies.
- [x] Multi-step onboarding interface.
- [x] Onboarding data persistence implementation.
- [ ] Route users to onboarding or dashboard based on onboarding completion.
- [ ] Connect dashboard summaries to real database records.
- [ ] Complete dynamic transaction, budget, goal, and investment views.
- [ ] Add robust error handling and data validation.
- [ ] Implement the AI finance assistant.
- [ ] Integrate reliable external financial data sources.
- [ ] Add automated tests and production monitoring.
- [ ] Deploy the application for public access.

---

## 👨‍💻 About the Developer

**Amarnath Singh**  
Computer Science Engineering Graduate — Artificial Intelligence & Machine Learning

Wealthly is an independently developed project focused on combining full-stack engineering, financial technology, and AI to make personal finance management more accessible.

I am building Wealthly with the long-term goal of turning it into a practical product for everyday users.

---

## 📌 Project Status

**Status:** Active Development

Wealthly's responsive frontend, authentication foundation, Supabase database structure, and onboarding workflow are being developed incrementally. Some screens currently use demo data, and full database-driven functionality and AI capabilities remain in progress.

---

## 📬 Repository

**GitHub:** https://github.com/WEBDEV-AMAR/Wealthly

If you find the project interesting, feel free to explore the repository and follow its development.

---

*Wealthly — Plan Today. A Better Tomorrow. 💚*
