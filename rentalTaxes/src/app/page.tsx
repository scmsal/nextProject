"use client";

import UploadForm from "./components/UploadForm";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TransactionsTable from "./components/TransactionsTable";
// import { useState, useEffect } from "react";
// import { Transaction } from "./components/TransactionsTable";
// import { Providers } from "@/lib/db/providers";
// import { useDrizzle } from "@/lib/db/client";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl">Rental Income Manager</h1>

        <UploadForm />
      </main>
    </div>
  );
}
