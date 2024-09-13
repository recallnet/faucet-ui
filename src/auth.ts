import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Postmark from "next-auth/providers/postmark";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub, Postmark({ from: process.env.POSTMARK_FROM })],
});
