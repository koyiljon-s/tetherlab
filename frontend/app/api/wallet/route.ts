import { Coinbase, createSmartWallet } from "@coinbase/coinbase-sdk";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

new Coinbase({
  apiKeyName: process.env.CDP_API_KEY_ID!,
  privateKey: process.env.CDP_API_KEY_SECRET!.replace(/\\n/g, "\n"),
});

export async function POST() {
  try {
    const privateKey = generatePrivateKey();
    const owner = privateKeyToAccount(privateKey);

    const wallet = await createSmartWallet({ signer: owner });

    return Response.json({
      address: wallet.address,
      ownerAddress: owner.address,
      network: "Base Sepolia (Testnet)",
    });
  } catch (error) {
    console.error("Wallet creation error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}
