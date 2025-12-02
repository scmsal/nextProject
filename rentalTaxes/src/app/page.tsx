"use client";

import TransactionsTable from "./components/tables/TransactionsTable";
import UploadTransactionsForm from "./components/forms/UploadTransactionsForm";
import { AddPropertyForm } from "./components/forms/AddPropertyForm";
import UploadPropertiesForm from "./components/forms/UploadPropertiesForm";
import { AddListingForm } from "./components/forms/AddListingForm";
import UploadListingsForm from "./components/forms/UploadListingsForm";
import AggregateSummaries from "./components/data/AggregateSummaries";
import RevenueAggregatesTable from "./components/tables/AggregateTable";
import ListingsTable from "./components/tables/ListingsTable";
import DateFilterForm from "./components/forms/DateFilterForm";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useDb } from "@/lib/db/dbContext";
import { groupProperties } from "@/lib/db/queries";

export default function Home() {
  const {
    transactionsData,
    revenueAggregatesData,
    propertiesData,
    listingsData,
  } = useDb();

  const propertiesWithListings = useMemo(
    () => groupProperties(propertiesData, listingsData),
    [propertiesData, listingsData]
  );

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
          {listingsData && <ListingsTable data={propertiesWithListings} />}
        </div>
        <h3 className="underline">Step 3</h3>
        <div>
          <UploadTransactionsForm />
          {/* <DateFilterForm /> */}
          {transactionsData && <TransactionsTable data={transactionsData} />}
        </div>
        <h3 className="underline">Step 4</h3>
        <div className="flex flex-col">
          <AggregateSummaries />
          <RevenueAggregatesTable data={revenueAggregatesData} />
        </div>
      </main>
    </div>
  );
}
