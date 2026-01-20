import React, { useState } from "react";
import { Tabs, Tab, Button, TabIndicator } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { House, BadgeDollarSign, Sheet } from "lucide-react";

export default function SideTabs() {
  //   {
  //   isExpanded,
  //   setIsExpanded,
  // }: {
  //   isExpanded: boolean;
  //   setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  // }
  const pathname = usePathname();
  const router = useRouter();

  const sideTabs = [
    {
      title: "Properties & Listings",
      icon: House,
      route: "/properties",
    },
    { title: "Transactions", icon: BadgeDollarSign, route: "/transactions" },
    { title: "Summaries", icon: Sheet, route: "/summaries" },
  ];

  return (
    <Tabs
      className="w-full max-w-md"
      selectedKey={pathname}
      onSelectionChange={(key) => router.push(key.toString())}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options" className="text-accent">
          {sideTabs.map((item) => {
            const Icon = item.icon;
            return (
              <Tabs.Tab id={item.title} key={item.route}>
                <div>
                  <div className="flex items-center gap-3 p-3">
                    <Icon />
                    {/* {isExpanded && (
                      <span className="truncate text-sm">{item.title}</span>
                    )} */}
                  </div>
                </div>
                <TabIndicator />
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="mt-0 pt-0 " id="form">
        <></>
      </Tabs.Panel>
      <Tabs.Panel className="mt-0 pt-0  " id="upload-csv">
        <></>
      </Tabs.Panel>
    </Tabs>
  );
}
