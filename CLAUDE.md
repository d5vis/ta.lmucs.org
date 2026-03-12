# LLMs

- All markdown files in `./ai/` should have a date prefix in format `YYYY-MM-DD-` (e.g., `2026-02-09-sheet-import-masaok.md`)
- After finishing a response, run `pnpm run ci` to verify the code is clean.

# Pushing

- DO NOT COMMIT unless told to do so.
- DO NOT PUSH unless told to do so.
- Always use `git add -A` to stage files and push to `main`.
- Always write a detailed multi-line commit message with dash bullet points.
- Show all commit and push hook output in the foreground.
- Always show what commit and push are doing in the foreground.
- Always show commit hash after commit and push
- Never use --no-verify

# Proxy (auth/routing)

- Next.js 16 renamed `middleware.ts` to `proxy.ts`. DO NOT create a `middleware.ts` file — use `src/proxy.ts` instead.
- The proxy file defaults to Node.js runtime. Do NOT set `export const runtime` in proxy — it will throw an error.
- Auth route protection and CSRF checks live in `src/proxy.ts`.

# Security

- Allow keys in the codebase. DO NOT move them to env vars.

# Building

- use pnpm instead of npm when possible
- do not verify build unless told to. use `pnpm ci` instead.

# Coding

- always use async/await
- Always use Luxon instead of JSDate if possible
- Always use Axios instead of fetch
- After each prompt execution, show the real time elapsed.

# Frontend

- Anything the user can click (button/link/etc.) should have an indicator when hovered
- Use Open Sans as default font everywhere.

# Tables

- Use `/responsive-table <file-or-route>` to add viewport-aware column auto-hiding and a user toggle dropdown to any table component.
- All table rows (main rows and sub-panel rows) must have hover highlighting: `hover:bg-accent/10 dark:hover:bg-accent/20`

# Google Sheets

- Use Google Sheets API (not Drive API) for reading sheets
- Service account: `src/keys/service_account/ai-paralegal-486507-f75dab00148f.json`
- Scope: `https://www.googleapis.com/auth/spreadsheets.readonly`
- Sheets must be shared with: `ai-paralegal-service-account@ai-paralegal-486507.iam.gserviceaccount.com`

# Debugging

- Store Playwright screenshots in `./screenshots/playwright/`

# Playwright Authentication

To access private routes (e.g. `/dashboard/masaok`) in Playwright, generate a session cookie and set it before navigating.

**Step 1 — Generate token** (run in Bash):

```bash
node -e "
const { encode } = require('next-auth/jwt');
(async () => {
  const token = await encode({
    token: { name: 'Masa Ok', email: 'masaok@gmail.com', picture: null, sub: 'masaok@gmail.com' },
    secret: '<use the secret from src/config/auth.config.ts>',
    salt: 'authjs.session-token',
  });
  console.log(token);
})();
"
```

**Step 2 — Set cookie via `browser_run_code`** (use the token from step 1):

```js
async page => {
  const context = page.context()
  await context.addCookies([
    {
      name: 'authjs.session-token',
      value: '<TOKEN>',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ])
  await page.goto('http://localhost:3000/dashboard/masaok')
}
```

The cookie persists for the entire Playwright session — only needs to be set once.

**If Playwright fails to launch Chrome** ("Opening in existing browser session"):

```bash
ps aux | grep "mcp-chrome" | grep -v grep   # find stale PID
kill <PID>
```
