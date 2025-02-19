import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";
import Partner from "@/src/models/Partner"; // <-- Import Partner Schema
// import type { AuthOptions, User as NextAuthUserType } from "next-auth";

// Define our custom user type that matches our augmentation
interface NextAuthUser {
    _id: string;
    name: string;
    email: string;
    image: string;
    isAdmin: boolean;
    phone?: string; // Added phone field
  }

export const authOptions: any = {
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }:any) {
        // If a user object is available (on login) add custom properties to the token.
        if (user && typeof user !== "string") {
          const customUser = user;
          if (customUser._id) token._id = customUser._id;
          if (customUser.isAdmin) token.isAdmin = customUser.isAdmin;
          if (customUser.phone) token.phone = customUser.phone;
        }
        return token;
      },
      async session({ session, token }:any) {
        if (session.user) {
          session.user._id = token._id as string;
          session.user.isAdmin = token.isAdmin as boolean;
          session.user.phone = token.phone as string;
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
          // Extra field to differentiate login type.
          loginType: { label: "LoginType", type: "text" },
        },
        async authorize(credentials, req) {
          console.log("Received credentials:", credentials);
  
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing email or password");
            throw new Error("Email and Password are required.");
          }
  
          await db.connect();
  
          // If this is a service provider login attempt.
          if (credentials?.loginType === "sp") {
            // Find a partner by email.
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
                const authUser: any = {
                  _id: partner._id.toString(),
                  name: partner.name,
                  email: partner.email,
                  image: "f", // Replace with actual image if available.
                  isAdmin: false, // Service providers are not admins.
                  phone: partner.phone, // Include partner's phone number.
                };
                return authUser;
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
              const authUser: any = {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                image: "f",
                isAdmin: user.isAdmin,
              };
              return authUser;
            }
            console.error("Invalid email or password for user");
            throw new Error("Invalid email or password");
          }
        },
      }),
    ],
    secret: "Apple"
  };

  