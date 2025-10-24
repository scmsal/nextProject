"use client";

import { PGliteProvider } from "@electric-sql/pglite-react";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { initDb } from "./initDb";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<PGlite | null>(null);

  useEffect(() => {
    const setup = async () => {
      //create database
      const instance = await PGlite.create({
        dataDir: "idb://rentalTaxesDB",
        extensions: { live },
      });
      await initDb(instance);
      setDb(instance);
    };
    setup();
  }, []);

  if (!db) return <div>Loading database...</div>>

  return <PGliteProvider db={db}> {children}</PGliteProvider>;
}
