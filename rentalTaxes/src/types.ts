import { PgliteDatabase } from "drizzle-orm/pglite";
import {
  listingsDbTable,
  propertiesDbTable,
  transactionsDbTable,
} from "./lib/db/schema";
import { FormEvent } from "react";
import * as schema from "./lib/db/schema";
import TransactionsTable from "./app/components/tables/TransactionsTable";
export type Transaction = typeof transactionsDbTable.$inferSelect;
export type Property = typeof propertiesDbTable.$inferSelect;
export type Listing = typeof listingsDbTable.$inferSelect;
export type TableType = typeof propertiesDbTable | typeof listingsDbTable;
export type TransactionInsert = typeof transactionsDbTable.$inferInsert; //NOTE: CURRENTLY SAME AS PROPERTY TYPE
export type PropertyInsert = typeof propertiesDbTable.$inferInsert;
export type ListingInsert = typeof listingsDbTable.$inferInsert;

export type PropertyTransaction = {
  date: string | null;
  type: string | null;
  nights: number | null;
  gross: number | null;
  amount: number | null;
  listing: string | null;
};

//Phase 1 will only handle Airbnb data.
//Later phases will integrate other platforms. That will involve distinguishing between physical units (platform agnostic) and listings (platform specific).
export type RevenueAggregate = {
  propertyName: string;
  netRevenue: number;
  shortTermRevenue: number;
  longTermRevenue: number;
  shortTermStays: number;
  longTermStays: number;
  excludedTransactions: PropertyTransaction[];
  inclTransactions: PropertyTransaction[];
  totalGross: number;
  shortTermGross: number;
  longTermGross: number;
  transactions: number;
};

export type PropertyListing = {
  propertyName: string;
  propertyId: string;
  address: string;
  town: string;
  county: string;
  listings: Listing[];

  // listings: [{ listingKey: string; listingName: string }];
};

export type Db = PgliteDatabase<typeof schema>;
