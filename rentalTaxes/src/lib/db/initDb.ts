//TODO: CHECK AND EDIT THIS ONCE SCHEMA IS COMPLETE
//TODO: enums for the "type" property (e.g reservation, refund)
import { getDb } from "./client";

import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { transactions } from "./schema";

const client = new PGlite({
  dataDir: "./data", // or ":memory:" if testing only
});

export const db = drizzle(client, { schema: { transactions } });

// Initialize the table if it doesn't exist
export async function initDb() {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      date VARCHAR(50),
      arrival_date VARCHAR(50),
      type VARCHAR(50),
      confirmation_code VARCHAR(50),
      booking_date VARCHAR(50),
      start_date VARCHAR(50),
      end_date VARCHAR(50),
      nights INTEGER,
      guest VARCHAR(255),
      listing VARCHAR(255),
      details TEXT,
      amount NUMERIC,
      paid_out NUMERIC,
      service_fee NUMERIC,
      fast_pay_fee NUMERIC,
      cleaning_fee NUMERIC,
      gross_earnings NUMERIC,
      total_occupancy_taxes NUMERIC,
      earnings_year INTEGER,
      county_tax NUMERIC,
      state_tax NUMERIC
    );
  `);
  console.log("✅ transactions table ready");
}
