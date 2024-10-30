"use client";

import { useState } from "react";
import Link from "next/link";

export default function SidePane() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`flex min-h-screen bg-gray-800 text-white transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="items-center justify-between p-4 border-b border-gray-600">
          <button
            className="text-gray-300 hover:text-white"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        </div>

        <nav className="mt-4 space-y-2">
          <Link href="/invoice_code"
            className="block px-4 py-2 hover:bg-gray-700">
              <span className={`${isCollapsed ? "hidden" : "inline"}`}>Generate QR</span>
          </Link>
          <Link href="/transfer"
            className="block px-4 py-2 hover:bg-gray-700">
              <span className={`${isCollapsed ? "hidden" : "inline"}`}>Make Transer</span>
          </Link>
          {/* Add more links here */}
        </nav>
    </div>
  );
}
