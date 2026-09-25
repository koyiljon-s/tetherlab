import { createPublicClient, http, formatUnits } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http("https://ethereum-rpc.publicnode.com"),
});

const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const;

const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

export async function GET() {
  try {
    const [name, symbol, totalSupply] = await Promise.all([
      client.readContract({ address: USDT_ADDRESS, abi: erc20Abi, functionName: "name" }),
      client.readContract({ address: USDT_ADDRESS, abi: erc20Abi, functionName: "symbol" }),
      client.readContract({ address: USDT_ADDRESS, abi: erc20Abi, functionName: "totalSupply" }),
    ]);

    return Response.json({
      name,
      symbol,
      contract: USDT_ADDRESS,
      network: "Ethereum Mainnet",
      decimals: 6,
      totalSupply: formatUnits(totalSupply, 6),
    });
  } catch (error) {
    console.error("Contract info error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, address, txHash } = await request.json();

    if (action === "balance") {
      if (!address) {
        return Response.json({ error: "address is required" }, { status: 400 });
      }

      const balance = await client.readContract({
        address: USDT_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });

      return Response.json({
        address,
        balance: formatUnits(balance, 6),
        symbol: "USDT",
      });
    }

    if (action === "recent") {
      const latestBlock = await client.getBlockNumber();

      const logs = await client.getLogs({
        address: USDT_ADDRESS,
        event: {
          type: "event",
          name: "Transfer",
          inputs: [
            { name: "from", type: "address", indexed: true },
            { name: "to", type: "address", indexed: true },
            { name: "value", type: "uint256", indexed: false },
          ],
        },
        fromBlock: latestBlock - 50n,
        toBlock: latestBlock,
      });

      const transfers = logs.slice(-10).reverse().map((log) => ({
        from: log.args.from,
        to: log.args.to,
        amount: formatUnits(log.args.value ?? 0n, 6),
        blockNumber: Number(log.blockNumber),
        txHash: log.transactionHash,
      }));

      return Response.json({ transfers });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Sandbox error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}
