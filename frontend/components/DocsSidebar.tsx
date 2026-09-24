const sidebarItems = [
  { id: "what-is-tether", label: "What is Tether?" },
  { id: "why-coinbase-testnet-tools", label: "Coinbase tesnet tools" },
  { id: "what-is-sandbox", label: "What is Sandbox?" },
  { id: "what-is-playground", label: "What is Playground?" },
];

type DocsSidebarProps = {
  activeQuestion: string;
  onSelect: (questionId: string) => void;
};

export default function DocsSidebar({ activeQuestion, onSelect }: DocsSidebarProps) {

  return (
    <aside className="w-58 shrink-0 border-r border-[#ededed] px-6 pt-4">
      <nav className="flex flex-col gap-1">
        {sidebarItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => onSelect(item.id)}
            className={`flex items-center justify-between gap-2 rounded-md py-2 text-sm transition-colors ${
              activeQuestion === item.id ? "text-[#e650bb] font-medium" : "text-[#1f1f1f]"
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
