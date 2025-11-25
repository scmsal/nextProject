import { PgliteDatabase } from "drizzle-orm/pglite";
import { listings, properties, transactions } from "./lib/db/schema";
import * as schema from "./lib/db/schema";
export type Transaction = typeof transactions.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type TableType = typeof properties | typeof listings;

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
