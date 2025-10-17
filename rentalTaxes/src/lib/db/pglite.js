import { PGlite } from "@electric-sql/pglite";

let db = null;
export async function getDB() {
  if (!db) {
    db = new PGlite("idb://my-rentalTaxesDB");

    // Initialize schema if needed
    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        date TEXT,
        bookingDate TEXT,
        arrivalDate TEXT,
        startDate TEXT,
        endDate TEXT,
        type TEXT,
        confirmationCode TEXT,
        guest TEXT,
        listing TEXT,
        details TEXT,
        nights INTEGER,
        shortTerm TEXT,
        amount REAL,
        paidOut REAL,
        grossEarnings REAL,
        earningsYear INTEGER,
        serviceFee REAL,
        fastPayFee REAL,
        cleaningFee REAL,
        totalOccupancyTaxes REAL,
        countyTax REAL,
        stateTax REAL
      );
    `);
  }
  return db;
}
