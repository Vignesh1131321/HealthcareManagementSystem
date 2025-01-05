// types/next-auth.d.ts
import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    username: string;
    image?: string;
  }

  interface Session {
    user: {
      _id: string;
      username: string;
      email: string;
      image?: string;
    } & DefaultSession["user"];
  }
}
