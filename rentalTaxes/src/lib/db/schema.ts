import {
  pgTable,
  serial,
  varchar,
  numeric,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";

// ----------------------
// Transactions Table
// ----------------------
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 50 }),
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
  listing: varchar("listing", { length: 100 })
    .$type<string | null>()
    .default(null),
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
  earningsYear: integer("earnings_year").$type<number | null>().default(null),
  countyTax: numeric("county_tax").$type<number | null>().default(null),
  stateTax: numeric("state_tax").$type<number | null>().default(null),
});

// ----------------------
// Properties Table
// ----------------------
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 255 }),
  town: varchar("town", { length: 100 }),
  listingId: varchar("listing_id", { length: 100 }),
  listingNames: varchar("listing_names", { length: 255 }),
});

// // ----------------------
// // Quarterly Table
// // ----------------------
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
// });
