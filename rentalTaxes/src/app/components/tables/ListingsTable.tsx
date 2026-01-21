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
import { clearPropAndListings } from "@/lib/db/queries";
import { Button } from "@heroui/react";

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
                row.original.address,
              );
              await db
                .update(propertiesDbTable)
                .set({ propertyName: inputVal, propertyId: newPropId })
                .where(
                  eq(propertiesDbTable.propertyId, row.original.propertyId),
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
    { header: "Property ID", accessorKey: "propertyId" },

    { accessorKey: "address", header: "Address" },
    { accessorKey: "town", header: "Town" },
    { accessorKey: "county", header: "County" },
    {
      header: "Listings",
      cell: ({ row }) => {
        const listings = row.original.listings;
        if (!listings.length) return "-"; //TO DO: make element and add ml-4
        return (
          <ul className="list-disc ml-4">
            {listings.map((l) => (
              <li key={l.listingId}>{l.listingName}</li>
            ))}
          </ul>
        );
      },
    },
  ];

  const table = useReactTable<PropertyListing>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getSubRows: (row) => ("listings" in row ? row.listings : undefined),
  });

  return (
    <div className="flex flex-col overflow-x-scroll w-full px-4">
      <div className="flex sm:flex-row justify-between w-full mb-2 align-baseline">
        <h2>View properties & listings</h2>
        <Button
          variant="danger"
          onClick={async () => {
            await clearPropAndListings(db);
            await loadProperties();
            await loadListings();
          }}
          className=""
        >
          Clear Properties and Listings
        </Button>
      </div>

      <table className="min-w-full divide-y divide-gray-300 text-medium">
        <thead className="bg-gray-100 text-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
