// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    _id: string;
    isAdmin: boolean;
  }
}
