"use client";
import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live, PGliteWithLive } from "@electric-sql/pglite/live";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { drizzle, PgliteDatabase } from "drizzle-orm/pglite";
import {
  CREATE_TRANSACTIONS_TABLE,
  CREATE_PROPERTIES_TABLE,
  CREATE_LISTINGS_TABLE,
  CREATE_QUARTERLY_TABLE,
} from "./createTables";

import ReplWithButtons from "@/app/components/data/ReplWithButtons";

import { getRevenueAggregates, groupProperties } from "@/lib/db/queries";
import * as schema from "./schema";
// import { properties, transactions, listings, quarterlyFile } from "./schema";
import {
  Property,
  Transaction,
  Listing,
  RevenueAggregate,
  PropertyListing,
} from "@/types";

type DbContextType = {
  pgLite: PGliteWithLive | undefined;
  db: PgliteDatabase<typeof schema>;
  transactionsData: Transaction[];
  propertiesData: Property[];
  listingsData: Listing[];
  revenueAggregatesData: RevenueAggregate[];
  loadTransactions: () => Promise<void>;
  loadProperties: () => Promise<void>;
  loadListings: () => Promise<void>;
  loadRevenueAggregates: (params: {
    fromDate: string | undefined;
    toDate: string | undefined;
  }) => Promise<void>;
};

const DbContext = createContext<DbContextType | null>(null);

//This will be called inside the components
export function useDb() {
  const context = useContext(DbContext);
  if (!context) throw new Error("useDb must be used within <Providers>");
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  const [pgLite, setPgLite] = useState<PGliteWithLive>();
  const [db, setDb] = useState<PgliteDatabase<typeof schema>>();
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [propertiesData, setPropertiesData] = useState<Property[]>([]);
  const [listingsData, setListingsData] = useState<Listing[]>([]);
  const [revenueAggregatesData, setRevenueAggregatesData] = useState<
    RevenueAggregate[]
  >([]);

  async function loadTransactions() {
    if (!db) return;

    const result = await db.query.transactionsTable.findMany();

    setTransactionsData(result);
  }

  async function loadProperties() {
    if (!db) return;

    const result = await db.query.propertiesTable.findMany();
    setPropertiesData(result);
  }

  async function loadListings() {
    if (!db) return;

    const result = await db.query.listingsTable.findMany();
    setListingsData(result);
  }

  async function loadRevenueAggregates({
    fromDate,
    toDate,
  }: {
    fromDate: string | undefined;
    toDate: string | undefined;
  }) {
    if (!db) return;

    const rows = await getRevenueAggregates(
      db,
      fromDate ?? undefined,
      toDate ?? undefined
      // "2025-07-02T04:00:00.000Z", //sample date
      // "2025-07-04T04:00:00.000Z" //sample date
    );

    setRevenueAggregatesData(rows);
  }

  useEffect(() => {
    const initDb = async () => {
      //**create database**
      const pgLite = await PGlite.create({
        dataDir: "idb://rentalTaxesDB",
        extensions: { live },
        fresh: true,
      });

      await pgLite.exec(CREATE_TRANSACTIONS_TABLE);

      await pgLite.exec(CREATE_PROPERTIES_TABLE);

      await pgLite.exec(CREATE_LISTINGS_TABLE);

      //this part is very important
      const db = drizzle(pgLite, { schema });
      setPgLite(pgLite);
      setDb(db);
    };

    initDb();
  }, []);

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        // initial load
        await loadTransactions();
        await loadProperties();
        await loadListings();
      } catch (err) {
        console.error("Error loading data:", err);
      }
    })();
  }, [db]);

  if (!pgLite || !db) {
    return <div>Initializing database...</div>;
  }

  return (
    //PGliteProvider shares the database instance
    //DbContext.Provider shares the Drizzle connection and transactionsData state
    <PGliteProvider db={pgLite}>
      <DbContext.Provider
        value={{
          pgLite,
          db,
          transactionsData,
          propertiesData,
          listingsData,
          revenueAggregatesData,
          loadTransactions,
          loadProperties,
          loadListings,
          loadRevenueAggregates,
        }}
      >
        <ReplWithButtons />
        {children}
      </DbContext.Provider>
    </PGliteProvider>
  );
}
