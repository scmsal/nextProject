"use client";

import { useState } from "react";
import ToggleSidebar from "../ToggleSidebar";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false); //better to use media queries?

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside
        className={`transition-all duration-300 ${
          isExpanded ? "w-72" : "w-20"
        }`}
      >
        <ToggleSidebar
        //raise the state from inside the component to here
        // isExpanded={isExpanded}
        // toggle={() => setIsExpanded(!isExpanded)}
        />
      </aside>
      <main className="flex flex-1 flex-col ow-start-2 gap-2 overflow-y-auto mt-6 px-3">
        {children}
      </main>
    </div>
  );
}
