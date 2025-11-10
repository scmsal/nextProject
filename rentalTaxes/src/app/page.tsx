"use client";

import TransactionsTable from "./components/TransactionsTable";
import UploadTransactionsForm from "./components/UploadTransactionsForm";
import { AddPropertyForm } from "./components/AddPropertyForm";
import UploadPropertiesForm from "./components/UploadPropertiesForm";
import { AddListingForm } from "./components/AddListingForm";
import UploadListingsForm from "./components/UploadListingsForm";
import AggregateSummaries from "./components/AggregateSummaries";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Providers } from "@/lib/db/providers";
import { useDb } from "@/lib/db/providers";

export default function Home() {
  // You will also need listing and property data
  const { transactionsData } = useDb();
  // const pathname = usePathname(); //TO DO: see if it's still necessary

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl">Rental Income Manager</h1>
        <h3 className="underline">Step 1</h3>
        <div className="flex flex-col md:flex-row gap-10">
          <AddPropertyForm />
          <UploadPropertiesForm />
        </div>
        <h3 className="underline">Step 2</h3>
        <div className="flex flex-col md:flex-row gap-10">
          <AddListingForm />
          <UploadListingsForm />
        </div>
        <h3 className="underline">Step 3</h3>
        <div>
          <UploadTransactionsForm />
          {transactionsData && <TransactionsTable data={transactionsData} />}
        </div>
        <h3 className="underline">Step 4</h3>
        <div className="flex flex-col md:flex-row">
          <AggregateSummaries />
        </div>
      </main>
    </div>
  );
}
