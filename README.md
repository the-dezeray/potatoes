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

## GitHub Leaderboard

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
