export default function DocsContent() {
  return (
    <main className="flex-1 p-10 bg-[#1c1c1c]">
      <section id="what-is-tether" className="max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-white">What is Tether?</h1>
        <div className="space-y-4 text-[17px] leading-relaxed text-[#bebfc4]">
          <p>
            Tether (USDT) is a stablecoin — a type of cryptocurrency designed to maintain
            a stable value by pegging its price to a reserve asset, in this case the
            US Dollar. Each USDT token is intended to be backed 1:1 by Tether Limited's
            reserves, meaning one Tether should always be redeemable for one US Dollar.
          </p>
          <p>
            Stablecoins like Tether solve one of the biggest problems in cryptocurrency:
            volatility. While assets like Bitcoin and Ethereum can swing dramatically in
            price over short periods, Tether provides a predictable store of value that
            can be used for trading, remittances, and decentralized finance (DeFi)
            applications without the risk of sudden price changes.
          </p>
          <p>
            Tether operates on multiple blockchains, including Ethereum (as an ERC-20
            token), Tron, Solana, and others, making it one of the most widely used
            and liquid stablecoins in the crypto ecosystem. It is the foundation of
            many trading pairs on exchanges worldwide.
          </p>
        </div>
      </section>
    </main>
  );
}