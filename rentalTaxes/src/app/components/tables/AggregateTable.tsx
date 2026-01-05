import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RevenueAggregate } from "@/types";
import { useMemo } from "react";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: "left" | "right";
  }
}
import { useDb } from "@/lib/db/dbContext";
import Papa from "papaparse";
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);

export default function RevenueAggregatesTable({
  data,
}: {
  data: RevenueAggregate[];
}) {
  //TO DO: see if it's ok to connect to context here or pass as props
  const { revenueAggregatesData } = useDb();
  const totalsRow = useMemo(() => {
    return {
      netRevenue: data.reduce((sum, r) => sum + r.netRevenue, 0),
      shortTermRevenue: data.reduce((sum, r) => sum + r.shortTermRevenue, 0),
      longTermRevenue: data.reduce((sum, r) => sum + r.longTermRevenue, 0),
      shortTermStays: data.reduce((sum, r) => sum + r.shortTermStays, 0),
      //TO DO: recalculate to only count unique confirmation codes
      longTermStays: data.reduce((sum, r) => sum + r.longTermStays, 0),
      totalGross: data.reduce((sum, r) => sum + r.totalGross, 0),
      longTermGross: data.reduce((sum, r) => sum + r.longTermGross, 0),
      shortTermGross: data.reduce((sum, r) => sum + r.shortTermGross, 0),
    };
  }, [data]);

  const columns: ColumnDef<RevenueAggregate>[] = [
    {
      accessorKey: "propertyName",
      header: "Property",
      footer: "Total",
      meta: { align: "left" },
    },
    {
      accessorKey: "totalGross",
      header: () => (
        <>
          Total Gross <sup>1</sup>
        </>
      ),
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      meta: { align: "right" },
      footer: () => formatCurrency(totalsRow.totalGross),
    },
    {
      accessorKey: "netRevenue",
      header: () => <>Total Net</>,
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      meta: { align: "right" },
      footer: () => formatCurrency(totalsRow.netRevenue),
    },
    {
      accessorKey: "shortTermGross",
      header: "ST Gross",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      meta: { align: "right" },
      footer: () => formatCurrency(totalsRow.shortTermGross),
    },
    {
      accessorKey: "shortTermRevenue",
      header: "ST Net",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      meta: { align: "right" },
      footer: () => formatCurrency(totalsRow.shortTermRevenue),
    },
    {
      accessorKey: "shortTermStays",
      header: "ST Stays",
      cell: ({ getValue }) => getValue() as number,
      meta: { align: "right" },
      footer: () => totalsRow.shortTermStays,
    },
    {
      accessorKey: "longTermGross",
      header: "LT Gross",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      meta: { align: "right" },
      footer: () => formatCurrency(totalsRow.longTermGross),
    },
    {
      accessorKey: "longTermRevenue",
      header: "LT Net",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      meta: { align: "right" },
      footer: () => formatCurrency(totalsRow.longTermRevenue),
    },
    {
      accessorKey: "longTermStays",
      header: "LT Stays",
      cell: ({ getValue }) => getValue() as number,
      meta: { align: "right" },
      footer: () => totalsRow.longTermStays,
    },
  ];

  const table = useReactTable<RevenueAggregate>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                <td
                  key={cell.id}
                  className={`px-4 py-2 text-gray-800 ${
                    cell.column.columnDef.meta?.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <td
                  key={header.id}
                  className={`px-4 py-2 font-bold ${
                    header.column.columnDef.meta?.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <p>
        <sup>1</sup>Total gross earnings including all reservations, fees,
        adjustments, and resolutions included in the CSV file data.
      </p>
      <div className="h-4" />
      {/* <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button> */}
      <button
        className="border p-2"
        onClick={() => {
          const csvData = revenueAggregatesData.map((item) => {
            const { excludedTransactions, inclTransactions, ...rest } = item;
            return rest;
          });
          const csv = Papa.unparse(csvData);
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "data.csv";
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(url);
        }}
      >
        Download data
      </button>
    </div>
  );
}
