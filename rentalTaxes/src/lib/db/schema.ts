import {
  pgTable,
  serial,
  date,
  varchar,
  numeric,
  integer,
  text,
  timestamp,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ----------------------
// Transactions Table
// ----------------------
export const transactionsDbTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  arrivalDate: varchar("arrival_date", { length: 50 }),
  type: varchar("type", { length: 50 }).$type<string | null>().default(null), // e.g. payout, reimbursement, refund
  confirmationCode: varchar("confirmation_code", { length: 50 })
    .$type<string | null>()
    .default(null),
  bookingDate: varchar("booking_date", { length: 50 }),
  startDate: varchar("start_date", { length: 50 }),
  endDate: varchar("end_date", { length: 50 }),
  nights: integer("nights").$type<number | null>().default(null),
  shortTerm: boolean("short_term"),
  guest: varchar("guest", { length: 100 }).$type<string | null>().default(null),
  listingName: varchar("listing_name", { length: 100 })
    .$type<string | null>()
    .default(null),
  listingId: varchar("listing_id", { length: 50 })
    // .notNull()
    .references(() => listingsDbTable.listingId),
  propertyId: varchar("property_id", { length: 50 })
    .$type<string | null>()
    .default(null),
  details: varchar("details", { length: 255 })
    .$type<string | null>()
    .default(null),
  amount: numeric("amount").$type<number>().default(0),
  paidOut: numeric("paid_out").$type<number | null>().default(null),
  serviceFee: numeric("service_fee").$type<number | null>().default(null),
  fastPayFee: numeric("fast_pay_fee").$type<number | null>().default(null),
  cleaningFee: numeric("cleaning_fee").$type<number | null>().default(null),
  grossEarnings: numeric("gross_earnings").$type<number | null>().default(null),
  totalOccupancyTaxes: numeric("total_occupancy_taxes")
    .$type<number | null>()
    .default(null),
  earningsYear: integer("earnings_year").$type<number | null>().default(null),
  countyTax: numeric("county_tax").$type<number | null>().default(null),
  stateTax: numeric("state_tax").$type<number | null>().default(null),
  //TO DO: move to a metadata table instead?
  sourceFile: text("source_file").$type<string | null>().default(null),
  uploadedAt: timestamp("uploaded_at", { mode: "date" }).notNull(),
});

// ----------------------
// Properties Table
// ----------------------
export const propertiesDbTable = pgTable(
  "properties",
  {
    propertyName: varchar("property_name", { length: 255 }).notNull(),
    propertyId: varchar("property_id", { length: 50 }).primaryKey(),
    address: varchar("address", { length: 255 }),
    town: varchar("town", { length: 100 }),
    county: varchar("county", { length: 100 }),
  },
  //PGlite doesn't fully enforce unique constraints, so this would only work in the full PostgreSQL
  (table) => [
    uniqueIndex("unique_property_name").on(table.propertyName),
    uniqueIndex("unique_address").on(table.address),
  ]
);

// ----------------------
// Listings Table
// ----------------------
export const listingsDbTable = pgTable(
  "listings",
  {
    listingId: varchar("listing_id", { length: 50 }).primaryKey(),
    listingName: varchar("listing_name", { length: 255 }).notNull(),
    propertyId: varchar("property_id", { length: 50 })
      .notNull()
      .references(() => propertiesDbTable.propertyId),
    // platform: varchar("platform", { length: 100 }),
  },
  //PGlite doesn't fully enforce unique constraints, so this would only work in the full PostgreSQL
  (table) => [uniqueIndex("unique_listing_name").on(table.listingName)]
);

/*

- Allowable **deductions** (Federal government employees and 30+ day rentals)
    - i.e. total long term earnings
- **Taxable receipts (ie. net short term earnings)**
- (automatically calculated, Suffolk County tax for hotel and motel occupancy is 5.5%) KEEP UPDATED

*/

export const transactionsRelations = relations(
  transactionsDbTable,
  ({ one }) => ({
    listing: one(listingsDbTable, {
      fields: [transactionsDbTable.listingId],
      references: [listingsDbTable.listingId],
    }),
    property: one(propertiesDbTable, {
      fields: [transactionsDbTable.propertyId],
      references: [propertiesDbTable.propertyId],
    }),
  })
);

export const propertiesRelations = relations(propertiesDbTable, ({ many }) => ({
  listings: many(listingsDbTable),
  transactions: many(transactionsDbTable),
}));

export const listingsRelations = relations(
  listingsDbTable,
  ({ one, many }) => ({
    property: one(propertiesDbTable, {
      fields: [listingsDbTable.propertyId],
      references: [propertiesDbTable.propertyId],
    }),
    transactions: many(transactionsDbTable),
  })
);
