import {
  pgTable,
  serial,
  varchar,
  real,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// export const reservations = pgTable("reservations", {
//   id: serial("id").primaryKey(),
//   confirmationCode: varchar("confirmation_code"),
//   type: varchar("type"),
//   guest: varchar("guest"),
//   listing: varchar("listing"),
//   amount: real("amount"),
//   serviceFee: real("service_fee"),
//   cleaningFee: real("cleaning_fee"),
//   totalOccupancyTaxes: real("total_occupancy_taxes"),
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
//   totalAmount: real("total_amount"),
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
  amount: real("amount"),
  paidOut: real("paid_out"),
  serviceFee: real("service_fee"),
  fastPayFee: real("fast_pay_fee"),
  cleaningFee: real("cleaning_fee"),
  grossEarnings: real("gross_earnings"),
  totalOccupancyTaxes: real("total_occupancy_taxes"),
  earningsYear: integer("earnings_year"),
  countyTax: real("county_tax"),
  stateTax: real("state_tax"),
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
//   qIncome: real("q_income"),
//   qCleaningExternal: real("q_cleaning_external"),
//   qCleaningInternal: real("q_cleaning_internal"),
//   qRefund: real("q_refund"),
//   qReimburse: real("q_reimburse"),
//   qStateTaxes: real("q_state_taxes"),
//   qCountyTaxes: real("q_county_taxes"),
//   qServiceFees: real("q_service_fees"),
//   qFastPayFees: real("q_fast_pay_fees"),
//   qNetIncome: real("q_net_income"),
// });

// // ----------------------
// // Yearly Table
// // ----------------------
// export const yearly = pgTable("yearly", {
//   id: serial("id").primaryKey(),
//   yearlyIncome: real("yearly_income"),
//   yearlyCleaningExternal: real("yearly_cleaning_external"),
//   yearlyCleaningInternal: real("yearly_cleaning_internal"),
//   yearlyTaxes: real("yearly_taxes"),
//   yearlyServiceFees: real("yearly_service_fees"),
//   yearlyFastPayFees: real("yearly_fast_pay_fees"),
//   yearlyNetIncome: real("yearly_net_income"),
//   yearNetIncome: real("year_net_income"),
// });
