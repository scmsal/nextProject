import { listings, properties, transactions } from "./lib/db/schema";

export type Transaction = typeof transactions.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type PropertySummary = {
  propertyName: string;
  totalRevenue: number;
  listingCount: number;
};
