import { NextResponse } from "next/server";

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
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return { coin, price: parseFloat(data.data.amount) };
}

async function fetchCandles(productId: string, days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const res = await fetch(
    `https://api.exchange.coinbase.com/products/${productId}/candles?` +
      new URLSearchParams({
        granularity: "86400",
        start: start.toISOString(),
        end: end.toISOString(),
      }),
    {
      next: { revalidate: 300 },
      headers: { "User-Agent": "TetherLab/1.0" },
    }
  );
  if (!res.ok) return [];
  const candles: [number, number, number, number, number, number][] =
    await res.json();

  return candles
    .map(([time, low, high, open, close]) => ({
      date: new Date(time * 1000).toISOString().split("T")[0],
      open,
      high,
      low,
      close,
    }))
    .reverse();
}

export async function GET() {
  const [spots, usdtHistory] = await Promise.all([
    Promise.all(STABLECOINS.map(fetchSpotPrice)),
    fetchCandles("USDT-USD", 14),
  ]);

  return NextResponse.json({
    spots: spots.filter(Boolean),
    history: usdtHistory,
  });
}
