import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import type { Selection } from "@heroui/react";
import { Button, ButtonGroup, Dropdown, Header, Label } from "@heroui/react";
import { Db, Transaction } from "@/types";
import { useState, useMemo } from "react";
import { clearTransactions } from "@/lib/db/queries";
import { useDb, localDateFromYMD } from "@/lib/db/dbContext";

export default function TransactionsTable({
  data,
  db,
}: {
  data: Transaction[];
  db: Db;
}) {
  const { loadTransactions, listingsData, propertiesData } = useDb();

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 31, //default page size
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobaFilter] = useState([]);
  const [tableDateFrom, setTableDateFrom] = useState("");
  const [tableDateTo, setTableDateTo] = useState("");
  const [selectedListingIDs, setSelectedListingIDs] = useState<Set<string>>(
    new Set(),
  );
  const [selectedPropertyIDs, setSelectedPropertyIDs] = useState<Set<string>>(
    new Set(),
  );

  const selectedListingID = useMemo(() => {
    const array = [...selectedListingIDs];
    const first = array[0];
    return first;
  }, [selectedListingIDs]);

  console.log("selectedListingID:", selectedListingID);
  const selectedListing = useMemo(() => {
    if (!selectedListingID) return undefined;
    const listing = listingsData.find(
      (listing) => listing.listingId === selectedListingID,
    );
    if (!listing) throw new Error("Listing not found");
    return listing;
  }, [selectedListingID]);

  console.log("selected listing:", selectedListingIDs);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const rowDate = localDateFromYMD(row.date);
      const from = tableDateFrom ? localDateFromYMD(tableDateFrom) : null;
      const to = tableDateTo ? localDateFromYMD(tableDateTo) : null;
      if (from && rowDate < from) return false;
      if (to && rowDate > to) return false;

      if (selectedListingID && selectedListingID !== row.listingId)
        return false; //To Do: selected listing should also updated selected property
      if (
        selectedPropertyIDs.size > 0 &&
        row.propertyId !== Array.from(selectedPropertyIDs)[0]
      )
        return false;

      return true;
    });
  }, [
    data,
    tableDateFrom,
    tableDateTo,
    selectedListingID,
    selectedPropertyIDs,
  ]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: "Date",
      enableSorting: true,
      enableResizing: true,
      size: 50,
      cell: ({ row }) => {
        const date = localDateFromYMD(row.original.date);
        return date.toLocaleDateString("en-US");
      },
    },
    { accessorKey: "type", header: "Type", enableResizing: true },
    {
      accessorKey: "confirmationCode",
      header: "Confirmation Code",
      enableResizing: true,
    },
    // {
    //   accessorKey: "bookingDate",
    //   header: "Booking Date",
    //   cell: ({ row }) => {
    //     const bookingDate = row.original.bookingDate
    //       ? localDateFromYMD(row.original.bookingDate)
    //       : null;
    //     return bookingDate?.toLocaleDateString("en-US");
    //   },
    // },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const startDate = row.original.startDate
          ? localDateFromYMD(row.original.startDate)
          : null;
        return startDate?.toLocaleDateString("en-US");
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const endDate = row.original.endDate
          ? localDateFromYMD(row.original.endDate)
          : null;
        return endDate?.toLocaleDateString("en-US");
      },
    },
    { accessorKey: "nights", header: "Nights" },
    {
      accessorKey: "shortTerm",
      header: "Short Term",
      enableResizing: true,
      cell: ({ row }) => {
        const symbol = row.original.shortTerm ? "✅" : "✖️";
        return symbol;
      },
    },
    // { accessorKey: "guest", header: "Guest" },
    {
      accessorKey: "listingName",
      header: "Listing",
      size: 75,
      enableSorting: true,
      enableResizing: true,
    },
    // { accessorKey: "listingId", header: "Listing ID" },
    // { accessorKey: "details", header: "Details" },
    {
      accessorKey: "amount",
      header: "Net Earnings",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
      enableResizing: true,
    },

    {
      accessorKey: "grossEarnings",
      header: "Gross Earnings",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
    },
    {
      accessorKey: "totalOccupancyTaxes",
      header: "Taxes Remitted",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
      enableSorting: true,
      enableResizing: true,
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    defaultColumn: {
      size: 75, // Default size for columns without explicit size
      minSize: 50,
      maxSize: 300, // Increased maxSize to allow more expansion
    },
    columnResizeMode: "onChange", // Ensure this is set
  });

  return (
    <div>
      <div className="mt-4 p-2">
        <h2 className="ps-2 pb-0 ">View Transactions</h2>
        <div className="flex sm:flex-row justify-between w-full mb-2 align-baseline">
          <div className="flex items-baseline gap-2">
            <span className="whitespace-nowrap">Filter by</span>

            <Dropdown>
              <Button aria-label="Menu" variant="secondary">
                {selectedListing?.listingName || "All Listings"}
              </Button>

              <Dropdown.Popover>
                <Dropdown.Menu
                  selectedKeys={selectedListingIDs}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    console.log("keys:", keys);
                    const array = [...keys];
                    const first = array[0];
                    if (first === "all") setSelectedListingIDs(new Set());
                    else setSelectedListingIDs(keys as Set<string>);
                    setSelectedPropertyIDs(new Set());
                  }}
                >
                  <Dropdown.Item key="" id="all">
                    All listings
                  </Dropdown.Item>
                  {listingsData.map((l) => (
                    <Dropdown.Item
                      key={l.listingId}
                      id={l.listingId}
                      textValue={l.listingName}
                    >
                      <Label> {l.listingName}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>

            {/* <select
              value={selectedProperty}
              onChange={(e) => {
                setSelectedProperty(e.target.value);
                setSelectedListing("");
              }}
              className="bg-gray-100"
            >
              <option value="">All properties</option>
              {propertiesData.map((p) => (
                <option key={p.propertyId} value={p.propertyId}>
                  {p.propertyName}
                </option>
              ))}
            </select> */}
          </div>
          <Button
            onClick={() => {
              clearTransactions(db);
              loadTransactions();
            }}
            className="button-bold-danger"
          >
            Clear Transactions
          </Button>
        </div>

        <table className="min-w-full divide-y divide-gray-300 text-sm overflow-x-scroll">
          <thead className="bg-gray-100 text-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-1.5 cursor-pointer select-none relative"
                    style={{ width: header.getSize() }} // Apply dynamic widthclassName="px-1.5"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getCanSort() &&
                      (header.column.getIsSorted()
                        ? {
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as "asc" | "desc"]
                        : " ⇅")}
                    {header.column.getCanResize() && ( // Add resize handle only if resizable
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none hover:bg-gray-500"
                      />
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
                    className={`p-2 text-gray-800 ${
                      cell.column.id === "listingName" && "w-75"
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
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <div className="h-4" />
        {data.length === 0 && <p className="ps-2">No transactions to show</p>}
        {data.length > 0 && (
          <div className="flex flex-row items-center gap-8">
            <ButtonGroup variant="tertiary">
              <Button
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >{`< Previous`}</Button>
              <span className="flex items-center gap-1 mx-2">
                <div className="">Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1}{" "}
                </strong> of{" "}
                <strong>{table.getPageCount().toLocaleString()}</strong>
              </span>
              <Button
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >{`Next >`}</Button>
            </ButtonGroup>
          </div>
        )}
      </div>
    </div>
  );
}
