import type { PgliteDatabase } from "drizzle-orm/pglite";
import { transactions, properties, listings } from "./schema";
import { PropertyListing, Property, Listing } from "@/types";
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
  //TO DO: update fields to match schema
  // await db?.insert(properties).values({
  //   address: "101",
  //   propertyName: "Main house",
  //   town: "Montauk",
  // });
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
      listingKey: listings.listingId,
      listingName: listings.listingName,
      propertyName: properties.propertyName,
    })
    .from(properties)
    .leftJoin(listings, eq(listings.propertyId, properties.propertyId));
}

//note: this function might be redundant since propertiesData and listingsData are already stored in context
// export async function getPropertiesWithListings(db: PgliteDatabase) {
/*note that this query doesn't work in pglite because of the way it handles (or doesn't handle) relations and constraints client-side:
        const propertiesWithListings = await db.query.  properties.findMany({
          with: { listings: true },
        });
*/

//   return db
//     .select({
//       propertyId: properties.propertyId,
//       propertyName: properties.propertyName,
//       address: properties.address,
//       town: properties.town,
//       county: properties.county,
//       listingKey: listings.listingKey,
//       listingName: listings.listingName,
//     })
//     .from(properties)
//     .leftJoin(listings, eq(listings.propertyId, properties.propertyId));
// }

export function groupProperties(
  properties: Property[],
  listings: Listing[]
): PropertyListing[] {
  const map = new Map<string, PropertyListing>();

  for (const p of properties) {
    if (!map.has(p.propertyId)) {
      map.set(p.propertyId, {
        propertyId: p.propertyId,
        propertyName: p.propertyName,
        address: p.address ?? "",
        town: p.town ?? "",
        county: p.county ?? "",
        listings: [],
      } as PropertyListing);
    }

    // If this row includes a listing, add it to the property's listings
    for (const l of listings) {
      const group = map.get(l.propertyId);
      if (group) {
        group.listings.push({
          listingId: l.listingId,
          listingName: l.listingName ?? "",
          propertyId: l.propertyId,
        } as Listing);
      }
    }
  }

  return [...map.values()] as PropertyListing[];
}

//TO DO: simplify the joins now that propertyId and listingKey are in the transactions table

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
      propertyId: properties.propertyId,
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
    //TO DO: check against transactions schema, if propertyId is included there
    .leftJoin(listings, eq(listings.propertyId, properties.propertyId))
    .leftJoin(transactions, eq(transactions.listingKey, listings.listingId))
    .groupBy(properties.propertyId, properties.propertyName);

  const results = await query;
  console.log("aggregates:", results);
  return results;
}
