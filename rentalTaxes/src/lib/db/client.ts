import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { initDb } from "./initDb";

//TO - DO verify meaning of client in this context (and in initDb)
// let drizzleClient: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  // if (!drizzleClient) {
  const db = await initDb();
  return drizzle(db, { schema });
}
