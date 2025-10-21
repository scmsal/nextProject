//TODO: CHECK AND EDIT THIS ONCE SCHEMA IS COMPLETE
import { getDb } from "./client";
import { transactions, properties } from "./schema";

/**
 * Initializes the PGlite database with required tables.
 * This runs once when the app first loads.
 */
export async function initDb() {
  const db = getDb();

  console.log("Initializing database...");

  // This isn't strictly required with Drizzle + pglite (since schema is implicit), but you can use it to run initial data or structure checks
  // await db
  //   .select()
  //   .from(reservations)
  //   .limit(1)
  //   .catch(() => {
  //     console.log("Initializing new DB...");
  //   });

  return db;
}
//Note: Drizzle + PGlite automatically maps tables to memory (or IndexedDB). You don’t “migrate” in the traditional sense here — initDb just ensures everything’s ready for queries.
