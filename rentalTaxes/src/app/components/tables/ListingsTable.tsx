import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { groupProperties, getRevenueAggregates } from "@/lib/db/queries";
import { Listing, RevenueAggregate, PropertyListing } from "@/types";
import { useDb } from "@/lib/db/providers";
import { useState } from "react";
//TO DO: build listings table with TanStack

// export default function ListingsTable({ data }: { data: Property[] }) {}

const { propertiesData, listingsData } = useDb();

const propertiesWithListings = groupProperties(propertiesData, listingsData);

export default function ListingsTable(rows: PropertyListing) {}
