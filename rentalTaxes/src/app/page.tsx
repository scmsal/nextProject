"use client";

import TransactionsTable from "./components/tables/TransactionsTable";
import UploadTransactionsForm from "./components/forms/UploadTransactionsForm";
import AggregateSummaries from "./components/data/AggregateSummaries";
import RevenueAggregatesTable from "./components/tables/AggregateTable";
import ListingsTable from "./components/tables/ListingsTable";
import { useMemo } from "react";
import { useDb } from "@/lib/db/dbContext";
import { groupProperties } from "@/lib/db/queries";
import PropertiesTabs from "./components/forms/PropertiesTabs";
import { ListingsTabs } from "./components/forms/ListingsTabs";

export default function Home() {
  const {
    transactionsData,
    revenueAggregatesData,
    propertiesData,
    listingsData,
    db,
  } = useDb();

  const propertiesWithListings = useMemo(
    () => groupProperties(propertiesData, listingsData),
    [propertiesData, listingsData],
  );
  // const [isMobile, setIsMobile]= useState(false)
  return (
    <div>
      <h3 className="underline ms-4 mb-0 pb-0">Step 1</h3>
      <div className="flex flex-col md:flex-row gap-10 w-full justify-center">
        <PropertiesTabs />
        <ListingsTabs />
      </div>
      <div className="flex flex-row w-full justify-center">
        {listingsData && <ListingsTable data={propertiesWithListings} />}
      </div>
      <h3 className="underline">Step 2</h3>
      <div>
        <UploadTransactionsForm />
        {/* <DateFilterForm /> */}
        {transactionsData && (
          <TransactionsTable data={transactionsData} db={db} />
        )}
      </div>
      <h3 className="underline">Step 3</h3>
      <div className="flex flex-col">
        <AggregateSummaries />
        <RevenueAggregatesTable data={revenueAggregatesData} />
      </div>
    </div>
  );
}
