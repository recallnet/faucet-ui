"use server";

import { auth, signIn as authSignIn, signOut as authSignOut } from "@/auth";
import { z } from "zod";
import { track } from "@vercel/analytics/server";
import { Session } from "next-auth";

export async function signIn() {
  await authSignIn("github");
  await track("sign-in", { provider: "github" });
}

export async function signInEmail(formData: FormData) {
  await authSignIn("postmark", formData);
  await track("sign-in", { provider: "email" });
}

export async function signOut() {
  await authSignOut();
  await track("sign-out");
}

export interface RequestTokensResult {
  txHash: string;
  txUrl: string;
}

export interface RequestTokensState {
  result?: RequestTokensResult;
  error?: string;
}

const requestTokensSchema = z.object({
  address: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, "Must be a valid EVM address"),
});

export async function requestTokens(
  _: RequestTokensState,
  formData: FormData,
): Promise<RequestTokensState> {
  let session: Session | null = null;
  try {
    session = await auth();
    if (!session?.user) {
      throw new Error("You must be signed in to request tokens.");
    }

    const parsedData = requestTokensSchema.safeParse({
      address: formData.get("address"),
    });
    if (!parsedData.success) {
      throw new Error(parsedData.error.message);
    }

    const url = process.env.REGISTRAR_URL;
    if (!url) {
      throw new Error("Registrar URL is not configured.");
    }
    const explorerTxnUrl = process.env.EXPLORER_TXN_URL;
    if (!explorerTxnUrl) {
      throw new Error("Explorer URL is not configured.");
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify(parsedData.data);

    const resp = await fetch(url, { method: "POST", headers, body });
    if (resp.ok) {
      const json = (await resp.json()) as { tx_hash: string };
      const result = {
        txHash: json.tx_hash,
        txUrl: `${explorerTxnUrl}/${json.tx_hash}`,
      };
      await track("faucet-sent", { userId: session.user.id ?? null });
      return { result };
    } else {
      await track("faucet-error", {
        status: resp.status,
        userId: session.user.id ?? null,
      });
      if (resp.status === 400) {
        return { error: "Bad request." };
      } else if (resp.status === 429) {
        return {
          error:
            "You already received faucet tokens recently. Try again later.",
        };
      } else if (resp.status === 503) {
        return { error: "The faucet is empty. Try again later." };
      } else {
        return { error: "Unknown error." };
      }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : JSON.stringify(e);
    track("internal-error", { message, userId: session?.user?.id ?? null });
    return { error: message };
  }
}
