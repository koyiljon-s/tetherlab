import Sidebar from "@/components/Sidebar";
import PlaygroundPanel from "@/components/PlaygroundPanel";

export default function PlaygroundPage() {
  return (
    <div className="flex flex-1 bg-zinc-50 font-sans dark:bg-black">
      <Sidebar />
      <PlaygroundPanel />
    </div>
  );
}
