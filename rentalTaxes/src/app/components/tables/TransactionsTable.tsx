import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, ButtonGroup } from "@heroui/react";
import { sampleTransactions } from "@/lib/db/sampleData";
import { Db, Transaction } from "@/types";
import { useState, useMemo } from "react";
import { clearTransactions } from "@/lib/db/queries";
import { useDb } from "@/lib/db/dbContext";

export default function TransactionsTable({
  data,
  db,
}: {
  data: Transaction[];
  db: Db;
}) {
  const { loadTransactions } = useDb();

  const filteredData = useMemo(
    () => data.filter((row) => row.type !== "Payout"),
    [data]
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

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
    // {
    //   accessorKey: "bookingDate",
    //   header: "Booking Date",
    //   cell: ({ row }) => {
    //     const bookingDate = row.original.bookingDate
    //       ? new Date(row.original.bookingDate)
    //       : null;
    //     return bookingDate?.toLocaleDateString();
    //   },
    // },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const startDate = row.original.startDate
          ? new Date(row.original.startDate)
          : null;
        return startDate?.toLocaleDateString();
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const endDate = row.original.endDate
          ? new Date(row.original.endDate)
          : null;
        return endDate?.toLocaleDateString();
      },
    },
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
    // {
    //   accessorKey: "paidOut",
    //   header: "Paid Out",
    //   cell: ({ getValue }) => formatCurrency(getValue() as number),
    //   enableSorting: true,
    // },
    // { accessorKey: "serviceFee", header: "Service Fee" },
    // { accessorKey: "fastPayFee", header: "Fast Pay Fee" },
    // {
    //   accessorKey: "cleaningFee",
    //   header: "Cleaning Fee",
    //   cell: ({ getValue }) => formatCurrency(getValue() as number),
    //   enableSorting: true,
    // },
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
    // {
    //   accessorKey: "quarter",
    //   header: "Quarter",
    //   cell: ({ row }) => {
    //     const date = new Date(row.original.date);
    //     const month = date.getMonth() + 1;
    //     const year = date.getFullYear();
    //     const quarter = Math.ceil(month / 3);
    //     return `Q${quarter}-${year}`;
    //   },
    // },
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
    // // },
    // { accessorKey: "sourceFile", header: "Source File" },
    // { accessorKey: "uploadedAt", header: "Uploaded At" },
  ];

  const table = useReactTable<Transaction>({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      //...
      pagination,
    },
  });

  return (
    <div>
      <div className="p-2">
        <Button
          variant="danger"
          onClick={() => {
            clearTransactions(db);
            loadTransactions();
          }}
        >
          Delete Transactions
        </Button>
        <table className="min-w-full divide-y divide-gray-300 text-sm overflow-x-scroll">
          <thead className="bg-gray-100 text-foreground">
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

        <div className="flex flex-row justify-center gap-8">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1}{" "}
            </strong> of{" "}
            <strong>{table.getPageCount().toLocaleString()}</strong>
          </span>
          <ButtonGroup variant="tertiary">
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >{`< Previous`}</Button>
            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >{`Next >`}</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
