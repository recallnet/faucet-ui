import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  cookies: {
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
});
