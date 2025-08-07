# AI Agents SaaS

A full-stack platform to build, chat with, and monetize AI agents. Built with Next.js 14, Prisma (MySQL), NextAuth, Stripe, PayPal, and OpenAI.

## Tech
- Next.js 14 (App Router) + TailwindCSS
- Prisma ORM + MySQL (Plesk friendly)
- Auth.js (NextAuth) with Google + Credentials
- Stripe + PayPal billing
- OpenAI for chat + DALL·E

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Create a MySQL database and set `DATABASE_URL`.
3. Install deps and push schema:
   ```bash
   npm install
   npx prisma db push
   npm run db:seed
   npm run dev
   ```
4. Visit `http://localhost:3000`.

## Plesk Deployment (Ubuntu)
- Ensure Node.js extension is installed in Plesk and Node 18+ is available.
- Create a new Node.js app pointing to this project folder.
- Set `Application startup file` to `node_modules/next/dist/bin/next` and `Application parameters` to `start`.
- Set `Document Root` to `.next/standalone` if using standalone build, or just project root with reverse proxy.
- Environment Variables: Copy from `.env` to Plesk UI.
- Build:
  ```bash
  npm install --production
  npx prisma migrate deploy
  npm run build
  npm start
  ```
- Configure Stripe webhook to `https://yourdomain.com/api/billing/stripe/webhook`.

## Admin Access
- Set a user as admin via database:
  ```sql
  update User set role = 'ADMIN' where email = 'you@example.com';
  ```

## Embed
- Any agent is available at `/a/{slug}` and can be embedded in an `<iframe src="https://yourdomain.com/a/{slug}?embed=1" />`.

## Notes
- Credits: 1 credit per message for MVP. Adjust logic in `src/app/api/chat/route.ts`.
- For PayPal, set return/cancel URLs in the code to your domain.
