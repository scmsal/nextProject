import type { PgliteDatabase } from "drizzle-orm/pglite";
import { transactions, properties } from "./schema";

//TO DO: review how to break circular imports
export async function handleAdd(db: PgliteDatabase) {
  console.log("handleAdd ran");
  await db?.insert(transactions).values({
    date: "2022-01-01",
    arrivalDate: "2022-01-02",
    type: "hotel",
    confirmationCode: "CONF123",
    bookingDate: "2022-01-01",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    shortTerm: "yes",
    nights: 1,
    guest: "Jane Doe",
    listing: "Hotel XYZ",
    details: "Test booking",
    amount: 100,
    paidOut: 90,
    serviceFee: 10,
    fastPayFee: 5,
    cleaningFee: 5,
    grossEarnings: 100,
    totalOccupancyTaxes: 10,
    earningsYear: 2022,
    countyTax: 5,
    stateTax: 5,
  });
}
export async function addProperties(db: PgliteDatabase) {
  await db?.insert(properties).values({
    address: "101",
    town: "Montauk",
    listings: ["1st", "2nd", "rear"],
  });
  console.log("ran addProperties");
}

export async function handleLog(db: PgliteDatabase) {
  const result = await db?.select().from(transactions);
  console.log("Transactions", result);
}

export async function handlePropertyLog(db: PgliteDatabase) {
  const result = await db?.select().from(properties);
  console.log("Properties", result || "0 properties");
}
