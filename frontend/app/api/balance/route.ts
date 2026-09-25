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

    const resp = await Coinbase.apiClients.externalAddress!.listExternalAddressBalances(
      Coinbase.networks.BaseSepolia,
      address,
    );

    const balances = resp.data.data.map((b) => ({
      asset: b.asset.asset_id,
      amount: b.asset.decimals
        ? (Number(b.amount) / Math.pow(10, b.asset.decimals)).toString()
        : b.amount,
    }));

    return Response.json({ balances });
  } catch (error) {
    console.error("Balance error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}
