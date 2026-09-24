import Sidebar from "@/components/Sidebar";
import HomePanel from "@/components/HomePanel";

export default function Home() {
  return (
    <div className="flex flex-1 bg-zinc-50 font-sans dark:bg-black">
      <Sidebar />
      <HomePanel />
    </div>
  );
}
