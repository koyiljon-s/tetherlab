import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STABLECOINS = [
  "USDT",
  "USDC",
  "DAI",
  "BUSD",
  "TUSD",
  "USDP",
  "GUSD",
  "FRAX",
  "LUSD",
  "PYUSD",
];

async function fetchSpotPrice(coin: string) {
  const res = await fetch(
    `https://api.coinbase.com/v2/prices/${coin}-USD/spot`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return { coin, price: parseFloat(data.data.amount) };
}

export async function GET() {
  const spots = await Promise.all(STABLECOINS.map(fetchSpotPrice));

  return NextResponse.json({
    spots: spots.filter(Boolean),
  });
}
