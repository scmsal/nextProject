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
  loadRevenueAggregates: () => Promise<void>;
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

    const result = await db.query.transactions.findMany();

    //JS converts Date objects to strings on queries. They need to be converted back into dates to correspond to schema and types and to work in TanStack tables.
    console.log("Result 0:", result[0]);
    // const resultsDatesParsed = result.map((t) => ({
    //   ...t,
    //   date: new Date(String(t.date)),
    //   bookingDate: t.bookingDate ? new Date(t.bookingDate) : null,
    //   arrivalDate: t.arrivalDate ? new Date(t.arrivalDate) : null,
    //   startDate: t.startDate ? new Date(t.startDate) : null,
    //   endDate: t.endDate ? new Date(t.endDate) : null,
    // }));
    // console.log("loadTransactions:", resultsDatesParsed[0]);
    setTransactionsData(result);
  }

  async function loadProperties() {
    if (!db) return;

    const result = await db.query.properties.findMany();
    setPropertiesData(result);
    // console.log("properties:", result);
  }

  async function loadListings() {
    if (!db) return;

    const result = await db.query.listings.findMany();
    setListingsData(result);
    //  console.log("inside loadListings. ListingsData:", listingsData);
  }

  async function loadRevenueAggregates() {
    if (!db) return;
    //TO DO: change out the hardcoded start and end dates. Put parameters inside loadRevenueAggregates; create input element for start and end dates.
    const rows = await getRevenueAggregates(
      db,
      "2025-07-02T04:00:00.000Z", //sample date
      "2025-07-04T04:00:00.000Z" //sample date
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
      console.log("Transactions table created.");

      await pgLite.exec(CREATE_PROPERTIES_TABLE);
      console.log("Properties table created.");

      await pgLite.exec(CREATE_LISTINGS_TABLE);
      console.log("Listings table created.");

      await pgLite.exec(CREATE_QUARTERLY_TABLE);
      console.log("Quarterly table created.");

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

  //TO DO: STUDY THIS FUNCTION, CONCEPT OF SUBSCRIPTIONS, AND HOW PGLITE LIVE WORKS because the following useEffect doesn't work
  // useEffect(() => {
  //   if (!pgLite) return;

  //   const liveQuery = live.query(pgLite, "SELECT * FROM transactions");
  //   const unsubscribe = liveQuery.subscribe((rows) =>
  //     setTransactionsData(rows)
  //   );

  //   return () => unsubscribe(); // cleanup
  // }, [pgLite]);

  // if (!db) {
  //   return <div>Loading database...</div>;
  // } else {
  //   console.log("Database loaded.");
  // }

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
