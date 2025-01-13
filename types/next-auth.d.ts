import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string | undefined;
      providerAccountId: string | undefined;
    }
  }

  interface Account {
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string | undefined;
  }
}