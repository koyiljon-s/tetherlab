import { ArrowUpRight } from "lucide-react";

export default function HomePanel() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex-1" />
      <div className="flex justify-end px-6 py-3">
        <a
          href="mailto:buidl@koyiljon.com"
          className="inline-flex items-center gap-1.5 bg-[#2664eb] border border-zinc-200 px-4 py-4 text-sm font-medium text-white"
        >
          Help us improve Tether Lab
          <ArrowUpRight size={16} strokeWidth={2} />
        </a>
      </div>
      <footer className="px-6 py-4 text-[14px] font-medium bg-[#f5f5f5] text-[#454545] border-t border-[#ededed]">
        | • TETHER LAB is not an official Tether product • |
      </footer>
    </div>
  );
}
