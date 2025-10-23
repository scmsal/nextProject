import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { usePGlite } from "@electric-sql/pglite-react";

//custom hook
export function useDrizzle() {
  const db = usePGlite();

  if (!db) throw new Error("PGlite not initialized - missing Provider?");
  // use a cast because usePGlite returns a wrapper type (PGliteWithLive) that isn't directly assignable to drizzle's PGlite type
  const drizzleDb = drizzle(db as unknown as any, { schema });
  return { drizzle: drizzleDb, schema };
}
