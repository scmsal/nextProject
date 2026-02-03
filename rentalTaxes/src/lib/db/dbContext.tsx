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
} from "./createTables";

import ReplWithButtons from "@/app/components/data/ReplWithButtons";

import * as schema from "./schema";

import {
  Property,
  Transaction,
  Listing,
  RevenueAggregate,
  PropertyTransaction,
} from "@/types";

interface DbContextType {
  pgLite: PGliteWithLive | undefined;
  db: PgliteDatabase<typeof schema>;
  transactionsData: Transaction[];
  propertiesData: Property[];
  listingsData: Listing[];
  revenueAggregatesData: RevenueAggregate[];
  loadTransactions: () => Promise<void>;
  loadProperties: () => Promise<void>;
  loadListings: () => Promise<void>;
  reloadAllPropListings: () => Promise<void>;
  loadRevenueAggregates: (params: {
    fromDate: string;
    toDate: string;
  }) => Promise<void>;
}

const DbContext = createContext<DbContextType | null>(null);

//This will be called inside the components
export function useDb() {
  const context = useContext(DbContext);
  if (!context) throw new Error("useDb must be used within <Providers>");
  return context;
}

/*IMPORTANT helper function to keep dates from converting to UTC with date shift*/
//TO DO: check other files to make sure there's no duplication of similar functions
export function localDateFromYMD(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d); // local midnight, no timezone shift
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
  async function reloadAllPropListings() {
    if (!db) return;

    const [properties, listings] = await Promise.all([
      db.query.propertiesDbTable.findMany(),
      db.query.listingsDbTable.findMany(),
    ]);

    // batch updates in one tick
    setPropertiesData(properties);
    setListingsData(listings);
  }

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

  //helper function for loadRevenueAggregates
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
  function aggregateGross(arrTransactions: Transaction[]) {
    const aggregate = arrTransactions.reduce((acc, transaction) => {
      const gross = transaction.grossEarnings
        ? Number(transaction.grossEarnings)
        : 0;

      return acc + gross;
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
    console.trace();
    if (fromDate === "" && toDate === "") {
      setRevenueAggregatesData([]);
      return;
    }

    const rows: RevenueAggregate[] = propertiesData.map((prop) => {
      const inclTransactions: PropertyTransaction[] = [];
      const excludedTransactions: PropertyTransaction[] = [];
      const propertyDateTransactions = transactionsData.filter(
        (transaction) => {
          const transactionDate = localDateFromYMD(transaction.date);
          // console.log(
          //   "inside loadRevenue aggregates. transaction.date: " +
          //     transaction.date +
          //     " localDateFromISO(transaction.date: ",
          //   transactionDate,
          // );

          if (transaction.propertyId !== prop.propertyId) return false;

          if (fromDate) {
            const from = localDateFromYMD(fromDate); //this makes from date in filter inclusive BUT CHECK TIME ZONES
            if (transactionDate < from) return false;
          }

          //this will apply in FilterButtons with quarters

          if (toDate) {
            const to = localDateFromYMD(toDate);
            //make inclusive TO DO: CHECK
            console.log("toDate", toDate, "to:", to);
            to.setDate(to.getDate() + 1);

            if (transactionDate > to) return false;
          }

          inclTransactions.push({
            type: transaction.type,
            date: transaction.date,
            nights: transaction.nights,
            amount: transaction.amount,
            gross: transaction.grossEarnings,
            listing: transaction.listingName,
          });
          return true;
        },
      );

      const netRevenue = aggregateAmounts(propertyDateTransactions);
      const shortTransactions = propertyDateTransactions.filter(
        (transaction) => transaction.shortTerm,
      );
      const shortTermRevenue = aggregateAmounts(shortTransactions);
      const longTransactions = propertyDateTransactions.filter(
        (transaction) => !transaction.shortTerm,
      );
      const longTermRevenue = aggregateAmounts(longTransactions);
      const totalGross = aggregateGross(propertyDateTransactions);
      const longTermGross = aggregateGross(longTransactions);
      const shortTermGross = aggregateGross(shortTransactions);
      const revenueAggregate: RevenueAggregate = {
        propertyName: prop.propertyName,
        netRevenue: netRevenue,
        shortTermRevenue,
        longTermRevenue,
        shortTermStays: shortTransactions.length,
        longTermStays: longTransactions.length,
        excludedTransactions,
        inclTransactions,
        totalGross,
        shortTermGross,
        longTermGross,
        transactions: inclTransactions.length, //TO DO: check against other references
      };
      console.log(
        revenueAggregate.propertyName,
        revenueAggregate.inclTransactions,
      );
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
          reloadAllPropListings,
        }}
      >
        {/* <ReplWithButtons /> */}
        {children}
      </DbContext.Provider>
    </PGliteProvider>
  );
}
