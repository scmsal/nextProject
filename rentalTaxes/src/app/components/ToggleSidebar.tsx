import React, { useState } from "react";
import {
  Menu,
  MessageSquare,
  Plus,
  Settings,
  ChevronLeft,
  House,
  BadgeDollarSign,
  Sheet,
  PanelLeft,
  PanelLeftClose,
  SquarePen,
  NotebookTabs,
} from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
const ToggleSidebar = () =>
  // { isExpanded, setIsExpanded }: SidebarProps
  {
    const [isExpanded, setIsExpanded] = useState(true);
    const sideTabs = [
      {
        title: "Properties & Listings",
        icon: House,
        slug: "/properties",
      },
      { title: "Transactions", icon: BadgeDollarSign, slug: "/transactions" },
      { title: "Summaries", icon: Sheet, slug: "/summaries" },
    ];

    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Container */}
        <aside
          className={`relative flex flex-col bg-gray-50 transition-all duration-300 ease-in-out ${
            isExpanded ? "w-72" : "w-20"
          }`}
        >
          {/* Sidebar Header */}
          <div
            className={`flex p-3 pb-0 mb-0 ${
              isExpanded ? "justify-between" : "justify-center"
            }`}
          >
            {/* Logo */}
            {isExpanded && (
              <div className="flex items-center gap-2 animate-in fade-in duration-300 p-0 rounded-lg">
                <img
                  src="../icon.png"
                  alt="logo of house with dollar bill"
                  className="h-12 w-12 object-contain"
                />
              </div>
            )}
            {/* Top Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 text-foreground hover:bg-color-muted hover:text-accent-foreground rounded-full transition-colors"
            >
              {isExpanded ? (
                <PanelLeftClose size={24} />
              ) : (
                <PanelLeft size={24} />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="p-3">
              <h1 className="text-surface-foreground font-bold text-3xl mb-1.5 ">
                Rental revenue calculator
              </h1>
              <p className="text-foreground">
                <strong>Simplify </strong> county hotel/motel occupancy{" "}
                <strong>tax reporting</strong>
              </p>
              <p>
                {" "}
                – view your earnings by <strong>property</strong> and{" "}
                <strong>length of stay</strong>{" "}
              </p>
            </div>
          )}
          {/* "Wizard" Button */}
          <div className="px-3 mb-6">
            <button
              className={`flex items-center gap-3 p-3 rounded-full text-background bg-black hover:bg-gray-800 transition-all cursor-pointer ${
                !isExpanded ? "w-12 justify-center" : "w-fit pr-6"
              }`}
            >
              <NotebookTabs size={24} />
              {isExpanded && (
                <span className="whitespace-nowrap font-medium">
                  Start here
                </span>
              )}
            </button>
          </div>

          {/* Navigation Items */}

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {sideTabs.map((item) => {
              const Icon = item.icon;
              return (
                <Link href={item.slug} key={item.title}>
                  <button className="flex items-center w-full gap-3 p-3 rounded-lg hover:bg-(--surface-muted) text-surface-foreground cursor-pointer">
                    <Icon />
                    {isExpanded && (
                      <span className="truncate text-sm">{item.title}</span>
                    )}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t border-[#333537]">
            <div className="flex items-center gap-3 p-3 rounded-full  text-background bg-black hover:bg-gray-800  cursor-pointer">
              <Settings size={20} />
              {isExpanded && <span className="text-sm">Settings</span>}
            </div>
          </div>
        </aside>

        {/* Main Content */}
      </div>
    );
  };

export default ToggleSidebar;
