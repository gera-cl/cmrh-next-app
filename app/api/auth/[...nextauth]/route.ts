import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createUser, getUserByEmail } from '@/db/queries/users.queries';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        console.log('account', account);
        console.log('profile', profile);
        const email = profile?.email;
        const user = await getUserByEmail(email!);

        // If user isn't created, create user
        if (user.length === 0) {
          const createdUser = await createUser({
            name: profile?.name!,
            email: profile?.email!,
          })
          return createdUser ? true : false;
        }
        return true;
      }
      return false;
    },
  }
});

export { handler as GET, handler as POST };
