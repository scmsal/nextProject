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
  CREATE_QUARTERLY_TABLE,
} from "./createTables";

import ReplWithButtons from "@/app/components/ReplWithButtons";

import { properties, transactions, quarterly } from "./schema";

type DbContextType = {
  pgLite: PGliteWithLive | undefined;
  db: PgliteDatabase | undefined;
  transactionsData: any[]; //or Transactions type?
  loadTransactions: () => Promise<void>;
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
  const [db, setDb] = useState<PgliteDatabase>();
  const [transactionsData, setTransactionsData] = useState<any[]>([]);

  async function loadTransactions() {
    if (!db) return;
    const result = await db.select().from(transactions);
    setTransactionsData(result);
  }

  useEffect(() => {
    const initDb = async () => {
      //**create database**
      const pgLite = await PGlite.create({
        dataDir: "idb://rentalTaxesDB",
        extensions: { live },
      });

      await pgLite.exec(CREATE_TRANSACTIONS_TABLE);
      console.log("Transactions table created.");

      await pgLite.exec(CREATE_PROPERTIES_TABLE);
      console.log("Properties table created.");

      await pgLite.exec(CREATE_QUARTERLY_TABLE);
      console.log("Quarterly table created.");

      //this part is very important
      const db = drizzle(pgLite);
      setPgLite(pgLite);
      setDb(db);
      await loadTransactions(); // initial load
    };

    initDb();
  }, []);

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
        value={{ pgLite, db, transactionsData, loadTransactions }}
      >
        <ReplWithButtons />
        {children}
      </DbContext.Provider>
    </PGliteProvider>
  );
}
