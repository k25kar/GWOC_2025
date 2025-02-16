// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      isAdmin: boolean;
      phone?: string;
      address?: string;
      pincode?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id: string;
    isAdmin: boolean;
    phone?: string;
    address?: string;
    pincode?: string;
  }
}
