export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-[#2e2e2e] bg-[#1c1c1c] px-6 py-3">
      <div className="flex items-center gap-12">
        <a href="/" className="text-2xl font-bold tracking-tight">Tether<span className="text-white">Lab</span></a>
        <div className="flex items-center gap-8 text-[18px] text-zinc-600 dark:text-[#bebfc4]">
          <a href="#" className="hover:text-zinc-100">Dashboard</a>
          <a href="#" className="hover:text-zinc-100">Wallets</a>
          <a href="#" className="hover:text-zinc-100">Send</a>
          <a href="#" className="hover:text-zinc-100">Transactions</a>
          <a href="/docs" className="hover:text-zinc-100">Docs</a>
        </div>
      </div>
      <div className="flex items-center gap-3">
          <a
            href="/contact-us"
            className="inline-flex h-10 items-center justify-center rounded-full px-5 text-lg font-semibold bg-[#1c1c1c] border border-[#00c0de] text-white transition-colors"
          >
            Create Demo Wallet
          </a>

      </div>
    </nav>
  )
}
