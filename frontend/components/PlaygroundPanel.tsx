"use client";

import { useState } from "react";
import { Wallet, Loader2, CheckCircle2, AlertCircle, Copy, FlaskConical, Droplets, ExternalLink, Search } from "lucide-react";

type WalletInfo = {
  address: string;
  ownerAddress: string;
  network: string;
};

export default function PlaygroundPanel() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [copied, setCopied] = useState(false);

  const [funding, setFunding] = useState(false);
  const [faucetTx, setFaucetTx] = useState<string | null>(null);
  const [faucetError, setFaucetError] = useState("");

  const [checkingBalance, setCheckingBalance] = useState(false);
  const [balances, setBalances] = useState<{ asset: string; amount: string }[] | null>(null);
  const [balanceError, setBalanceError] = useState("");

  async function createWallet() {
    setCreatingWallet(true);
    setWalletError("");
    try {
      const res = await fetch("/api/wallet", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWallet(data);
    } catch (err: unknown) {
      setWalletError(err instanceof Error ? err.message : "Failed to create wallet");
    } finally {
      setCreatingWallet(false);
    }
  }

  async function fundWallet() {
    if (!wallet) return;
    setFunding(true);
    setFaucetError("");
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet.address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFaucetTx(data.transactionHash);
    } catch (err: unknown) {
      setFaucetError(err instanceof Error ? err.message : "Failed to fund wallet");
    } finally {
      setFunding(false);
    }
  }

  async function checkBalance() {
    if (!wallet) return;
    setCheckingBalance(true);
    setBalanceError("");
    try {
      const res = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet.address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBalances(data.balances);
    } catch (err: unknown) {
      setBalanceError(err instanceof Error ? err.message : "Failed to check balance");
    } finally {
      setCheckingBalance(false);
    }
  }

  function copyAddress() {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="mt-12 flex items-center gap-2 px-4 py-4 text-[15px] font-medium bg-[#f5f5f5] text-[#454545] border-b border-[#ededed] md:mt-0 md:px-6">
        <FlaskConical size={16} strokeWidth={1.75} />
        Playground
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <section className="mt-4">
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-10 items-center justify-center text-[16px] font-bold text-black">
                01/
              </span>
              <h2 className="text-base font-semibold text-black">Create a Wallet</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              A wallet is your identity on the blockchain. It holds a unique address
              (like a bank account number) that others can send tokens to.
            </p>

            {!wallet ? (
              <button
                onClick={createWallet}
                disabled={creatingWallet}
                className="mt-4 inline-flex items-center gap-2 bg-[#2664eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {creatingWallet ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Wallet size={16} />
                )}
                {creatingWallet ? "Creating..." : "Create Wallet"}
              </button>
            ) : (
              <div className="mt-4 border border-[#ededed] bg-[#f5f5f5] p-4">
                <div className="flex items-center gap-2 text-[15px] font-medium text-[#2362eb]">
                  <CheckCircle2 size={16} />
                  Wallet Created
                </div>
                <div className="mt-3 space-y-2 text-[15px]">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-zinc-500">Address</span>
                    <div className="flex items-center gap-1.5">
                      <code className="truncate rounded bg-white px-2 py-0.5 font-mono text-[14px] text-black max-w-[200px] sm:max-w-none">
                        {wallet.address}
                      </code>
                      <button
                        onClick={copyAddress}
                        className="rounded p-1 text-zinc-400 hover:bg-white hover:text-zinc-600"
                        title="Copy address"
                      >
                        <Copy size={14} />
                      </button>
                      {copied && (
                        <span className="text-xs text-[#010101]">Copied!</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Network</span>
                    <span className="text-[14px] text-zinc-700">{wallet.network}</span>
                  </div>
                </div>
              </div>
            )}

            {walletError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={14} />
                {walletError}
              </div>
            )}
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-1">
              <span
                className={`flex h-6 w-10 items-center justify-center text-[16px] font-bold ${
                  wallet ? "text-black" : "text-zinc-300"
                }`}
              >
                02/
              </span>
              <h2
                className={`text-base font-semibold ${wallet ? "text-black" : "text-zinc-400"}`}
              >
                Fund Your Wallet
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Request free testnet USDC from a faucet. This is test currency with no
              real value — perfect for learning how stablecoins work.
            </p>

            <div className={`mt-4 ${!wallet ? "pointer-events-none opacity-40" : ""}`}>
              {!faucetTx ? (
                <button
                  onClick={fundWallet}
                  disabled={funding || !wallet}
                  className="inline-flex items-center gap-2 bg-[#2664eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-60"
                >
                  {funding ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Droplets size={16} />
                  )}
                  {funding ? "Requesting..." : "Request Testnet USDC"}
                </button>
              ) : (
                <div className="border border-[#ededed] bg-[#f5f5f5] p-4">
                  <div className="flex items-center gap-2 text-[15px] font-medium text-[#2362eb]">
                    <CheckCircle2 size={16} />
                    Funds Received
                  </div>
                  <div className="mt-3 text-[15px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Transaction</span>
                      <a
                        href={`https://sepolia.basescan.org/tx/${faucetTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[14px] font-medium text-[#2664eb] hover:underline"
                      >
                        View on BaseScan
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {faucetError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle size={14} />
                  {faucetError}
                </div>
              )}
            </div>
          </section>
          <section className="mt-8">
            <div className="flex items-center gap-1">
              <span
                className={`flex h-6 w-10 items-center justify-center text-[16px] font-bold ${
                  faucetTx ? "text-black" : "text-zinc-300"
                }`}
              >
                03/
              </span>
              <h2
                className={`text-base font-semibold ${faucetTx ? "text-black" : "text-zinc-400"}`}
              >
                Check Balance
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Query the blockchain to see what tokens your wallet holds.
              This reads directly from the network — no database involved.
            </p>

            <div className={`mt-4 ${!faucetTx ? "pointer-events-none opacity-40" : ""}`}>
              <button
                onClick={checkBalance}
                disabled={checkingBalance || !faucetTx}
                className="inline-flex items-center gap-2 bg-[#2664eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {checkingBalance ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                {checkingBalance ? "Checking..." : "Check Balance"}
              </button>

              {balances && (
                <div className="mt-4 border border-[#ededed] bg-[#f5f5f5] p-4">
                  <div className="flex items-center gap-2 text-[15px] font-medium text-[#2362eb]">
                    <CheckCircle2 size={16} />
                    Wallet Balances
                  </div>
                  {balances.length === 0 ? (
                    <span className="mt-3 block text-sm text-zinc-500">No balances found</span>
                  ) : (
                    <div className="mt-4 flex gap-3">
                      {balances.map((b) => {
                        const isStable = b.asset.toLowerCase() === "usdc";
                        const display = isStable
                          ? `$${Number(b.amount).toFixed(2)}`
                          : `${b.amount}`;
                        return (
                          <div
                            key={b.asset}
                            className="flex-1 rounded-lg border border-[#ededed] bg-white px-4 py-4 text-center"
                          >
                            <div className="text-2xl font-semibold text-black">
                              {display}
                            </div>
                            <div className="mt-1 text-xs font-medium uppercase text-zinc-400">
                              {b.asset}
                            </div>
                            {isStable && (
                              <div className="mt-2 text-[11px] text-zinc-400">
                                1 USDC = $1.00 USD
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {balanceError && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle size={14} />
                  {balanceError}
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
