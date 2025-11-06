import type { PgliteDatabase } from "drizzle-orm/pglite";
import { transactions, properties, listings } from "./schema";
import { eq, sql, and, gte, lte } from "drizzle-orm";

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
    listingId: 0,
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
export async function addProperties(db: PgliteDatabase) {
  await db?.insert(properties).values({
    address: "101",
    propertyName: "Main house",
    town: "Montauk",
  });
  console.log("ran addProperties");
}

export async function addSampleListings(db: PgliteDatabase) {
  await db.insert(listings).values([
    { listingName: "Cozy haven", propertyId: 3 },
    { listingName: "Comfortable 2 bedroom", propertyId: 3 },
    { listingName: "Neat 1 bedroom", propertyId: 3 },
    { listingName: "Spacious 2 bedroom", propertyId: 1 },
    { listingName: "Bright 1 bedroom", propertyId: 4 },
    { listingName: "Peaceful 2 bedroom", propertyId: 2 },
  ]);
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
    .leftJoin(listings, eq(listings.propertyId, properties.id));
}

export async function getPropertyAggregates(
  db: PgliteDatabase,
  startDate?: string,
  endDate?: string
) {
  //base query
  let query = db
    .select({
      propertyName: properties.propertyName,
      totalRevenue: sql<number>`SUM(${transactions.amount}`,
      listingCount: sql<number>`COUNT(${listings.id})`,
    })
    .from(properties)
    .leftJoin(listings, eq(listings.propertyId, properties.id))
    .leftJoin(transactions, eq(transactions.listingId, listings.id))
    .where(
      startDate && endDate
        ? and(
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        : startDate
        ? gte(transactions.date, startDate)
        : endDate
        ? lte(transactions.date, endDate)
        : undefined
    )
    .groupBy(properties.propertyName);

  return query;
}
