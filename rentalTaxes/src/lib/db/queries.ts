import type { PgliteDatabase } from "drizzle-orm/pglite";

import { PropertyListing, Property, Listing, Db } from "@/types";
// import { TableType } from "@/types";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { eq, sql, and, gte, lte } from "drizzle-orm";
import { propertiesTable, transactionsTable, listingsTable } from "./schema";
import * as schema from "./schema";

//Ensure transactions are unique (to be used before insertion into db)

export async function transactionExists(
  db: Db,
  row: { confirmationCode: string; date: string; amount: number }
) {
  return await db
    .select()
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.confirmationCode, row.confirmationCode),
        eq(transactionsTable.date, row.date),
        eq(transactionsTable.amount, row.amount)
      )
    )
    .limit(1);
}

/**
 * Check whether a record with the given key/value exists in a table.
 * Works for both `properties` and `listings` tables.
 */

export async function existsInDb(
  db: Db,
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

export async function handleAdd(db: Db) {
  console.log("handleAdd ran");
  // await db?.insert(transactions).values({
  //   date: new Date("2022-01-01"),
  //   arrivalDate: "2022-01-02",
  //   type: "hotel",
  //   confirmationCode: "CONF123",
  //   bookingDate: "2022-01-01",
  //   startDate: "2022-01-01",
  //   endDate: "2022-01-02",
  //   nights: 1,
  //   guest: "Jane Doe",
  //   listingName: "Hotel XYZ",
  //   details: "Test booking",
  //   amount: 100,
  //   paidOut: 90,
  //   serviceFee: 10,
  //   fastPayFee: 5,
  //   cleaningFee: 5,
  //   grossEarnings: 100,
  //   totalOccupancyTaxes: 10,
  //   earningsYear: 2022,
  //   countyTax: 5,
  //   stateTax: 5,
  //   uploadedAt: new Date(),
  // });
}
export async function addSampleProperties(db: Db) {
  //TO DO: update fields to match schema
  // await db?.insert(properties).values({
  //   address: "101",
  //   propertyName: "Main house",
  //   town: "Montauk",
  // });
  console.log("ran addProperties");
}

// export async function addSampleListings(db: PgliteDatabase) {
//   console.log("addSampleListings ran.");
// await db.insert(listings).values([
//   { listingName: "Cozy haven", propertyId: 3 },
//   { listingName: "Comfortable 2nd floor apartment", propertyId: 3 },
//   { listingName: "Neat one-bedroom apartment", propertyId: 3 },
//   { listingName: "Spacious 2-bedroom", propertyId: 1 },
//   { listingName: "Bright 1-bedroom", propertyId: 4 },
//   { listingName: "Peaceful 2-bedroom", propertyId: 2 },
// ]);
// }

export async function handleLog(db: Db) {
  const result = await db?.query.transactionsTable.findMany();
  console.log("Transactions", result);
}

export async function handlePropertyLog(db: Db) {
  const result = await db?.query.propertiesTable.findMany();

  console.log("Properties", result || "0 properties");
  return result;
}

export function groupProperties(
  properties: Property[],
  listings: Listing[]
): PropertyListing[] {
  const map = new Map<string, PropertyListing>();

  for (const p of properties) {
    map.set(p.propertyId, {
      ...p,
      listings: [],
    } as PropertyListing);
  }

  // Add each listing to its property's listings once
  for (const l of listings) {
    const group = map.get(l.propertyId);
    if (group) {
      group.listings.push(l as Listing);
    }
  }
  return [...map.values()] as PropertyListing[];
}

//TO DO: simplify the joins now that propertyId and listingKey are in the transactions table

//TO DO: aggregate by date

function dateWindow(
  dateColumn: typeof transactionsTable.date,
  startFilterDate?: string,
  endFilterDate?: string
) {
  if (!startFilterDate && !endFilterDate) return sql`TRUE`; //no filter

  return sql`${dateColumn} >= ${
    startFilterDate ?? "0000-01-01"
  } AND ${dateColumn} <= ${endFilterDate ?? "9999-12-31"}`;
}
export async function getRevenueAggregates(
  db: Db,
  fromDate?: string,
  toDate?: string
) {
  console.log("getPropertyAggregates ran");
  //base query
  const fromISO = fromDate ? `${fromDate}T00:00:00:000Z` : undefined;
  const toISO = toDate ? `${toDate}T00:00:00:000Z` : undefined;
  const dateFilter = dateWindow(transactionsTable.date, fromISO, toISO);

  /*
Get all transactions 

  */
  let query = await db
    .select({
      propertyId: propertiesTable.propertyId,
      propertyName: propertiesTable.propertyName,
      totalRevenue: sql<number>`
      SUM( 
      CASE WHEN ${dateFilter}
        THEN ${transactionsTable.amount}
        ELSE 0 END
      )`,
      //add filter for only reservation and adjustment
      shortTermRevenue: sql<number>`
      SUM(
        CASE WHEN ${transactionsTable.shortTerm}
          AND ${dateFilter}
        THEN ${transactionsTable.amount}
        ELSE 0 END
      )
    `,
      longTermRevenue: sql<number>`
      SUM(
        CASE WHEN NOT ${transactionsTable.shortTerm}
        AND ${dateFilter}
        THEN ${transactionsTable.amount}
        ELSE 0 END
      )
    `,
      // listingCount: sql<number>`COUNT(${listings.listingKey})`,
      shortTermStays: sql<number>`COUNT(DISTINCT CASE WHEN ${transactionsTable.shortTerm} AND ${dateFilter}
      THEN ${transactionsTable.confirmationCode}
        
        ELSE null END)`,
      longTermStays: sql<number>`COUNT(DISTINCT CASE WHEN NOT ${transactionsTable.shortTerm} AND ${dateFilter} THEN ${transactionsTable.confirmationCode}
        ELSE null END)`,
    })
    .from(propertiesTable)
    //TO DO: check against transactions schema, if propertyId is included there
    .leftJoin(
      listingsTable,
      eq(listingsTable.propertyId, propertiesTable.propertyId)
    )
    .leftJoin(
      transactionsTable,
      eq(transactionsTable.listingId, listingsTable.listingId)
    )
    .groupBy(propertiesTable.propertyId, propertiesTable.propertyName);

  const results = await query;

  return results;
}
