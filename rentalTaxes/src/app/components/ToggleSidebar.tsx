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
} from "lucide-react";
import { Button } from "@heroui/react";

const ToggleSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sideTabs = [
    {
      title: "Properties & Listings",
      icon: House,
    },
    { title: "Transactions", icon: BadgeDollarSign },
    { title: "Summaries", icon: Sheet },
  ];

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] overflow-hidden">
      {/* Sidebar Container */}
      <aside
        className={`relative flex flex-col bg-field-on-background transition-all duration-300 ease-in-out ${
          isExpanded ? "w-72" : "w-20"
        }`}
      >
        {/* Top Toggle Button */}
        <div
          className={`flex p-4 mb-4 ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded && (
            <div className="flex items-center gap-2 animate-in fade-in duration-300 p-1.5 rounded-lg">
              <img
                src="/Gemini_Generated_Logo_no_bg.png"
                alt="logo of house with dollar bill"
                className="h-12 w-12 object-contain"
              />
            </div>
          )}
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

        {/* "Wizard" Button */}
        <div className="px-3 mb-6">
          <button
            className={`flex items-center gap-3 p-3 rounded-full bg-[#333537] hover:bg-[#3f4144] transition-all ${
              !isExpanded ? "w-12 justify-center" : "w-fit pr-6"
            }`}
          >
            <SquarePen size={24} />
            {isExpanded && (
              <span className="whitespace-nowrap font-medium">Start here</span>
            )}
          </button>
        </div>

        {/* Navigation Items */}

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {sideTabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                className="flex items-center gap-3 p-3 rounded-full hover:bg-[var(--surface-muted)] text-surface-foreground cursor-pointer"
              >
                <Icon />
                {isExpanded && (
                  <span className="truncate text-sm">{item.title}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#333537]">
          <div className="flex items-center gap-3 p-3 rounded-full  bg-[#333537] hover:bg-[#3f4144]  cursor-pointer">
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
