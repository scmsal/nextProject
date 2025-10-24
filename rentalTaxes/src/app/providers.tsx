"use client";

import { PGliteProvider } from "@electric-sql/pglite-react";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { useEffect, useState, type ReactNode } from "react";
import { runMigrations } from "@/lib/db/createTransactionsTable";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../lib/db/schema";

const dbPromise = (async () => {
  const db = await PGlite.create({
    dataDir: "idb://rentalTaxesDB",
    extensions: { live },
  });
  await runMigrations(db);
  return db;
})();

export function Providers({ children }: { children: ReactNode }) {
  // include a live property in the state type so it matches PGliteWithLive shape
  const [db, setDb] = useState<(PGlite & { live: any }) | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const resolved = await dbPromise;
      if (!mounted) return;
      // cast to the expected provider type (include live)
      setDb(resolved as unknown as PGlite & { live: any });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!db) return null;

  return <PGliteProvider db={db}>{children}</PGliteProvider>;
}
