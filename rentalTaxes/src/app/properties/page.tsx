"use client";

import { useDb } from "@/lib/db/dbContext";
import ListingsTable from "../components/tables/ListingsTable";
import { groupProperties } from "@/lib/db/queries";
import PropertiesTabs from "../components/forms/PropertiesTabs";
import { ListingsTabs } from "../components/forms/ListingsTabs";
import { useMemo } from "react";

export default function PropertiesPage() {
  const { propertiesData, listingsData, db } = useDb();

  const propertiesWithListings = useMemo(
    () => groupProperties(propertiesData, listingsData),
    [propertiesData, listingsData],
  );

  return (
    <div>
      <h3 className="underline ms-4 mb-4 pb-0 text-secondary">
        Step 1: Manage properties and listings
      </h3>
      <div className="flex flex-col md:flex-row gap-10 w-full justify-center">
        <PropertiesTabs />
        <ListingsTabs />
      </div>
      <div className="flex flex-row w-full justify-center">
        {listingsData && <ListingsTable data={propertiesWithListings} />}
      </div>
    </div>
  );
}
