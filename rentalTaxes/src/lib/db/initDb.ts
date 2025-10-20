import { getDb } from "./client";
import { transactions, properties } from "./schema";

/**
 * Initializes the PGlite database with required tables.
 * This runs once when the app first loads.
 */
export async function initDb() {
  const db = getDb();

  console.log("Initializing database...");

  // Check if tables already exist
  const existingTables = await client.query(`
    SELECT name 
    FROM sqlite_master 
    WHERE type='table';
  `);

  // If PGlite has no tables yet, create them
  if (existingTables.rows.length === 0) {
    console.log("Creating tables...");

    await client.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        date TEXT,
        arrival_date TEXT,
        type TEXT,
        confirmation_code TEXT,
        booking_date TEXT,
        start_date TEXT,
        end_date TEXT,
        nights INTEGER,
        short_term TEXT,
        guest TEXT,
        listing TEXT,
        details TEXT,
        amount NUMERIC,
        paid_out NUMERIC,
        service_fee NUMERIC,
        fast_pay_fee NUMERIC,
        cleaning_fee NUMERIC,
        gross_earnings NUMERIC,
        total_occupancy_taxes NUMERIC,
        earnings_year TEXT,
        county_tax NUMERIC,
        state_tax NUMERIC
      );

      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        address TEXT,
        town TEXT,
        listing_id TEXT,
        listing_names TEXT
      );

      CREATE TABLE IF NOT EXISTS quarterly (
        id SERIAL PRIMARY KEY,
        month_year TEXT,
        q_income NUMERIC,
        q_cleaning_external NUMERIC,
        q_cleaning_internal NUMERIC,
        q_refund NUMERIC,
        q_reimburse NUMERIC,
        q_state_taxes NUMERIC,
        q_county_taxes NUMERIC,
        q_service_fees NUMERIC,
        q_fast_pay_fees NUMERIC,
        q_net_income NUMERIC
      );

      CREATE TABLE IF NOT EXISTS yearly (
        id SERIAL PRIMARY KEY,
        yearly_income NUMERIC,
        yearly_cleaning_external NUMERIC,
        yearly_cleaning_internal NUMERIC,
        yearly_taxes NUMERIC,
        yearly_service_fees NUMERIC,
        yearly_fast_pay_fees NUMERIC,
        yearly_net_income NUMERIC,
        year_net_income NUMERIC
      );
    `);

    console.log("Tables created successfully.");
  } else {
    console.log("Tables already exist — skipping initialization.");
  }
}
