import { Coinbase } from "@coinbase/coinbase-sdk";

new Coinbase({
  apiKeyName: process.env.CDP_API_KEY_ID!,
  privateKey: process.env.CDP_API_KEY_SECRET!.replace(/\\n/g, "\n"),
});

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return Response.json({ error: "address is required" }, { status: 400 });
    }

    const resp = await Coinbase.apiClients.externalAddress!.requestExternalFaucetFunds(
      Coinbase.networks.BaseSepolia,
      address,
      "usdc",
    );

    const tx = resp.data;

    return Response.json({
      transactionHash: tx.transaction_hash,
      network: "Base Sepolia",
    });
  } catch (error) {
    console.error("Faucet error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}
