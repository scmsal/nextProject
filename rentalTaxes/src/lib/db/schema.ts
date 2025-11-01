import {
  pgTable,
  serial,
  varchar,
  numeric,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ----------------------
// Transactions Table
// ----------------------
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 50 }).notNull(),
  arrivalDate: varchar("arrival_date", { length: 50 })
    .$type<string | null>()
    .default(null),
  type: varchar("type", { length: 50 }).$type<string | null>().default(null), // e.g. payout, reimbursement, refund
  confirmationCode: varchar("confirmation_code", { length: 50 })
    .$type<string | null>()
    .default(null),
  bookingDate: varchar("booking_date", { length: 50 })
    .$type<string | null>()
    .default(null),
  startDate: varchar("start_date", { length: 50 })
    .$type<string | null>()
    .default(null),
  endDate: varchar("end_date", { length: 50 })
    .$type<string | null>()
    .default(null),
  nights: integer("nights").$type<number | null>().default(null),
  shortTerm: varchar("short_term").default(""),
  guest: varchar("guest", { length: 100 }).$type<string | null>().default(null),
  // listing: varchar("listing", { length: 100 })
  //   .$type<string | null>()
  //   .default(null),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  details: varchar("details", { length: 255 })
    .$type<string | null>()
    .default(null),
  amount: numeric("amount").$type<number | null>().default(null),
  paidOut: numeric("paid_out").$type<number | null>().default(null),
  serviceFee: numeric("service_fee").$type<number | null>().default(null),
  fastPayFee: numeric("fast_pay_fee").$type<number | null>().default(null),
  cleaningFee: numeric("cleaning_fee").$type<number | null>().default(null),
  grossEarnings: numeric("gross_earnings").$type<number | null>().default(null),
  totalOccupancyTaxes: numeric("total_occupancy_taxes")
    .$type<number | null>()
    .default(null),
  quarter: varchar("quarter", { length: 10 }).notNull(),
  earningsYear: integer("earnings_year").$type<number | null>().default(null),
  countyTax: numeric("county_tax").$type<number | null>().default(null),
  stateTax: numeric("state_tax").$type<number | null>().default(null),
  sourceFile: text("source_file").$type<string | null>().default(null),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// ----------------------
// Properties Table
// ----------------------
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 255 }),
  town: varchar("town", { length: 100 }),
  // listings: jsonb("listings").$type<string[]>(), <---- remove this property
});

// ----------------------
// Properties Table
// ----------------------
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  propertyId: integer("property_id").references(() => properties.id),
});

// ----------------------
// Quarterly Table
// ----------------------
// export const quarterly = pgTable("quarterly", {
//   id: serial("id").primaryKey(),
//   monthYear: varchar("month_year", { length: 20 }),
//   qIncome: numeric("q_income"),
//   qCleaningExternal: numeric("q_cleaning_external"),
//   qCleaningInternal: numeric("q_cleaning_internal"),
//   qRefund: numeric("q_refund"),
//   qReimburse: numeric("q_reimburse"),
//   qStateTaxes: numeric("q_state_taxes"),
//   qCountyTaxes: numeric("q_county_taxes"),
//   qServiceFees: numeric("q_service_fees"),
//   qFastPayFees: numeric("q_fast_pay_fees"),
//   qNetIncome: numeric("q_net_income"),
// });

export const quarterlyFile = pgTable("quarterlyFile", {
  id: serial("id").primaryKey(),
  monthYear: varchar("month_year", { length: 20 }),
  totalRevenue: numeric("total_revenue"), //**Total revenue** (long term and short term) including all fees (all reservations earnings minus refunds, reimbursements, optionally minus cleaning)
  qCleaningExternal: numeric("q_cleaning_external"),
  qCleaningInternal: numeric("q_cleaning_internal"),
  qRefund: numeric("q_refund"),
  qReimburse: numeric("q_reimburse"),
  total30Plus: numeric("q_30_plus_revenue"), //total long term earnings (deductible),
  totalShortTerm: numeric("q_short_term_revenue"), //total revenue minus total30Plus
});

/*

- Allowable **deductions** (Federal government employees and 30+ day rentals)
    - i.e. total long term earnings
- **Taxable receipts (ie. net short term earnings)**
- (automatically calculated, Suffolk County tax for hotel and motel occupancy is 5.5%) KEEP UPDATED

*/
// // ----------------------
// // Yearly Table
// // ----------------------
// export const yearly = pgTable("yearly", {
//   id: serial("id").primaryKey(),
//   yearlyIncome: numeric("yearly_income"),
//   yearlyCleaningExternal: numeric("yearly_cleaning_external"),
//   yearlyCleaningInternal: numeric("yearly_cleaning_internal"),
//   yearlyTaxes: numeric("yearly_taxes"),
//   yearlyServiceFees: numeric("yearly_service_fees"),
//   yearlyFastPayFees: numeric("yearly_fast_pay_fees"),
//   yearlyNetIncome: numeric("yearly_net_income"),
//   yearNetIncome: numeric("year_net_income"),
// })

/*
This means:
"Each transaction is connected to one listing
where the transaction's listingId
corresponds to the listing's id"

Example data:
Transactions
| id | date       | arrivalDate | type   | listingId | ... |
| 1  | 2024-01-01 | 2024-01-05  | payout | *1*         | ... |
| 2  | 2024-01-10 | 2024-01-15  | payout | *1*         | ... |
| 3  | 2024-02-01 | 2024-02-05  | payout | *2*         | ... |

Listings
| id   | name           | propertyId |
| *1*  | "Cozy Cottage" | 1          |
| *2*  | "Beach House"  | 2          |

This allows you to use drizzle's query syntax (https://orm.drizzle.team/docs/rqb)
which is better than the select syntax
*/
export const transactionsRelations = relations(transactions, ({ one }) => ({
  listing: one(listings, {
    fields: [transactions.listingId],
    references: [listings.id],
  }),
}));

export const propertiesRelations = relations(properties, ({ many }) => ({
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  property: one(properties, {
    fields: [listings.propertyId],
    references: [properties.id],
  }),
  transactions: many(transactions)
}));