"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartColumnBig } from "lucide-react"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type SpotPrice = { coin: string; price: number };
type HistoryPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};
type PriceData = { spots: SpotPrice[]; history: HistoryPoint[] };

async function fetchCandlesClient(productId: string, days: number): Promise<HistoryPoint[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const params = new URLSearchParams({
    granularity: "86400",
    start: start.toISOString(),
    end: end.toISOString(),
  });
  const res = await fetch(
    `https://api.exchange.coinbase.com/products/${productId}/candles?${params}`
  );
  if (!res.ok) return [];
  const candles: [number, number, number, number, number, number][] = await res.json();
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

const chartConfig = {
  close: {
    label: "USDT Price",
    color: "#e650bb",
  },
} satisfies ChartConfig;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("kr-KR", { month: "short", day: "numeric" });
}

export default function StablecoinDashboard() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pricesRes, historyData] = await Promise.all([
          fetch("/api/prices").then((r) => r.json()),
          fetchCandlesClient("USDT-USD", 14),
        ]);
        setData({ spots: pricesRes.spots, history: historyData });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
        Loading stablecoin data...
      </div>
    );
  }

  if (!data || data.spots.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
        Unable to load price data.
      </div>
    );
  }

  const usdtSpot = data.spots.find((s) => s.coin === "USDT");
  const peg = 1.0;
  const delta = usdtSpot ? usdtSpot.price - peg : 0;
  const deltaSign = delta >= 0 ? "+" : "";

  return (
    <div className="flex h-full flex-col gap-6 p-4 pt-14 md:flex-row md:p-6 md:pt-6">
      {/* Left — Area Chart */}
      <div className="flex min-h-[300px] flex-col border border-zinc-200 bg-white p-4 md:w-[70%] md:p-5">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
            <ChartColumnBig className="h-5 w-5" />
            USDT Price — Last 14 Days
          </h3>
          <p className="text-sm text-zinc-500">
            Daily close price ·{" "}
            <span
              className={delta >= 0 ? "text-emerald-600" : "text-red-500"}
            >
              {deltaSign}
              {delta.toFixed(4)}
            </span>{" "}
            from $1 peg
          </p>
        </div>
        {data.history.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-0 flex-1 w-full">
            <BarChart
              accessibilityLayer
              data={data.history}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                color="#7825f5"
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["dataMin - 0.001", "dataMax + 0.001"]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v.toFixed(4)}`}
                tick={{ fontSize: 12 }}
                width={72}
                
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => formatDate(String(label))}
                    formatter={(value) => [
                      `$${Number(value).toFixed(4)}`,
                      "Close",
                    ]}
                  />
                }
              />
              <Bar
                dataKey="close"
                fill="var(--color-close)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="flex flex-1 items-center justify-center text-sm text-zinc-400">
            No historical data available.
          </p>
        )}
      </div>

      {/* Right — Stablecoins Table */}
      <div className="flex flex-col border border-zinc-200 bg-[#f5f5f5] p-4 md:w-[30%] md:p-5">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">
          Stablecoin Prices
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs font-medium text-zinc-500">
              <th className="pb-3 pr-3">#</th>
              <th className="pb-3 pr-3">Coin</th>
              <th className="pb-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {data.spots.map((spot, i) => {
              const dev = spot.price - peg;
              return (
                <tr
                  key={spot.coin}
                  className="border-b border-zinc-50 last:border-0"
                >
                  <td className="py-2.5 pr-3 tabular-nums text-zinc-400">
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-3 font-medium text-zinc-900">
                    {spot.coin}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    <span className="text-zinc-900">
                      ${spot.price.toFixed(4)}
                    </span>
                    <span
                      className={`ml-2 text-xs ${
                        dev >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {dev >= 0 ? "+" : ""}
                      {dev.toFixed(4)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
