export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-[#ededed] bg-white px-6 py-3">
      <div className="mx-auto flex w-full max-w-384 items-center justify-between">
        <div className="flex  items-center gap-10">
          <a href="/" className="text-2xl font-bold tracking-tight text-black">Tether<span className="text-black">Lab</span></a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center px-4 text-[14px] font-semibold bg-[#e650bb] text-white transition-colors"
          >
            Tether Lab Console
          </a>

        </div>
      </div>
    </nav>
  )
}
