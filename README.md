This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Notice Board Beta Invitation Emails

Sends personalized login-invitation emails to beta testers of the BIUST Notice Board.

### What it does

Each recipient gets a custom-styled HTML email (matching the club's card design): their name
in the greeting, their email shown as the **username**, and a shared password. The sign-in
button links to the deployed board at `https://biust-notice-board.vercel.app`.

### Files

| File | Purpose |
| --- | --- |
| `emails/recipients.js` | **Git-ignored.** The real recipient list (`email`, `name`) — keep local |
| `emails/recipients.example.js` | Committed template — copy to `recipients.js` to set up |
| `emails/inviteTemplate.js` | Builds the HTML email from a recipient + password |
| `scripts/sendInvites.mjs` | Sends the emails via Gmail SMTP (nodemailer) |

`emails/recipients.js` is ignored because it contains real student email addresses. The shared
password lives in `.env` as `INVITE_PASSWORD`, never in the repo.

### Requirements

- Node.js
- `.env` with Gmail credentials and the shared invite password:

  ```env
  GMAIL_USER=...
  GMAIL_APP_PASSWORD=...
  INVITE_PASSWORD=...
  ```

  Use a [Google App Password](https://support.google.com/accounts/answer/185833) — not your
  normal Gmail password. `GMAIL_APP_PASSWORD` and `INVITE_PASSWORD` are secrets; never commit
  the `.env` file.

### Usage

From the repo root, always load `.env` with `--env-file`:

```bash
# Preview a single test email (chinwaru's matches) without sending anything
node --env-file=.env scripts/sendInvites.mjs --test --dry

# Send a real test email to Desiree Chingwaru only
node --env-file=.env scripts/sendInvites.mjs --test

# Send to ALL recipients listed in emails/recipients.js
node --env-file=.env scripts/sendInvites.mjs

# Render emails to HTML files (emails/out/) — open in browser, copy & paste into Outlook
node --env-file=.env scripts/sendInvites.mjs --save
```

Flags:

- `--test` — only the recipient whose email starts with `CD23018473` (Desiree Chingwaru).
- `--dry`  — print the generated HTML instead of sending (combine with `--test` to preview).
- `--save` — write each rendered email to `emails/out/<EMAIL>.html` (nothing is sent). Open
  the file in a browser, `Ctrl+A` + `Ctrl+C`, then paste into an Outlook message composed
  from your school account — a manual workaround for the BIUST deliverability issue below.

The `--test` filter lives in `scripts/sendInvites.mjs` (`.startsWith("cd23018473")`). Update
it if you want to test with a different address.

### Changing recipients

Edit `emails/recipients.js` (create it from `emails/recipients.example.js` if missing). Keep
entries as `{ email, name }`. The shared password is read from the `INVITE_PASSWORD` env var.

### Editing the email design

Edit `emails/inviteTemplate.js`. It returns an HTML string with `${name}`, `${email}` and
`${password}` interpolated. HTML is inline-styled for email client compatibility
(table-based layout, no external CSS). To change the sign-in link, update the `href` on the
call-to-action button.

### Known issue — BIUST / Outlook deliverability

`smtp.gmail.com` successfully sends to Gmail recipients. However, test emails to
`@biust.ac.bw` addresses (hosted on **Microsoft 365 / Exchange Online**, MX =
`biust-ac-bw.mail.protection.outlook.com`) are accepted by the mail server but do **not**
appear in the recipient's inbox, junk, or archive. This is almost certainly:

- **Exchange Online Protection (EOP)** silently quarantining the message (quarantine is only
  visible to the domain admin, not the user), and/or
- Bulk-mail / content filtering on the free Gmail sender account.

**Action needed outside this repo:** have the BIUST Microsoft 365 admin check the EOP
**Quarantine** (Exchange admin center → Quarantine / Defender portal) for messages sent from
`GMAIL_USER`, and release/allowlist them. Consider a transactional ESP (Resend, SendGrid,
Postmark) or sending from a university-trusted address for better deliverability to M365.

---

The club features a public GitHub contributions leaderboard at `/leaderboard` that ranks members by commits, pull requests, and issues opened during the current calendar month.

### Setup

1. **Add a GitHub Personal Access Token** to your environment:

   ```env
   # .env.local (never commit this file)
   GITHUB_TOKEN=ghp_your_token_here
   ```

      For private contribution opt-in via GitHub OAuth, add:

      ```env
      GITHUB_OAUTH_CLIENT_ID=your_client_id
      GITHUB_OAUTH_CLIENT_SECRET=your_client_secret
      GITHUB_OAUTH_REDIRECT_URI=http://localhost:3000/api/github/oauth/callback

      # 32 bytes, base64-encoded. Example generation:
      # openssl rand -base64 32
      LEADERBOARD_TOKEN_SECRET=base64_secret_here

      # Firebase Admin SDK credentials
     FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
      FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
      ```

   The token only needs **no extra scopes** (public data is accessible with a standard token). Generate one at [github.com/settings/tokens](https://github.com/settings/tokens).

2. **Add club members** to [`lib/leaderboard-users.ts`](lib/leaderboard-users.ts):

   ```ts
   export const LEADERBOARD_USERS: LeaderboardUser[] = [
     { username: "octocat",  name: "The Octocat"   },
     { username: "torvalds", name: "Linus Torvalds" },
   ]
   ```

### Architecture

```
GitHub GraphQL API
      ↓
/api/leaderboard  (Next.js Route Handler — cached 1 week)
      ↓
/leaderboard      (public page — reads cached JSON)
```

The server fetches GitHub once per week regardless of visitor count, so rate limits are never an issue (5 000 req/hr; you use one per member per week).

### Changing the cache duration

Edit the `revalidate` constant in [`app/api/leaderboard/route.ts`](app/api/leaderboard/route.ts):

```ts
export const revalidate = 604800 // seconds — currently 7 days
```

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Remember to add `GITHUB_TOKEN` as an environment variable in your Vercel project settings.
