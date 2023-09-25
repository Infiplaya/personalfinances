import type { DefaultSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '../../db/index';
import { PlanetScaleAdapter } from './planetscale-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      currentProfile: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  adapter: PlanetScaleAdapter(db),
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          currentProfile: u.currentProfile,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, credentials.email),
        });

        if (
          !user ||
          !(await compare(credentials.password, user.password as string))
        ) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          currentProfile: user.currentProfile,
          randomKey: 'xdddddddd',
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
};
