import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      expires: string;
    } & DefaultSession["user"];

    AccessToken?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email: string;
    username: string;
    exp?: number;
  }
}
