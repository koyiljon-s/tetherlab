import Sidebar from "@/components/Sidebar";
import SandboxPanel from "@/components/SandboxPanel";

export default function SandboxPage() {
  return (
    <div className="flex flex-1 bg-zinc-50 font-sans dark:bg-black">
      <Sidebar />
      <SandboxPanel />
    </div>
  );
}
