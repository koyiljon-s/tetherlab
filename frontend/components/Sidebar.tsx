"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, BarChart3, FileText, Hexagon, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Playground", href: "/playground", icon: FlaskConical },
  { label: "Sandbox", href: "/sandbox", icon: BarChart3 },
  { label: "Documentation", href: "/docs", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <>
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 px-3 text-sm font-semibold tracking-tight text-black"
        onClick={() => setOpen(false)}
      >
        <Hexagon size={20} strokeWidth={1.75} />
        TETHER <span>LAB</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors ${
                isActive
                  ? "bg-zinc-100 text-black"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-[#2664eb]"
              }`}
            >
              <Icon size={18} strokeWidth={1.25} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-zinc-200 bg-[#fafafa] px-4 py-3 md:hidden">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-black">
          <Hexagon size={20} strokeWidth={1.75} />
          TETHER LAB
        </Link>
        <button onClick={() => setOpen(!open)} className="p-1 text-zinc-600">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 transform flex-col border-r border-zinc-200 bg-[#fafafa] px-2 py-6 transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-[#fafafa] px-2 py-6 md:flex">
        {nav}
      </aside>
    </>
  );
}
