"use client";

import TransactionsTable from "./components/TransactionsTable";
import UploadForm from "./components/UploadForm";
import { PropertiesForm } from "./components/PropertiesForm";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Providers } from "@/lib/db/providers";
import { useDb } from "@/lib/db/providers";

export default function Home() {
  // You will also need listing and property data
  const { transactionsData } = useDb();
  const pathname = usePathname();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl">Rental Income Manager</h1>

        <UploadForm />
        {transactionsData && <TransactionsTable data={transactionsData} />}
        <PropertiesForm />
      </main>
    </div>
  );
}
