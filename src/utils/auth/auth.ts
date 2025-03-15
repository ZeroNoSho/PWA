import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username or Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.username },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        const data = {
          id: user.iduser,
          email: user.email,
          username: user.username,
          role: user.role,
          isDelet: user.isDelet,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        return data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ? user.email : "";
        token.username = user.name ? user.name : "";
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.username) {
        session.user.username = token.username;
      }

      const expiresIn = 60 * 60 * 24;
      const AccessToken = jwt.sign(
        { id: token.id, email: token.email, username: token.username },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          algorithm: "HS256",
          expiresIn,
        }
      );

      session.AccessToken = AccessToken;
      session.user.expires = new Date(
        token.exp ? token.exp : 0 * 1000
      ).toISOString();

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
};
