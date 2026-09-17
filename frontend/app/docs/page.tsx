import Navbar from "@/components/Navbar";
import DocsSidebar from "@/components/DocsSidebar";
import DocsContent from "@/components/DocsContent";

export default function Docs() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <DocsSidebar />
        <DocsContent />
      </div>
    </div>
  );
}