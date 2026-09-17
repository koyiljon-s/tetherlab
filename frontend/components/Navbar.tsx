export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between bg-white px-6 py-3">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex  items-center gap-10">
          <a href="/" className="text-2xl font-bold tracking-tight text-black">Tether<span className="text-black">Lab</span></a>
          <div className="flex items-center gap-6 text-[17px] text-[#1f1f1f] font-semibold">
            <a href="#" className="hover:bg-[#f5f5f5] p-1.5 rounded-full">Dashboard</a>
            <a href="#" className="hover:text-zinc-500">Wallets</a>
            <a href="#" className="hover:text-zinc-500">Send</a>
            <a href="#" className="hover:text-zinc-500">Transactions</a>
            <a href="/docs" className="hover:text-zinc-500">Docs</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/create-demo-wallet"
            className="inline-flex h-10 items-center justify-center rounded-full px-5 text-[16px] font-semibold bg-[#553bff] text-white transition-colors"
          >
            Create Demo Wallet
          </a>

        </div>
      </div>
    </nav>
  )
}
