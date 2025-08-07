import NextAuth, { type DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { z } from 'zod';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'USER' | 'ADMIN';
      credits: number;
    } & DefaultSession['user'];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parse = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (!parse.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parse.data.email } });
        if (!user) return null;
        const account = await prisma.account.findFirst({ where: { userId: user.id, provider: 'credentials' } });
        // We store hashed password in Account.access_token for credentials provider
        if (!account?.access_token) return null;
        const ok = await compare(parse.data.password, account.access_token);
        if (!ok) return null;
        return { id: user.id, email: user.email!, name: user.name, image: user.image, role: user.role, credits: user.credits } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: (user as any).id } });
        if (dbUser) {
          token.role = dbUser.role;
          token.credits = dbUser.credits;
        }
      } else if (token.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          token.role = dbUser.role;
          token.credits = dbUser.credits;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token as any).role || 'USER';
        session.user.credits = (token as any).credits || 0;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
});