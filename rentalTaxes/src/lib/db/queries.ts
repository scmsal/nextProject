import type { PgliteDatabase } from "drizzle-orm/pglite";

import { PropertyListing, Property, Listing, Db } from "@/types";
// import { TableType } from "@/types";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { eq, sql, and, gte, lte } from "drizzle-orm";
import {
  propertiesDbTable,
  transactionsDbTable,
  listingsDbTable,
} from "./schema";
import * as schema from "./schema";

export async function clearPropAndListings(db: Db) {
  await db.transaction(async (tx) => {
    await tx.delete(listingsDbTable);
    await tx.delete(propertiesDbTable);
  });

  console.log("All properties and listings deleted.");
}

export async function clearTransactions(db: Db) {
  await db.delete(transactionsDbTable);
  console.log("All transactions deleted.");
}
//Ensure transactions are unique (to be used before insertion into db)

export async function transactionExists(
  db: Db,
  row: { confirmationCode: string; date: string; amount: number },
) {
  return await db
    .select()
    .from(transactionsDbTable)
    .where(
      and(
        eq(transactionsDbTable.confirmationCode, row.confirmationCode),
        eq(transactionsDbTable.date, row.date),
        eq(transactionsDbTable.amount, row.amount),
      ),
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
  value: string,
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
  const result = await db?.query.transactionsDbTable.findMany();
  console.log("Transactions", result);
}

export async function handlePropertyLog(db: Db) {
  const result = await db?.query.propertiesDbTable.findMany();

  console.log("Properties", result || "0 properties");
  return result;
}

export function groupProperties(
  properties: Property[],
  listings: Listing[],
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
  dateColumn: typeof transactionsDbTable.date,
  startFilterDate?: string,
  endFilterDate?: string,
) {
  if (!startFilterDate && !endFilterDate) return sql`TRUE`; //no filter

  return sql`${dateColumn} >= ${
    startFilterDate ?? "0000-01-01"
  } AND ${dateColumn} <= ${endFilterDate ?? "9999-12-31"}`;
}
