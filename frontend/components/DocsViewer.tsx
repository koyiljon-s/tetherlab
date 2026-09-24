"use client";

import { useState } from "react";
import DocsContent from "@/components/DocsContent";
import DocsSidebar from "@/components/DocsSidebar";

export default function DocsViewer() {
  const [activeQuestion, setActiveQuestion] = useState("what-is-tether");

  return (
    <div className="mx-auto flex w-full max-w-384">
      <DocsSidebar activeQuestion={activeQuestion} onSelect={setActiveQuestion} />
      <DocsContent activeQuestion={activeQuestion} />
    </div>
  );
}
