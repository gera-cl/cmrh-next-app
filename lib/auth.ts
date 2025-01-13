import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import GoogleProvider from "next-auth/providers/google";
import { createUser, getUserByEmail } from '@/lib/db/queries/users.queries';
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        let user = await getUserByEmail(email!);
        // If user isn't created, create user
        if (user.length === 0) {
          user = await createUser({
            name: profile?.name!,
            email: profile?.email!,
          })
        }
        if (user.length > 0) {
          account.userId = user[0].id.toString();
          return true;
        }
      }
      return false;
    },
    async jwt({ token, account }) {
      if (account) {
        token.userId = account.userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.providerAccountId = token.sub;
        session.user.id = token.userId;
      }
      return session;
    },
  }
} satisfies NextAuthOptions;

// Use it in server contexts
export function getSession(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig)
}