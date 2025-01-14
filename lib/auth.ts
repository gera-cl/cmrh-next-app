import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

import { createUser, getUserByEmail } from "@/lib/db/queries/users.queries";

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
            provider_account_id: account.providerAccountId,
          });
        }
        if (user.length > 0) {
          account.userId = user[0].id.toString();
          account.providerAccountId = user[0].provider_account_id;

          return true;
        }
      }

      return false;
    },
    async jwt({ token, account }) {
      if (account) {
        token.userId = account.userId;
        token.sub = account.providerAccountId;
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
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function getSession(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig);
}
