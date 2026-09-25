"use client";

import { useState } from "react";
import { Wallet, Loader2, CheckCircle2, AlertCircle, Copy } from "lucide-react";

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

  function copyAddress() {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="px-6 py-4 text-[15px] font-medium bg-[#f5f5f5] text-[#454545] border-b border-[#ededed]">
        Playground
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <section className="mt-8">
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
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Address</span>
                    <div className="flex items-center gap-1.5">
                      <code className="rounded bg-white px-2 py-0.5 font-mono text-[14px] text-black">
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
                        <span className="text-xs text-emerald-600">Copied!</span>
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
        </div>
      </main>

      <footer className="px-6 py-4 text-[14px] font-medium bg-[#f5f5f5] text-[#454545] border-t border-[#ededed]">
        | • TETHER LAB is not an official Tether product • |
      </footer>
    </div>
  );
}
