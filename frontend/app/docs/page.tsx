import Navbar from "@/components/Navbar";
import DocsViewer from "@/components/DocsViewer";
import Sidebar from "@/components/Sidebar";

export default function Docs() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <div className="flex flex-1 bg-white">
        <DocsViewer />
      </div>
    </div>
  );
}
