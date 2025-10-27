"use client";

import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live, PGliteWithLive } from "@electric-sql/pglite/live";
import { ReactNode, useEffect, useState } from "react";
import { drizzle, PgliteDatabase } from "drizzle-orm/pglite";
import {
  CREATE_TRANSACTIONS_TABLE,
  CREATE_PROPERTIES_TABLE,
  CREATE_QUARTERLY_TABLE,
} from "./createTables";
import { Repl } from "@electric-sql/pglite-repl";
import { properties, transactions } from "./schema";

export function Providers({ children }: { children: ReactNode }) {
  const [pgLite, setPgLite] = useState<PGliteWithLive>();
  const [db, setDb] = useState<PgliteDatabase>();

  useEffect(() => {
    const initDb = async () => {
      //create database
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
    };

    initDb();
  }, []);

  if (!db) {
    return <div>Loading database...</div>;
  } else {
    console.log("Database loaded.");
  }

  async function handleAdd() {
    console.log("handleAdd ran");
    await db?.insert(transactions).values({
      date: "2022-01-01",
      arrivalDate: "2022-01-02",
      type: "hotel",
      confirmationCode: "CONF123",
      bookingDate: "2022-01-01",
      startDate: "2022-01-01",
      endDate: "2022-01-02",
      shortTerm: "yes",
      nights: 1,
      guest: "Jane Doe",
      listing: "Hotel XYZ",
      details: "Test booking",
      amount: 100,
      paidOut: 90,
      serviceFee: 10,
      fastPayFee: 5,
      cleaningFee: 5,
      grossEarnings: 100,
      totalOccupancyTaxes: 10,
      earningsYear: 2022,
      countyTax: 5,
      stateTax: 5,
    });
  }
  async function addProperties() {
    await db?.insert(properties).values({
      address: "101",
      town: "Montauk",
      listings: ["1st", "2nd", "rear"],
    });
  }

  async function handleLog() {
    const result = await db?.select().from(transactions);
    console.log("Transactions", result);
  }
  async function handlePropertyLog() {
    const result = await db?.select().from(properties);
    console.log("Properties", result || "0 properties");
  }
  return (
    <PGliteProvider db={pgLite}>
      <Repl pg={pgLite} />
      <button
        className="hover:bg-gray-50 cursor-pointer border"
        onClick={handleAdd}
      >
        Add Transaction
      </button>
      <button
        className="ml-2 hover:bg-gray-50 cursor-pointer border"
        onClick={handleLog}
      >
        Log Transactions
      </button>
      <button
        className="ml-2 hover:bg-gray-50 cursor-pointer border"
        onClick={handlePropertyLog}
      >
        Add Properties
      </button>
      <button
        className="ml-2 hover:bg-gray-50 cursor-pointer border"
        onClick={addProperties}
      >
        Log Properties
      </button>
      {children}
    </PGliteProvider>
  );
}
