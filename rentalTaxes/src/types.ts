import { listings, properties, transactions } from "./lib/db/schema";

export type Transaction = typeof transactions.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type TableType = typeof properties | typeof listings;

//Phase 1 will only handle Airbnb data.
//Later phases will integrate other platforms. That will involve distinguishing between physical units (platform agnostic) and listings (platform specific).
export type RevenueAggregates = {
  propertyName: string;
  totalRevenue: number;
  shortTermRevenue: number;
  longTermRevenue: number;
  shortTermStays: number;
  longTermStays: number;
};

export type PropertyListings = {
  propertyName: string;
  address: string;
  county: string;
  listingCount: number;
};
