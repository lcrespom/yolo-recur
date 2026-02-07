# Recurring Payments Tracking App

A modern web application for tracking and managing recurring payments (subscriptions,
memberships, utilities, etc.). Built with React 19, TypeScript, and a carefully selected
stack for type-safety, performance, and maintainability.

## Tech Stack

- **TypeScript** — strict type-checked codebase
- **React 19** with **Vite** for builds and HMR
- **TanStack Router** — file-based, type-safe routing
- **Tailwind CSS 4** with **DaisyUI 5** — utility-first styling and component library
- **Lucide React** — icon library
- **Dark/Light theme** — auto-selected based on system preference
- **Vitest** + **React Testing Library** — unit and component testing
- **Prettier** (with Tailwind plugin) + **ESLint** — formatting and linting

The setup steps are described [here](setup-steps.md).

## Getting Started

### Install dependencies

```sh
npm install
```

### Run the dev server

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

### Preview the production build

```sh
npm run preview
```

### Run tests

```sh
npm test
```

### Format and lint

```sh
npm run format
npm run lint
```

## Features

### Dashboard

- **Expense Summary** — view total monthly and yearly expenses
- **Upcoming Payments** — see which payments are due soon (unpaid payment history entries)
- **Expenses by Location** — breakdown of costs grouped by location (e.g., Home, Office,
  Personal)
- **Automatic Payment Generation** — the app automatically generates payment history
  entries based on due dates

### Payments Management

- **Payments List** — searchable and sortable table of all recurring payments
- **Add/Edit Payments** — comprehensive form for managing payment details:
  - Basic info: name, location, company
  - Contact: website, phone
  - Payment settings: cost, frequency (monthly, quarterly, yearly, etc.)
  - Payment schedule: payment day and start month
  - Bank/payment method
- **Payment History** — track when payments were made and mark them as paid
- **Form Validation** — real-time validation with user-friendly error messages
- **Unsaved Changes Detection** — warns before leaving with unsaved edits

### User Experience

- **Dark/Light Theme** — automatically matches system preference
- **Responsive Design** — works on desktop, tablet, and mobile
- **Loading States** — spinner indicators during async operations
- **Error Handling** — user-friendly error messages with network error detection
- **Error Boundaries** — graceful error recovery for React errors

## Project Structure

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout with navbar and error boundary
│   ├── index.tsx        # Home page
│   ├── dashboard/       # Dashboard page
│   └── payments/        # Payments list and detail pages
├── components/          # React components
│   ├── common/          # Shared components (Navbar, ThemeToggle, FormInput, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   └── payments/        # Payment-specific components
├── services/            # API service layer
│   ├── payment-service.ts          # Recurring payments CRUD
│   ├── payment-history-service.ts  # Payment history CRUD
│   ├── payment-generator.ts        # Auto-generate due payments
│   └── expense-calculation-service.ts  # Calculate totals and summaries
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (formatting, error handling)
├── validation/          # Zod schemas for form validation
└── test/                # Test setup and utilities
```

## Backend Setup

This app uses [json-server](https://github.com/typicode/json-server) as a simple REST API
backend for development.

### Start the backend server

```sh
npx json-server db.json --port 3001
```

The backend runs on `http://localhost:3001` and provides:

- `/recurringPayments` — CRUD endpoints for recurring payments
- `/paymentHistory` — CRUD endpoints for payment history

### Data Schema

**RecurringPayment**

```typescript
{
  id: string
  name: string          // e.g., "Netflix Subscription"
  location: string      // e.g., "Home", "Office"
  company: string       // e.g., "Netflix"
  website?: string
  phone?: string
  periodicity: number   // months between payments (1=monthly, 12=yearly)
  paymentMonth: number  // starting month (1-12)
  paymentDay: number    // day of month (1-31)
  cost: number
  bank?: string
}
```

**PaymentHistoryEntry**

```typescript
{
  id: string
  recurringPaymentId: string
  date: string // ISO date string
  amount: number
  isPaid: boolean
}
```

## Development Workflow

1. **Start the backend** — `npx json-server db.json --port 3001`
2. **Start the dev server** — `npm run dev`
3. **Open browser** — navigate to `http://localhost:5173`

The app will automatically generate payment history entries for recurring payments based
on their due dates.
