"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, BarChart3, FileText, Hexagon } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Playground", href: "/playground", icon: FlaskConical },
  { label: "Usage", href: "/usage", icon: BarChart3 },
  { label: "Documentation", href: "/docs", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-[#fafafa] px-2 py-6">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 px-3 text-sm font-semibold tracking-tight text-black"
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
    </aside>
  );
}
