type DocsContentProps = {
  activeQuestion: string;
};

export default function DocsContent({ activeQuestion }: DocsContentProps) {
  return (
    <main className="flex-1 p-12">
      {activeQuestion === "what-is-tether" && (
        <section id="what-is-tether" className="max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-[#1f1f1f]">What is Tether?</h1>
        <div className="space-y-4 text-[17px] leading-relaxed text-[#4e5861]">
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
      )}
      {activeQuestion === "why-coinbase-testnet-tools" && (
        <section id="why-coinbase-testnet-tools" className="max-w-3xl">
        <h2 className="mb-6 text-3xl font-bold text-[#1f1f1f]">Why we used Coinbase tesnet tools</h2>
        <div className="space-y-4 text-[17px] leading-relaxed text-[#4e5861]">
          <p>
            Coinbase testnet tools let students explore blockchain transfers in a safe,
            low-risk environment. They can create wallets and submit test transactions
            without using real money or interacting with a live production network.
          </p>
          <p>
            TetherLab uses Base Sepolia and testnet USDC as a technical stand-in for
            USDT where blockchain interaction is demonstrated. This makes it possible
            to observe how addresses, transactions, and confirmations work while keeping
            the lesson focused on stablecoin concepts.
          </p>
        </div>
        </section>
      )}
      {activeQuestion === "what-is-sandbox" && (
        <section id="what-is-sandbox" className="max-w-3xl">
        <h2 className="mb-6 text-3xl font-bold text-[#1f1f1f]">What is Sandbox?</h2>
        <div className="space-y-4 text-[17px] leading-relaxed text-[#4e5861]">
          <p>
            A sandbox is an isolated testing environment that mimics the behavior of a
            production system without any real-world consequences. In the context of
            TetherLab, the sandbox lets you experiment with wallet creation, token
            transfers, and blockchain interactions using test networks and faucet-funded
            tokens.
          </p>
          <p>
            No real assets are at risk inside the sandbox. Transactions are processed on
            testnets like Base Sepolia, where tokens have no monetary value. This makes
            it an ideal space for learning how stablecoin transfers work, debugging
            integration code, and understanding blockchain mechanics before moving to
            a live environment.
          </p>
        </div>
        </section>
      )}
      {activeQuestion === "what-is-playground" && (
        <section id="what-is-playground" className="max-w-3xl">
        <h2 className="mb-6 text-3xl font-bold text-[#1f1f1f]">What is Playground?</h2>
        <div className="space-y-4 text-[17px] leading-relaxed text-[#4e5861]">
          <p>
            The Playground is TetherLab's interactive environment where you can execute
            stablecoin operations hands-on. It provides a guided interface for creating
            wallets, requesting testnet tokens from a faucet, and initiating transfers
            between addresses — all within a few clicks.
          </p>
          <p>
            Unlike the sandbox, which is a general-purpose testing space, the Playground
            is structured around specific workflows and learning objectives. It walks you
            through each step of a transaction lifecycle so you can observe how balances
            update, how confirmations work, and how the underlying blockchain records
            each transfer.
          </p>
        </div>
        </section>
      )}
    </main>
  );
}
