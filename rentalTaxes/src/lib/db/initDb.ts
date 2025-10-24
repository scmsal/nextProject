import { drizzle } from "drizzle-orm/pglite";
import type { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";
import { CREATE_TRANSACTIONS_TABLE } from "./createTransactionsTable";

export async function initDb(db: PGlite) {
  await db.exec(CREATE_TRANSACTIONS_TABLE);
  return drizzle(db, { schema });
}
