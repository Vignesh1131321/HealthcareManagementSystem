


import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await connect();
        let username = profile.name;

        // Check if the username already exists in the database
        let existingUser = await User.findOne({ username });
        let counter = 1;

        // If the username exists, append a number to make it unique
        while (existingUser) {
          username = `${profile.name} ${counter}`;
          existingUser = await User.findOne({ username });
          counter++;
        }

        // Check if the email exists in the database
        const existingEmailUser = await User.findOne({ email: profile.email });
        if (!existingEmailUser) {
          // Create a new user if it doesn't exist
          const hashedPassword = await bcrypt.hash(profile.sub, 10); // Use Google ID as password
          const newUser = new User({
            email: profile.email,
            username: username,
            password: hashedPassword, // Store a hashed password even though it's not used
          });
          await newUser.save();
        }

        // Return the user object in the correct shape expected by NextAuth
        return {
          id: profile.sub, // Add the _id here
          username: username,
          email: profile.email,
          image: profile.picture,
        };
     
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error("No user found with the email.");
        }

        const isPasswordValid = await bcrypt.compare(credentials!.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Incorrect password.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user = {
          _id: (user as any)._id.toString(),
          email: user.email,
          username: user.username,
          image: user.image,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url.startsWith("/")) {
        return baseUrl;
      }
      return url;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
