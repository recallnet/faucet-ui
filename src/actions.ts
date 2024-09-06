"use server";

export interface RequestTokensResult {
  txHash: string;
  txUrl: string;
}

export interface RequestTokensState {
  result?: RequestTokensResult,
  error?: string
};

export async function requestTokens(prevState: RequestTokensState, formData: FormData): Promise<RequestTokensState> {
  const url = process.env.REGISTRAR_URL;
  if (!url) {
    return { error: "Registrar URL is not configured." }
  }
  const explorerTxnUrl = process.env.EXPLORER_TXN_URL;
  if (!explorerTxnUrl) {
    return { error: "Explorer URL is not configured." }
  }

  const rawData = {
    address: formData.get("address"),
  }

  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify(rawData);

    const resp = await fetch(url, { method: "POST", headers, body })
    if (!resp.ok) {
      return { error: "Failed to request tokens." }
    }
    const json = await resp.json() as { tx_hash: string };
    const result = {
      txHash: json.tx_hash,
      txUrl: `${explorerTxnUrl}/${json.tx_hash}`,
    };
    return { result };
  } catch (_) {
    return { error: "Failed to request tokens." }
  }
}