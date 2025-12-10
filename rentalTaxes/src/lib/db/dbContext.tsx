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
    fromDate: string;
    toDate: string;
  }) => Promise<void>;
};

const DbContext = createContext<DbContextType | null>(null);

//This will be called inside the components
export function useDb() {
  const context = useContext(DbContext);
  if (!context) throw new Error("useDb must be used within <Providers>");
  return context;
}

export function DbProvider({ children }: { children: ReactNode }) {
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

    const result = await db.query.transactionsDbTable.findMany();

    setTransactionsData(result);
  }

  async function loadProperties() {
    if (!db) return;

    const result = await db.query.propertiesDbTable.findMany();
    setPropertiesData(result);
  }

  async function loadListings() {
    if (!db) return;

    const result = await db.query.listingsDbTable.findMany();
    setListingsData(result);
  }

  function aggregateAmounts(arrTransactions: Transaction[], debug?: boolean) {
    const aggregate = arrTransactions.reduce((acc, transaction) => {
      const amount = transaction.amount ? Number(transaction.amount) : 0;
      if (debug) {
        console.log("transaction date:", transaction.date, "amount:", amount);
      }
      return acc + amount;
    }, 0);

    return aggregate;
  }

  async function loadRevenueAggregates({
    fromDate,
    toDate,
  }: {
    fromDate: string;
    toDate: string;
  }) {
    const rows: RevenueAggregate[] = propertiesData.map((prop) => {
      console.log("from:", fromDate, " to:", toDate);
      console.log(prop.propertyId);
      // let propTransactions: [] = [];
      const propertyDateTransactions = transactionsData.filter(
        (transaction) => {
          if (transaction.amount && transaction.amount > 0) {
          }

          if (transaction.propertyId !== prop.propertyId) return false;
          // if (fromDate && transaction.date < fromDate) return false;
          // if (toDate && transaction.date > toDate) return false;

          return true;
        }
      );

      const totalRevenue = aggregateAmounts(propertyDateTransactions, true);
      const shortTransactions = propertyDateTransactions.filter(
        (transaction) => transaction.shortTerm
      );
      const shortTermRevenue = aggregateAmounts(shortTransactions);
      const longTransactions = propertyDateTransactions.filter(
        (transaction) => !transaction.shortTerm
      );
      const longTermRevenue = aggregateAmounts(longTransactions);
      const revenueAggregate: RevenueAggregate = {
        propertyName: prop.propertyName,
        totalRevenue,
        shortTermRevenue,
        longTermRevenue,
        shortTermStays: shortTransactions.length,
        longTermStays: longTransactions.length,
      };
      return revenueAggregate;
    });

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
