# Recurring Payments Tracking App - Implementation Plan

## Phase 1: Foundation & Setup ✅

### Backend Setup

- [x] Create `db.json` file for json-server with initial schema (recurring_payments,
      payment_history)
- [x] Test json-server endpoints

### Type Definitions

- [x] Create `src/types/payment.ts` with TypeScript interfaces for:
  - RecurringPayment (id, name, location, company, website, phone, periodicity,
    paymentMonth, paymentDay, cost, bank)
  - PaymentHistoryEntry (id, recurringPaymentId, date, amount, isPaid)
  - API response types

### Service Layer

- [x] Create `src/services/payment-service.ts` with functions:
  - `getRecurringPayments()` - fetch all recurring payments
  - `getRecurringPayment(id)` - fetch single payment
  - `createRecurringPayment(data)` - create new payment
  - `updateRecurringPayment(id, data)` - update payment
  - `deleteRecurringPayment(id)` - delete payment
- [x] Create `src/services/payment-history-service.ts` with functions:
  - `getPaymentHistory(recurringPaymentId)` - fetch history for a payment
  - `createPaymentHistoryEntry(data)` - add payment history
  - `updatePaymentHistoryEntry(id, data)` - update history entry
- [x] Create `src/services/payment-gnerator.ts` with:
  - `generateDuePayments()` - auto-generate payment history entries based on due dates
  - Helper functions for date calculations

## Phase 2: Payments List Page ✅

### Route & Component

- [x] Create `src/routes/payments/index.tsx` - payments list route
- [x] Create `src/components/payments-table.tsx` - table component displaying all
      recurring payments
- [x] Add click handler to navigate to detail page
- [x] Add "New Payment" button
- [x] Update navigation links in `__root.tsx`

### Styling & Features

- [x] Style table with DaisyUI table classes
- [x] Add sorting capabilities (by name, cost, next due date)
- [x] Add search/filter functionality
- [x] Show next payment due date for each recurring payment

### Testing

- [x] Create `src/components/payments-table.test.tsx`
- [x] Test table rendering with mock data
- [x] Test navigation on row click
- [x] Run `npx tsc` to validate types

## Phase 3: Payment Detail/Editor Page ✅

### Route & Component

- [x] Create `src/routes/payments/$paymentId.tsx` - detail/edit route
- [x] Create `src/components/payment-form.tsx` - form component
- [x] Implement form validation (React Hook Form + Zod)
- [x] Add unsaved changes detection (isDirty from React Hook Form)

### Features

- [x] Load existing payment data or initialize for new payment
- [x] Display/edit all payment fields (name, location, company, website, phone,
      periodicity, etc.)
- [x] Show payment history section with date and amount
- [x] Add "Save" button (create or update)
- [x] Add "Delete" button with confirmation modal
- [x] Add "Cancel/Back" button with unsaved changes warning
- [x] Allow editing individual payment history entries

### Styling

- [x] Use DaisyUI form components (input, select, textarea)
- [x] Create card layout for payment history
- [x] Implement confirmation modal with DaisyUI

### Additional Improvements

- [x] Created `FormInput` component to reduce repetition
- [x] Used Tailwind `@apply` to create reusable `.form-row` class
- [x] Improved accessibility with proper label wrapping
- [x] Integrated React Hook Form for better form state management

### Testing

- [x] Create `src/components/payment-form.test.tsx`
- [x] Test form validation
- [x] Test save/update functionality
- [x] Test delete with confirmation
- [x] Test unsaved changes warning
- [x] Run `npx tsc` to validate types

## Phase 4: Dashboard Page

### Route & Component

- [x] Create `src/routes/dashboard/index.tsx` - dashboard route
- [x] Create `src/components/expenses-summary.tsx` - summary cards component
- [x] Create `src/components/expenses-by-location.tsx` - location breakdown
- [ ] Create `src/components/expenses-chart.tsx` (optional) - visual representation

### Features

- [x] Calculate total expenses (monthly, yearly)
- [x] Group expenses by location
- [x] Show upcoming payments (unpaid payment history entries)
- [ ] Display cost trends

### Styling

- [x] Use DaisyUI stats/cards for summaries
- [x] Create responsive grid layout
- [x] Add proper spacing and visual hierarchy

### Testing

- [x] Create tests for dashboard components
- [x] Test calculation logic
- [x] Test grouping/filtering
- [x] Run `npx tsc` to validate types

## Phase 5: Auto-Payment Generation ✅

### Implementation

- [x] Create utility to calculate next payment due date
- [x] Implement logic to check for due payments
- [x] Auto-generate payment history entries
- [x] Add initialization check (generate on dashboard load)
- [x] Handle edge cases (month-end dates, leap years)

### Testing

- [x] Create `src/services/payment-generator.test.ts`
- [x] Test periodicity calculations (monthly, yearly, custom)
- [x] Test edge cases (month-end dates, leap years, quarterly)
- [x] Run `npx tsc` to validate types

## Phase 6: Integration & Polish ✅

### Navigation

- [x] Update `__root.tsx` navLinks with new routes (Payments, Dashboard)
- [x] Remove old placeholder routes (page1, page2)
- [x] Update home page to show app introduction

### Error Handling

- [x] Add error boundaries
- [x] Add loading states for async operations
- [x] Add user-friendly error messages
- [x] Handle network errors gracefully

### Final Testing

- [x] Run full test suite: `npm test`
- [x] Validate TypeScript: `npx tsc`
- [x] Test all user flows end-to-end
- [x] Test with various data scenarios

### Documentation

- [x] Update README with app description and usage
- [x] Document API service layer
- [x] Add comments for complex logic

## Phase 7: Migrate from json-server to Supabase

- [ ] Get the Supabase project URL and anonymous key from the environment
      (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, respectively). Make those keys
      available to the application through the config module.
- [ ] Setup a login page, supporting Supabase login for existing users and sign in for new
      ones.
- [ ] If a user is logged in, link to Dashboard and Payments pages from the navbar.
      Otherwise, provide two links in the navbar: one for login and one for sign in, both
      pointing to the login page but with the two variants (login or sign in) through a
      path parameter.
- [ ] Adapt the welcome page to be aware of login status. If no user is logged in, the
      links to dashboard and payments should be removed and a links to login/signin should
      be provided.
- [ ] Generate a SQL/DDL script for creating the required tables and RLS constraints. The
      developer will manually upload those scripts to the Supabase project using the
      Supabase Web console.
- [ ] When the user is logged in, provide a logout link in the NavBar.
- [ ] Re-implement all backend access services with Supabase API calls.
- [ ] Review backend access queries for efficiency/performance.

## Notes

- Each task should be completed and validated before moving to the next
- Run tests after implementing each feature
- Run `npx tsc` and `npm run lint` to catch type errors early
- Use DaisyUI components for consistent styling
- Follow existing code style (Prettier config)
