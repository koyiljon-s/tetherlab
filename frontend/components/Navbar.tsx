export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-[#ededed] bg-white px-4 py-3 md:px-6">
      <div className="mx-auto flex w-full max-w-384 items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/" className="text-xl font-bold tracking-tight text-black md:text-2xl">Tether<span className="text-black">Lab</span></a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center px-3 text-[13px] font-semibold bg-[#e650bb] text-white transition-colors md:px-4 md:text-[14px]"
          >
            Tether Lab Console
          </a>
        </div>
      </div>
    </nav>
  )
}
