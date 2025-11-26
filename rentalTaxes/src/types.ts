import { PgliteDatabase } from "drizzle-orm/pglite";
import {
  listingsTable,
  propertiesTable,
  transactionsTable,
} from "./lib/db/schema";
import * as schema from "./lib/db/schema";
import TransactionsTable from "./app/components/tables/TransactionsTable";
export type Transaction = typeof transactionsTable.$inferSelect;
export type Property = typeof propertiesTable.$inferSelect;
export type Listing = typeof listingsTable.$inferSelect;
export type TableType = typeof propertiesTable | typeof listingsTable;
export type TransactionInsert = typeof transactionsTable.$inferInsert; //NOTE: CURRENTLY SAME AS PROPERTY TYPE
export type PropertyInsert = typeof propertiesTable.$inferInsert;
export type ListingInsert = typeof listingsTable.$inferInsert;

//Phase 1 will only handle Airbnb data.
//Later phases will integrate other platforms. That will involve distinguishing between physical units (platform agnostic) and listings (platform specific).
export type RevenueAggregate = {
  propertyName: string;
  totalRevenue: number;
  shortTermRevenue: number;
  longTermRevenue: number;
  shortTermStays: number;
  longTermStays: number;
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
