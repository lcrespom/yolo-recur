I want to create a recurring payments tracking app.

Create a multi-step plan to implement the application and keep track of it in file
[plan.md](plan.md), using a list of tasks marked using the markdown [ ] / [x] notation.

Then, follow the plan one step at a time, stopping at each step so I can validate if it's
working and also review the code, potentially requesting some refactoring. Details about
the application follow:

This is an application that keeps track of recurring payments. For each payment, I want to
track:

- Name: the payment name, e.g. "Electricity"
- Location: where this payment applies, useful for people with multiple households.
- Company: Company name
- Website: Company website
- Phone: Company phone
- Periodicity: monthly, yearly, or every x months. Stored as a number, where 1 is monthly,
  12 is yearly, etc.
- Payment Month: which month does the payment start its periodicity.
- Payment Day: which day of the month does the payment take place.
- Cost: cost per payment, a money amount. This applies to fixed payments. For variable
  payments, an approximate amount can be used for informational purpose, but the
  application should track each payment independently, so it can accumulate each payment
  and calculate monthly and yearly budgets.
- Bank: Bank name where the payment is processed.

The system should automatically add payments as the payment dates take place. The provided
cost will be added, and users will be able to modify its value in the payment detail page,
for the case of variable payments.

Using the current project technical stack, you should add the following pages:

- A page where a table of all recurring payments are displayed. When the user clicks on a
  row, it should navigate to the payment details page.
- A payment details editor. This is used both for creating new payment entries and for
  viewing and updating existing payments. In this page, the history of previous payments
  should be tracked, with date and paid ammount. The page should provide buttons to create
  or update the payment entry, to delete the entry (with a confirmation step) and to
  return to the table (with a warning popup in case there are unsaved changes).
- A dashboard for tracking past total expenses, grouped by different criteria such as
  location.

The backend, for now, is mocked using json-server. You should create one or more service
modules to interface with the backend offering a neutral functional API, so they can later
be replaced with a more realistic implementation such as Supabase or Postgres.

For each functionality, tests should be created and run for validation. Also, run
`npx tsc` to validate that there are no TypeScript errors.
