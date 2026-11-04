# Journal App

A private journal with Markdown entries, tags, search, and export. Built with Next.js, NextAuth, Prisma, and MongoDB, and hosted on Vercel and MongoDB Atlas free plans.

Live site: https://journal-app-francisco-sucatti.vercel.app

## Run it locally

You need Node 22, because `next build` can fail on Node 26 with a webpack hashing error. You also need a MongoDB database running as a replica set, such as a free Atlas cluster, because Prisma requires one.

1. Create a `.env` file:

   ```bash
   DATABASE_URL="mongodb+srv://USER:PASSWORD@HOST/journal"
   NEXTAUTH_SECRET="a long random value"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. Install dependencies, create the database indexes, and start the app:

   ```bash
   npm install
   npx prisma db push
   npm run dev
   ```

3. Open http://localhost:3000 and create an account.

## How it's protected

- Every entry belongs to its author. API routes and the edit page check that on the server.
- Accounts need a password of 8 to 72 characters.
- Sign-in is blocked for 15 minutes after 10 failures for one email or 30 from one IP address. Registration allows 10 attempts per IP address per hour. Attempts are stored in the `AuthAttempt` collection.

## Deploy

Pushing to `main` deploys to Vercel. Set the same three variables there, with `NEXTAUTH_URL` as the production address.

If you change a unique field or index in `prisma/schema.prisma`, run `npx prisma db push` against the production database.

**Atlas:** a free cluster can pause when it isn't used. While it's paused, the app can't read or save anything until you resume it in the Atlas dashboard.

## Change things

| To change | Edit |
|---|---|
| Sign-in rules and limits | `src/lib/auth.ts`, `src/app/api/register/route.ts` |
| Colors | `src/app/globals.css` |
| Header and footer | `src/components/Layout.tsx`, `src/components/ProjectFooter.tsx` |
| Entry form and list | `src/components/EntryForm.tsx`, `src/components/EntryList.tsx` |
