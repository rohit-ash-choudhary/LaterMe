# How to Create GitHub Issue for Email SMTP Problem

## Option 1: Using PowerShell Script (Recommended)

1. **Get a GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name like "LaterMe Issue Creator"
   - Select scope: `repo` (full control of private repositories)
   - Click "Generate token"
   - Copy the token

2. **Run the script:**
   ```powershell
   $env:GITHUB_TOKEN="your_token_here"
   .\create-github-issue.ps1
   ```

3. **The script will:**
   - Create the issue automatically
   - Show you the issue number
   - You can then use `Fixes #<number>` in future commits

## Option 2: Manual Creation

1. Go to: https://github.com/rohit-ash-choudhary/LaterMe/issues/new

2. **Title:**
   ```
   Email OTP Sending Failure - SMTP Connection Timeout
   ```

3. **Body:** (Copy from `ISSUES.md` file, Issue #1 section)

4. **Labels:** Add these labels:
   - `backend`
   - `email`
   - `smtp`
   - `production-issue`
   - `bug`
   - `high-priority`

5. Click "Submit new issue"

## Option 3: Using GitHub CLI (if installed)

```bash
gh issue create \
  --title "Email OTP Sending Failure - SMTP Connection Timeout" \
  --body-file ISSUES.md \
  --label "backend,email,smtp,production-issue,bug,high-priority"
```

## After Creating the Issue

Once you have the issue number (e.g., #1), you can reference it in commits:

```bash
git commit -m "fix: Improve email error handling - Fixes #1"
```

This will automatically link the commit to the issue and close it when merged.
