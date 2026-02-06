---
name: fix-errors
description: Find and fix TypeScript, ESLint, and test errors across the project
disable-model-invocation: true
model: haiku
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(npx tsc:*), Bash(npm run lint), Bash(npm test), Bash(npx vitest:*), mcp__vscode__code_checker
---

# Find and Fix Errors

Systematically find and fix all errors in the project. Optionally target a specific area: `$ARGUMENTS` (e.g., `types`, `lint`, `tests`, or a file path).

## Error Discovery

Run these checks to identify all errors:

### 1. TypeScript Errors
```bash
npx tsc -b --noEmit 2>&1
```
Parse output for file paths, line numbers, and error codes.

### 2. ESLint Errors
```bash
npm run lint 2>&1
```
Parse output for lint violations.

### 3. VSCode Diagnostics
Use the `mcp__vscode__code_checker` tool to get IDE-level diagnostics.

### 4. Test Failures
```bash
npm test 2>&1
```
Parse output for failed test names and assertion errors.

## Fix Strategy

For each error found:

1. **Read the file** containing the error
2. **Understand the context** — read surrounding code and related files
3. **Apply the minimal fix** — don't refactor or improve unrelated code
4. **Verify the fix** — re-run the check that caught the error

### Common TypeScript Fixes

| Error | Fix |
|---|---|
| `TS2322: Type X is not assignable to Y` | Correct the type or add proper typing |
| `TS6133: X is declared but not used` | Remove unused variable/import |
| `TS2345: Argument not assignable` | Fix function argument types |
| `TS2339: Property does not exist` | Add to interface or use type assertion with justification |
| `TS18046: X is of type unknown` | Add type guard (`instanceof Error`) |

### Common ESLint Fixes

| Error | Fix |
|---|---|
| `react-hooks/exhaustive-deps` | Add missing deps to useEffect/useCallback |
| `@typescript-eslint/no-unused-vars` | Remove or prefix with `_` |
| `react-refresh/only-export-components` | Move component to its own file or add `/* eslint-disable */` with justification |

### Common Test Fixes

| Error | Fix |
|---|---|
| `Element not found` | Update selectors to match current DOM |
| `Mock not called` | Verify mock setup and async timing |
| `Snapshot mismatch` | Update snapshot if change is intentional |
| `Act warning` | Wrap state updates in `act()` or use `findBy*` |

## Iteration

After fixing all discovered errors:
1. Re-run the full check pipeline
2. If new errors appeared (e.g., fixing one revealed another), fix those too
3. Repeat until all checks pass clean
4. Report final summary of all fixes made
