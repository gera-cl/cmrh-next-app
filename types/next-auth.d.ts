declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      providerAccountId: string | undefined;
      id: string | undefined;
    };
    expires: string;
  }

  interface Account {}
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string | undefined;
  }
}
