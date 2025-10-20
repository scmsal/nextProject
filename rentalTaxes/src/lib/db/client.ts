//database setup (Drizzle + pglite)

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema.js";

let client: PGlite | null = null;

export function getDb() {
  if (!client) {
    client = new PGlite("idb://rentalTaxesDB");
  }
  return drizzle(client, { schema });
}
