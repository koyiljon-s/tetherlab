"use client";

import { useState } from "react";

const sidebarItems = [
  { id: "what-is-tether", label: "What is Tether?" },
];

export default function DocsSidebar() {
  const [active, setActive] = useState("what-is-tether");

  return (
    <aside className="w-68 shrink-0  border-[#2e2e2e] bg-[#1c1c1c] pt-8 pl-4">
      <nav className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActive(item.id)}
            className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-[17px] transition-colors hover:bg-[#2e2e2e] hover:text-white ${
              active === item.id ? "text-[#00c0de]" : "text-[#bebfc4]"
            }`}
          >
            {item.label}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
            >
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        ))}
      </nav>
    </aside>
  );
}