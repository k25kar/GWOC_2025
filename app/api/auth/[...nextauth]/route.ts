// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";
import Partner from "@/src/models/Partner"; // <-- Import Partner Schema
import type { User as NextAuthUserType } from "next-auth";

// Define our custom user type that matches our augmentation
interface NextAuthUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  isAdmin: boolean;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user !== "string") {
        const customUser = user as NextAuthUser;
        if (customUser._id) token._id = customUser._id;
        if (customUser.isAdmin) token.isAdmin = customUser.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        // Adding an extra field to differentiate login type.
        loginType: { label: "LoginType", type: "text" },
      },
      async authorize(credentials, req) {
        console.log("Received credentials:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          throw new Error("Email and Password are required.");
        }

        await db.connect();

        // Check if this is a Service Provider login attempt.
        if (credentials?.loginType === "sp") {
          // Look for a partner by email.
          const partner = await Partner.findOne({ email: credentials.email });
          console.log("Found partner:", partner);

          if (partner) {
            // Ensure the partner's status is approved.
            if (partner.status !== "approved") {
              console.error("Partner application not approved yet");
              throw new Error("Application not approved yet");
            }
            // Validate password.
            if (bcrypt.compareSync(credentials.password, partner.password)) {
              console.log("Authentication successful for partner:", partner.email);
              const authUser: NextAuthUser = {
                _id: partner._id.toString(),
                name: partner.name,
                email: partner.email,
                image: "f",
                isAdmin: false, // Service Providers may not be admins.
              };
              return authUser as unknown as NextAuthUserType;
            } else {
              console.error("Invalid email or password for partner");
              throw new Error("Invalid email or password");
            }
          } else {
            console.error("Service provider not found");
            throw new Error("Service provider not found");
          }
        } else {
          // Normal user login logic.
          const user = await User.findOne({ email: credentials.email });
          console.log("Found user:", user);
          if (user && bcrypt.compareSync(credentials.password, user.password)) {
            console.log("Authentication successful for user:", user.email);
            const authUser: NextAuthUser = {
              _id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: "f",
              isAdmin: user.isAdmin,
            };
            return authUser as unknown as NextAuthUserType;
          }
          console.error("Invalid email or password for user");
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
