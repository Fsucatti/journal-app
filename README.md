# Journal App

A private journal with Markdown entries, tags, search and export.

**Live site:** <https://journal-app-francisco-sucatti.vercel.app>

**Built with:** Next.js, NextAuth, Prisma and MongoDB.

## How to use it

1. Create an account.
2. Write an entry in Markdown and add tags.
3. Find entries with search or by tag, and export them whenever you like.

## Run it locally

You need Node 22, because `next build` can fail on Node 26. You also need a MongoDB database running as a replica set, such as a free Atlas cluster.

1. Create a `.env` file:

   ```bash
   DATABASE_URL="mongodb+srv://USER:PASSWORD@HOST/journal"
   NEXTAUTH_SECRET="a long random value"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. Install dependencies, set up the database and start the app:

   ```bash
   npm install
   npx prisma db push
   npm run dev
   ```

3. Open <http://localhost:3000> and create an account.
