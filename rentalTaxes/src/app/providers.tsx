"use client";

import { PGliteProvider } from "@electric-sql/pglite-react";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import type { ReactNode } from "react";

const dbPromise = await PGlite.create({
  dataDir: "idb://rentalTaxesDB",
  extensions: { live },
});

export function Providers({ children }: { children: ReactNode }) {
  return <PGliteProvider db={dbPromise}> {children}</PGliteProvider>;
}
