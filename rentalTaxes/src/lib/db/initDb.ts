//TODO: CHECK AND EDIT THIS ONCE SCHEMA IS COMPLETE
//TODO: enums for the "type" property (e.g reservation, refund)

import { PGlite } from "@electric-sql/pglite";

declare global {
  var __PGLITE_CLIENT__: import("@electric-sql/pglite").PGlite | undefined;
}

let client: PGlite | null = null;

export async function initDb() {
  if (typeof window === "undefined") {
    throw new Error("PGlite (idb://) must be initialized in the browser.");
  }

  if (globalThis.__PGLITE_CLIENT__) {
    return globalThis.__PGLITE_CLIENT__;
  }
  // Use PGlite.create to get a client instance and ensure the same IndexedDB storage name is reused

  if (client) return client;

  console.log("Initializing PGlite...");

  client = await PGlite.create("idb://rentalTaxesDB");

  await client.exec(`
     CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
        date VARCHAR(50),
        arrival_date VARCHAR(50),
        type VARCHAR(50),
        confirmation_code VARCHAR(50),
        booking_date VARCHAR(50),
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        short_term VARCHAR(50),
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

  globalThis.__PGLITE_CLIENT__ = client;

  return client;
}
