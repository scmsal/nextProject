//database setup (Drizzle + pglite)

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

let client: PGlite | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!client) {
    client = new PGlite("idb://rentalTaxesDB");
    console.log("✅ PGlite client initialized");
  }
  if (!db) {
    db = drizzle(client, { schema });
    await ensureTables(client);
  }
  return db;
}

async function ensureTables(client: PGlite) {
  //Check if the transactions table exists
  const result = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_name='transactions';`
  );
  const exists = result.rows.length > 0;
  if (!exists) {
    console.log("Creating transactions table"); //TO-DO: UI notification too
    client!.exec(`
      CREATE TABLE transactions (
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
    console.log("✅ transactions table created");
  } else {
    console.log("✅ transactions table already exists");
  }
}

export async function testDb() {
  const client = await PGlite.create("idb://rentalTaxesDB");
  console.log("Testing connection...");
  try {
    const result = await client.query(`SELECT 1 + 1 AS two;`);
    console.log("✅ DB test succeeded:", result.rows);
  } catch (err) {
    console.error("❌ DB test failed:", err);
  }
}
