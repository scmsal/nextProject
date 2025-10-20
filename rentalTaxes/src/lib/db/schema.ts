import {
  pgTable,
  serial,
  varchar,
  numeric,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// export const reservations = pgTable("reservations", {
//   id: serial("id").primaryKey(),
//   confirmationCode: varchar("confirmation_code"),
//   type: varchar("type"),
//   guest: varchar("guest"),
//   listing: varchar("listing"),
//   amount: numeric("amount"),
//   serviceFee: numeric("service_fee"),
//   cleaningFee: numeric("cleaning_fee"),
//   totalOccupancyTaxes: numeric("total_occupancy_taxes"),
//   startDate: varchar("start_date"),
//   endDate: varchar("end_date"),
//   nights: integer("nights"),
//   bookingDate: varchar("booking_date"),
//   arrivalDate: varchar("arrival_date"),
// });

// export const payouts = pgTable("payouts", {
//   id: serial("id").primaryKey(),
//   referenceCode: varchar("reference_code"),
//   date: varchar("date"),
//   totalAmount: numeric("total_amount"),
//   details: varchar("details"),
//   relatedReservations: varchar("related_reservations"), // could be a CSV string of confirmation codes
//   type: varchar("type"), // e.g. payout, reimbursement, refund
// });

// ----------------------
// Transactions Table
// ----------------------
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 50 }),
  arrivalDate: varchar("arrival_date", { length: 50 }),
  type: varchar("type", { length: 50 }), // e.g. payout, reimbursement, refund
  confirmationCode: varchar("confirmation_code", { length: 50 }),
  bookingDate: varchar("booking_date", { length: 50 }),
  startDate: varchar("start_date", { length: 50 }),
  endDate: varchar("end_date", { length: 50 }),
  nights: integer("nights"),
  shortTerm: boolean("short_term"),
  guest: varchar("guest", { length: 100 }),
  listing: varchar("listing", { length: 100 }),
  details: varchar("details", { length: 255 }),
  amount: numeric("amount"),
  paidOut: numeric("paid_out"),
  serviceFee: numeric("service_fee"),
  fastPayFee: numeric("fast_pay_fee"),
  cleaningFee: numeric("cleaning_fee"),
  grossEarnings: numeric("gross_earnings"),
  totalOccupancyTaxes: numeric("total_occupancy_taxes"),
  earningsYear: varchar("earnings_year", { length: 10 }),
  countyTax: numeric("county_tax"),
  stateTax: numeric("state_tax"),
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
