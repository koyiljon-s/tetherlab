"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  BarChart3,
  Loader2,
  AlertCircle,
  Coins,
  ArrowRightLeft,
} from "lucide-react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Holder = {
  label: string;
  balance: number;
};

type ContractInfo = {
  name: string;
  symbol: string;
  contract: string;
  network: string;
  decimals: number;
  totalSupply: string;
  holders: Holder[];
};

const HOLDER_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];

const holderChartConfig = {
  balance: { label: "USDT Balance" },
} satisfies ChartConfig;

type BalanceResult = {
  address: string;
  balance: string;
  symbol: string;
};

type Transfer = {
  from: string;
  to: string;
  amount: string;
  blockNumber: number;
  txHash: string;
};

function formatSupply(value: string) {
  const num = Number(value);
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
}

export default function SandboxPanel() {
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [contractLoading, setContractLoading] = useState(true);

  const [address, setAddress] = useState("");
  const [balanceResult, setBalanceResult] = useState<BalanceResult | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  const [transfers, setTransfers] = useState<Transfer[] | null>(null);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [transfersError, setTransfersError] = useState("");

  useEffect(() => {
    fetch("/api/sandbox")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setContractInfo(data);
      })
      .finally(() => setContractLoading(false));
  }, []);

  async function lookupBalance() {
    setBalanceLoading(true);
    setBalanceError("");
    setBalanceResult(null);
    try {
      const res = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "balance", address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBalanceResult(data);
    } catch (err: unknown) {
      setBalanceError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setBalanceLoading(false);
    }
  }

  async function loadRecentTransfers() {
    setTransfersLoading(true);
    setTransfersError("");
    try {
      const res = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recent" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTransfers(data.transfers);
    } catch (err: unknown) {
      setTransfersError(err instanceof Error ? err.message : "Failed to load transfers");
    } finally {
      setTransfersLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="flex items-center gap-2 px-6 py-4 text-[15px] font-medium bg-[#f5f5f5] text-[#454545] border-b border-[#ededed]">
        <BarChart3 size={16} strokeWidth={1.75} />
        Sandbox
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-6xl">

          {/* USDT Contract Info */}
          <section className="mt-4">
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-10 items-center justify-center text-[16px] font-bold text-black">
                01/
              </span>
              <h2 className="text-base font-semibold text-black">USDT Contract</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Tether (USDT) lives as a smart contract on Ethereum. Here is its
              real on-chain data, read directly from the blockchain.
            </p>

            {contractLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 size={14} className="animate-spin" />
                Loading contract data...
              </div>
            ) : contractInfo ? (
              <div className="mt-4 space-y-4">
                {/* Stat tiles */}
                <div className="flex gap-3">
                  <div className="flex-1 border border-[#ededed] bg-[#7c68ed] px-4 py-4 text-center">
                    <div className="text-2xl font-semibold text-white">
                      {formatSupply(contractInfo.totalSupply)}
                    </div>
                    <div className="mt-1 text-xs font-medium text-zinc-200">
                      Total Supply
                    </div>
                  </div>
                  <div className="flex-1 border border-[#ededed] bg-[#3bb371] px-4 py-4 text-center">
                    <div className="text-2xl font-semibold text-white">
                      {contractInfo.symbol}
                    </div>
                    <div className="mt-1 text-xs font-medium text-zinc-200">
                      Symbol
                    </div>
                  </div>
                  <div className="flex-1 border border-[#ededed] bg-[#0088ff] px-4 py-4 text-center">
                    <div className="text-2xl font-semibold text-white">
                      {contractInfo.network}
                    </div>
                    <div className="mt-1 text-xs font-medium text-zinc-200">
                      Network
                    </div>
                  </div>
                </div>

                {/* Top holders bar chart */}
                {contractInfo.holders && contractInfo.holders.length > 0 && (
                  <div className="border border-[#ededed] bg-[#f5f5f5] p-5">
                    <h3 className="text-sm font-semibold text-zinc-900">
                      Top USDT Holders (Ethereum)
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Real on-chain balances of major wallets
                    </p>
                    <ChartContainer config={holderChartConfig} className="mt-4 h-70 w-full">
                      <BarChart
                        data={contractInfo.holders}
                        layout="vertical"
                        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                      >
                        <CartesianGrid horizontal={false} strokeDasharray="" />
                        <YAxis
                          dataKey="label"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 13 }}
                          width={110}
                        />
                        <XAxis
                          type="number"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v: number) => formatSupply(String(v))}
                          tick={{ fontSize: 12 }}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) => [
                                `$${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
                                "USDT",
                              ]}
                            />
                          }
                        />
                        <Bar dataKey="balance" radius={[0, 4, 4, 0]}>
                          {contractInfo.holders.map((_, i) => (
                            <Cell key={i} fill={HOLDER_COLORS[i % HOLDER_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}

                <div className="flex items-center justify-between border border-[#ededed] bg-[#f5f5f5] px-4 py-3 text-[15px]">
                  <span className="text-zinc-500">Contract</span>
                  <code className="rounded bg-white px-2 py-0.5 font-mono text-[14px] text-black">
                    {contractInfo.contract}
                  </code>
                </div>
              </div>
            ) : null}
          </section>

          {/* Balance Lookup */}
          <section className="mt-8">
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-10 items-center justify-center text-[16px] font-bold text-black">
                02/
              </span>
              <h2 className="text-base font-semibold text-black">Look Up USDT Balance</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Enter any Ethereum wallet address to see how much USDT it holds.
              This reads real data from the blockchain — try a known address like an exchange wallet.
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:border-[#2664eb] focus:outline-none focus:ring-1 focus:ring-[#2664eb]"
              />
              <button
                onClick={lookupBalance}
                disabled={balanceLoading || !address}
                className="inline-flex items-center gap-2 bg-[#2664eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {balanceLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Coins size={14} />
                )}
                Look Up
              </button>
            </div>

            {balanceResult && (
              <div className="mt-4 border border-[#ededed] bg-[#f5f5f5] p-4">
                <div className="flex-1 rounded-lg border border-[#ededed] bg-white px-4 py-4 text-center">
                  <div className="text-2xl font-semibold text-black">
                    ${Number(balanceResult.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-1 text-xs font-medium text-zinc-400">
                    {balanceResult.symbol} Balance
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400">
                    1 USDT = $1.00 USD
                  </div>
                </div>
              </div>
            )}

            {balanceError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={14} />
                {balanceError}
              </div>
            )}
          </section>

          {/* Recent USDT Transfers */}
          <section className="mt-8">
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-10 items-center justify-center text-[16px] font-bold text-black">
                03/
              </span>
              <h2 className="text-base font-semibold text-black">Recent USDT Transfers</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              See real USDT transfers happening on Ethereum right now.
              Every transfer is publicly recorded on the blockchain.
            </p>

            <div className="mt-4">
              <button
                onClick={loadRecentTransfers}
                disabled={transfersLoading}
                className="inline-flex items-center gap-2 bg-[#2664eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {transfersLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRightLeft size={14} />
                )}
                {transfersLoading ? "Loading..." : transfers ? "Refresh" : "Load Recent Transfers"}
              </button>

              {transfers && (
                <div className="mt-4 overflow-hidden border border-[#ededed]">
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="bg-[#f5f5f5] text-left text-xs font-medium text-zinc-500">
                        <th className="px-4 py-2.5">From</th>
                        <th className="px-4 py-2.5">To</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                        <th className="px-4 py-2.5 text-right">Block</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transfers.map((t, i) => (
                        <tr
                          key={`${t.txHash}-${i}`}
                          className="border-t border-[#ededed] bg-white"
                        >
                          <td className="px-4 py-2.5">
                            <code className="font-mono text-black">
                              {t.from.slice(0, 6)}...{t.from.slice(-4)}
                            </code>
                          </td>
                          <td className="px-4 py-2.5">
                            <code className="font-mono text-black">
                              {t.to.slice(0, 6)}...{t.to.slice(-4)}
                            </code>
                          </td>
                          <td className="px-4 py-2.5 text-right font-medium text-black">
                            ${Number(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-2.5 text-right text-zinc-500">
                            {t.blockNumber.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {transfersError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle size={14} />
                  {transfersError}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="px-6 py-4 text-[14px] font-medium bg-[#f5f5f5] text-[#454545] border-t border-[#ededed]">
        | • TETHER LAB is not an official Tether product • |
      </footer>
    </div>
  );
}
