# Recurring Payments Tracking App - Implementation Plan

## Phase 1: Foundation & Setup

### Backend Setup
- [ ] Create `db.json` file for json-server with initial schema (recurring_payments, payment_history)
- [ ] Create npm script to run json-server concurrently with dev server
- [ ] Test json-server endpoints

### Type Definitions
- [ ] Create `src/types/payment.ts` with TypeScript interfaces for:
  - RecurringPayment (id, name, location, company, website, phone, periodicity, paymentMonth, paymentDay, cost, bank)
  - PaymentHistoryEntry (id, recurringPaymentId, date, amount, isPaid)
  - API response types

### Service Layer
- [ ] Create `src/services/paymentService.ts` with functions:
  - `getRecurringPayments()` - fetch all recurring payments
  - `getRecurringPayment(id)` - fetch single payment
  - `createRecurringPayment(data)` - create new payment
  - `updateRecurringPayment(id, data)` - update payment
  - `deleteRecurringPayment(id)` - delete payment
- [ ] Create `src/services/paymentHistoryService.ts` with functions:
  - `getPaymentHistory(recurringPaymentId)` - fetch history for a payment
  - `createPaymentHistoryEntry(data)` - add payment history
  - `updatePaymentHistoryEntry(id, data)` - update history entry
- [ ] Create `src/services/paymentGenerator.ts` with:
  - `generateDuePayments()` - auto-generate payment history entries based on due dates
  - Helper functions for date calculations

## Phase 2: Payments List Page

### Route & Component
- [ ] Create `src/routes/payments/index.tsx` - payments list route
- [ ] Create `src/components/PaymentsTable.tsx` - table component displaying all recurring payments
- [ ] Add click handler to navigate to detail page
- [ ] Add "New Payment" button
- [ ] Update navigation links in `__root.tsx`

### Styling & Features
- [ ] Style table with DaisyUI table classes
- [ ] Add sorting capabilities (by name, cost, next due date)
- [ ] Add search/filter functionality
- [ ] Show next payment due date for each recurring payment

### Testing
- [ ] Create `src/components/PaymentsTable.test.tsx`
- [ ] Test table rendering with mock data
- [ ] Test navigation on row click
- [ ] Run `npx tsc` to validate types

## Phase 3: Payment Detail/Editor Page

### Route & Component
- [ ] Create `src/routes/payments/$paymentId.tsx` - detail/edit route
- [ ] Create `src/components/PaymentForm.tsx` - form component
- [ ] Implement form validation
- [ ] Add unsaved changes detection

### Features
- [ ] Load existing payment data or initialize for new payment
- [ ] Display/edit all payment fields (name, location, company, website, phone, periodicity, etc.)
- [ ] Show payment history section with date and amount
- [ ] Add "Save" button (create or update)
- [ ] Add "Delete" button with confirmation modal
- [ ] Add "Cancel/Back" button with unsaved changes warning
- [ ] Allow editing individual payment history entries

### Styling
- [ ] Use DaisyUI form components (input, select, textarea)
- [ ] Create card layout for payment history
- [ ] Implement confirmation modal with DaisyUI

### Testing
- [ ] Create `src/components/PaymentForm.test.tsx`
- [ ] Test form validation
- [ ] Test save/update functionality
- [ ] Test delete with confirmation
- [ ] Test unsaved changes warning
- [ ] Run `npx tsc` to validate types

## Phase 4: Dashboard Page

### Route & Component
- [ ] Create `src/routes/dashboard/index.tsx` - dashboard route
- [ ] Create `src/components/ExpensesSummary.tsx` - summary cards component
- [ ] Create `src/components/ExpensesByLocation.tsx` - location breakdown
- [ ] Create `src/components/ExpensesChart.tsx` (optional) - visual representation

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
- [ ] Create `src/services/paymentGenerator.test.ts`
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
- Run `npx tsc` to catch type errors early
- Use DaisyUI components for consistent styling
- Follow existing code style (Prettier config)
