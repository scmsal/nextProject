import type { PgliteDatabase } from "drizzle-orm/pglite";
import { transactions, properties, listings } from "./schema";
// import { TableType } from "@/types";
import { eq, sql, and, gte, lte } from "drizzle-orm";

/**
 * Check whether a record with the given key/value exists in a table.
 * Works for both `properties` and `listings` tables.
 */

export async function existsInDb(
  db: PgliteDatabase,
  table: any,
  keyName: string,
  value: string
): Promise<boolean> {
  const column = table[keyName];
  if (!column) throw new Error(`Column ${String(keyName)} not found in table`);
  const result = await db
    .select()
    .from(table as any)
    .where(eq(column as any, value));
  return result.length > 0;
}

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
    nights: 1,
    guest: "Jane Doe",
    listingName: "Hotel XYZ",
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
    uploadedAt: new Date(),
  });
}
export async function addSampleProperties(db: PgliteDatabase) {
  await db?.insert(properties).values({
    address: "101",
    propertyName: "Main house",
    town: "Montauk",
  });
  console.log("ran addProperties");
}

export async function addSampleListings(db: PgliteDatabase) {
  console.log("addSampleListings ran.");
  // await db.insert(listings).values([
  //   { listingName: "Cozy haven", propertyId: 3 },
  //   { listingName: "Comfortable 2nd floor apartment", propertyId: 3 },
  //   { listingName: "Neat one-bedroom apartment", propertyId: 3 },
  //   { listingName: "Spacious 2-bedroom", propertyId: 1 },
  //   { listingName: "Bright 1-bedroom", propertyId: 4 },
  //   { listingName: "Peaceful 2-bedroom", propertyId: 2 },
  // ]);
}

export async function handleLog(db: PgliteDatabase) {
  const result = await db?.select().from(transactions);
  console.log("Transactions", result);
}

export async function handlePropertyLog(db: PgliteDatabase) {
  const result = await db?.select().from(properties);
  console.log("Properties", result || "0 properties");
}

export async function getListingsWithProperties(db: PgliteDatabase) {
  return db
    .select({
      id: listings.id,
      listingName: listings.listingName,
      propertyName: properties.propertyName,
    })
    .from(properties)
    .leftJoin(listings, eq(listings.propertyKey, properties.propertyKey));
}

//TO DO: simplify the joins now that propertyKey and listingKey are in the transactions table
//TO DO: aggregate by date
export async function getRevenueAggregates(
  db: PgliteDatabase
  // startDate?: string,
  // endDate?: string
) {
  console.log("getPropertyAggregates ran");
  //base query
  let query = db
    .select({
      propertyKey: properties.propertyKey,
      propertyName: properties.propertyName,
      totalRevenue: sql<number>`SUM(${transactions.amount})`,
      //add filter for only reservation and adjustment
      shortTermRevenue: sql<number>`
      SUM(
        CASE WHEN ${transactions.shortTerm}
        THEN ${transactions.amount}
        ELSE 0 END
      )
    `,
      longTermRevenue: sql<number>`
      SUM(
        CASE WHEN NOT ${transactions.shortTerm}
        THEN ${transactions.amount}
        ELSE 0 END
      )
    `,
      // listingCount: sql<number>`COUNT(${listings.listingKey})`,
      shortTermStays: sql<number>`COUNT(DISTINCT CASE WHEN ${transactions.shortTerm} THEN ${transactions.confirmationCode}
        
        ELSE null END)`,
      longTermStays: sql<number>`COUNT(DISTINCT CASE WHEN NOT ${transactions.shortTerm} THEN ${transactions.confirmationCode}
        ELSE null END)`,
    })
    .from(properties)
    //TO DO: check against transactions schema, if propertyKey is included there
    .leftJoin(listings, eq(listings.propertyKey, properties.propertyKey))
    .leftJoin(transactions, eq(transactions.listingKey, listings.listingKey))
    .groupBy(properties.propertyKey, properties.propertyName);

  const results = await query;
  console.log("aggregates:", results);
  return results;
}
