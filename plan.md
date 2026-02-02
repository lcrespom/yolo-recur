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

- [ ] Create `src/routes/dashboard/index.tsx` - dashboard route
- [ ] Create `src/components/expenses-summary.tsx` - summary cards component
- [ ] Create `src/components/expenses-by-location.tsx` - location breakdown
- [ ] Create `src/components/expenses-chart.tsx` (optional) - visual representation

### Features

- [ ] Calculate total expenses (monthly, yearly)
- [ ] Group expenses by location
- [ ] Group expenses by company
- [ ] Show upcoming payments
- [ ] Display cost trends

### Styling

- [ ] Use DaisyUI stats/cards for summaries
- [ ] Create responsive grid layout
- [ ] Add proper spacing and visual hierarchy

### Testing

- [ ] Create tests for dashboard components
- [ ] Test calculation logic
- [ ] Test grouping/filtering
- [ ] Run `npx tsc` to validate types

## Phase 5: Auto-Payment Generation

### Implementation

- [ ] Create utility to calculate next payment due date
- [ ] Implement logic to check for due payments
- [ ] Auto-generate payment history entries
- [ ] Add initialization check (generate on app load or route visit)
- [ ] Handle edge cases (month-end dates, leap years)

### Testing

- [ ] Create `src/services/payment-generator.test.ts`
- [ ] Test periodicity calculations (monthly, yearly, custom)
- [ ] Test edge cases
- [ ] Run `npx tsc` to validate types

## Phase 6: Integration & Polish

### Navigation

- [ ] Update `__root.tsx` navLinks with new routes (Payments, Dashboard)
- [ ] Remove old placeholder routes (page1, page2)
- [ ] Update home page to show app introduction

### Error Handling

- [ ] Add error boundaries
- [ ] Add loading states for async operations
- [ ] Add user-friendly error messages
- [ ] Handle network errors gracefully

### Final Testing

- [ ] Run full test suite: `npm test`
- [ ] Validate TypeScript: `npx tsc`
- [ ] Test all user flows end-to-end
- [ ] Test with various data scenarios

### Documentation

- [ ] Update README with app description and usage
- [ ] Document API service layer
- [ ] Add comments for complex logic

## Notes

- Each task should be completed and validated before moving to the next
- Run tests after implementing each feature
- Run `npx tsc` and `npm run lint` to catch type errors early
- Use DaisyUI components for consistent styling
- Follow existing code style (Prettier config)
