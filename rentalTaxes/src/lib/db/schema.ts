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
export const transactionsTable = pgTable("transactions", {
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
    .references(() => listingsTable.listingId),
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
export const propertiesTable = pgTable(
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
export const listingsTable = pgTable(
  "listings",
  {
    listingId: varchar("listing_id", { length: 50 }).primaryKey(),
    listingName: varchar("listing_name", { length: 255 }).notNull(),
    propertyId: varchar("property_id", { length: 50 })
      .notNull()
      .references(() => propertiesTable.propertyId),
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
  transactionsTable,
  ({ one }) => ({
    listing: one(listingsTable, {
      fields: [transactionsTable.listingId],
      references: [listingsTable.listingId],
    }),
    property: one(propertiesTable, {
      fields: [transactionsTable.propertyId],
      references: [propertiesTable.propertyId],
    }),
  })
);

export const propertiesRelations = relations(propertiesTable, ({ many }) => ({
  listings: many(listingsTable),
  transactions: many(transactionsTable),
}));

export const listingsRelations = relations(listingsTable, ({ one, many }) => ({
  property: one(propertiesTable, {
    fields: [listingsTable.propertyId],
    references: [propertiesTable.propertyId],
  }),
  transactions: many(transactionsTable),
}));
