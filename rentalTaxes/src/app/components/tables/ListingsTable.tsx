import { listingsDbTable, propertiesDbTable } from "@/lib/db/schema";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { createPropertyId } from "@/lib/data/normalization";
import { groupProperties, getRevenueAggregates } from "@/lib/db/queries";
import { Listing, RevenueAggregate, PropertyListing } from "@/types";
import Editable from "../forms/Editable";
import { useDb } from "@/lib/db/dbContext";
import { eq } from "drizzle-orm";

export default function ListingsTable({ data }: { data: PropertyListing[] }) {
  const { db, loadProperties, loadListings } = useDb();

  const columns: ColumnDef<PropertyListing>[] = [
    // { accessorKey: "propertyId", header: "Property ID" },
    {
      accessorKey: "propertyName",
      header: "Property",
      cell: ({ row }) => {
        const value =
          "propertyName" in row.original ? row.original.propertyName : "";
        return (
          <Editable
            value={value}
            onSubmit={async ({ inputVal }) => {
              const originalPropId = row.original.propertyId;
              const newPropId = createPropertyId(
                inputVal,
                row.original.address
              );
              await db
                .update(propertiesDbTable)
                .set({ propertyName: inputVal, propertyId: newPropId })
                .where(
                  eq(propertiesDbTable.propertyId, row.original.propertyId)
                );

              await db
                .update(listingsDbTable)
                .set({ propertyId: newPropId })
                .where(eq(listingsDbTable.propertyId, originalPropId));
              await loadProperties();
              await loadListings();
            }}
          />
        );
      },
    },

    {
      header: "Listings",
      cell: ({ row }) => {
        const listings = row.original.listings;
        if (!listings.length) return "-"; //TO DO: make element and add ml-4
        return (
          <ul className="list-none ml-4">
            {listings.map((l) => (
              <li key={l.listingId}>{l.listingName}</li>
            ))}
          </ul>
        );
      },
    },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "town", header: "Town" },
    { accessorKey: "county", header: "County" },
  ];

  const table = useReactTable<PropertyListing>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getSubRows: (row) => ("listings" in row ? row.listings : undefined),
  });

  return (
    <div className="p-2">
      <table className="min-w-full divide-y divide-gray-300 text-sm overflow-x-scroll">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-gray-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  );
}
