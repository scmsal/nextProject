import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getListingsWithProperties,
  getPropertyAggregates,
} from "@/lib/db/queries";
import { Listing, PropertySummary } from "@/types";
import { useDb } from "@/lib/db/providers";
import { useState } from "react";
//TO DO: build listings table with TanStack

// export default function ListingsTable({ data }: { data: Property[] }) {}

export default function ListingsTable() {
  const { db } = useDb();

  const [grouped, setGrouped] = useState(false);
  const [data, setData] = useState<(Listing | PropertySummary)[]>([]);
}
