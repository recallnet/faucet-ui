"use server";

import { z } from "zod";

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
  prevState: RequestTokensState,
  formData: FormData,
): Promise<RequestTokensState> {
  const parsedData = requestTokensSchema.safeParse({
    address: formData.get("address"),
  });
  if (!parsedData.success) {
    return { error: parsedData.error.message };
  }

  const url = process.env.REGISTRAR_URL;
  if (!url) {
    return { error: "Registrar URL is not configured." };
  }
  const explorerTxnUrl = process.env.EXPLORER_TXN_URL;
  if (!explorerTxnUrl) {
    return { error: "Explorer URL is not configured." };
  }

  try {
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
      return { result };
    } else if (resp.status === 400) {
      return { error: "Bad request." };
    } else if (resp.status === 429) {
      return {
        error: "You already received faucet tokens recently. Try again later.",
      };
    } else if (resp.status === 503) {
      return { error: "The faucet is empty. Try again later." };
    } else {
      return { error: "Unknown error." };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : JSON.stringify(e) };
  }
}
