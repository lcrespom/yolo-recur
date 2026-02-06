---
name: validate
description: Run the full validation pipeline — TypeScript type-check, ESLint, Prettier check, and test suite
disable-model-invocation: true
allowed-tools: Bash(npx tsc:*), Bash(npm run lint), Bash(npm run format:check), Bash(npm test), Bash(npm run build:*)
---

# Full Validation Pipeline

Run all validation checks in sequence and report results. Fix any issues found.

## Pipeline Steps

Run these in order (each depends on the previous passing or at least being assessed):

### 1. TypeScript Type Check
```bash
npx tsc -b
```
- Must produce zero errors
- Reports file, line, and error message for each issue

### 2. ESLint
```bash
npm run lint
```
- Must produce zero errors and zero warnings
- Check for unused variables, missing deps in hooks, etc.

### 3. Prettier Format Check
```bash
npm run format:check
```
- Must pass — all files formatted correctly
- If files are unformatted, run `npm run format` to fix them, then re-check

### 4. Test Suite
```bash
npm test
```
- All tests must pass
- Report any failures with test name and error

### 5. Build (optional, final check)
```bash
npm run build
```
- Ensures production build succeeds
- Catches any issues not caught by the above steps

## Reporting

After running all steps, provide a summary:

```
Validation Results:
  TypeScript:  PASS / FAIL (N errors)
  ESLint:      PASS / FAIL (N errors, N warnings)
  Prettier:    PASS / FAIL (N files unformatted)
  Tests:       PASS / FAIL (N passed, N failed)
  Build:       PASS / FAIL
```

## Error Fixing

If any step fails:
1. Read the failing files
2. Fix the issues
3. Re-run the failing step to confirm the fix
4. Continue with the remaining steps
5. After all fixes, re-run the full pipeline once more to confirm everything passes
