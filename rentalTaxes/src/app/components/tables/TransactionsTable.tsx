import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { sampleTransactions } from "@/lib/db/sampleData";
import { Transaction } from "@/types";

export default function TransactionsTable({ data }: { data: Transaction[] }) {
  //   const data: Transaction[] = sampleTransactions;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleDateString();
      },
    },
    // { accessorKey: "arrivalDate", header: "Arrival Date" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "confirmationCode", header: "Confirmation Code" },
    { accessorKey: "bookingDate", header: "Booking Date" },
    { accessorKey: "startDate", header: "Start Date" },
    { accessorKey: "endDate", header: "End Date" },
    { accessorKey: "nights", header: "Nights" },
    {
      accessorKey: "shortTerm",
      header: "Short Term",
      cell: ({ row }) => {
        const symbol = row.original.shortTerm ? "✅" : "❌";
        return symbol;
      },
    },
    // { accessorKey: "guest", header: "Guest" },
    { accessorKey: "listingName", header: "Listing" },
    // { accessorKey: "listingId", header: "Listing ID" },
    // { accessorKey: "details", header: "Details" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
    },
    {
      accessorKey: "paidOut",
      header: "Paid Out",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
    },
    // { accessorKey: "serviceFee", header: "Service Fee" },
    // { accessorKey: "fastPayFee", header: "Fast Pay Fee" },
    {
      accessorKey: "cleaningFee",
      header: "Cleaning Fee",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
    },
    {
      accessorKey: "grossEarnings",
      header: "Gross Earnings",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
    },
    {
      accessorKey: "totalOccupancyTaxes",
      header: "Total Occupancy Taxes",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
    },
    {
      accessorKey: "quarter",
      header: "Quarter",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const quarter = Math.ceil(month / 3);
        return `Q${quarter}-${year}`;
      },
    },
    // { accessorKey: "earningsYear", header: "Earnings Year" },
    // {
    //   accessorKey: "countyTax",
    //   header: "County Tax",
    //   cell: ({ getValue }) => formatCurrency(getValue() as number),
    //   enableSorting: true,
    // },
    // {
    //   accessorKey: "stateTax",
    //   header: "State Tax",
    //   cell: ({ getValue }) => formatCurrency(getValue() as number),
    //   enableSorting: true,
    // },
    { accessorKey: "sourceFile", header: "Source File" },
    { accessorKey: "uploadedAt", header: "Uploaded At" },
  ];

  const table = useReactTable<Transaction>({
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
                <td key={cell.id} className="px-4 py-2 text-gray-800">
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
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      {/* <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button> */}
    </div>
  );
}
