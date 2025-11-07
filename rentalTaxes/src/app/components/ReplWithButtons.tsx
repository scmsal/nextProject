import { Repl } from "@electric-sql/pglite-repl";
import {
  handleAdd,
  handleLog,
  handlePropertyLog,
  addSampleProperties,
  addSampleListings,
} from "@/lib/db/queries";

import { useDb } from "@/lib/db/providers";

export default function ReplWithButtons() {
  const { db, pgLite, loadTransactions } = useDb();

  if (!pgLite || !db) {
    return <div>Loading database...</div>;
  }

  return (
    <>
      <Repl pg={pgLite} />
      <button
        className="hover:bg-gray-50 cursor-pointer border"
        onClick={() => {
          handleAdd(db);
        }}
      >
        Add Transaction
      </button>
      <button
        className="ml-2 hover:bg-gray-50 cursor-pointer border"
        onClick={() => {
          handleLog(db);
          loadTransactions();
        }}
      >
        Log Transactions
      </button>
      <button
        className="ml-2 hover:bg-gray-50 cursor-pointer border"
        onClick={() => {
          addSampleProperties(db);
        }}
      >
        Add Properties
      </button>
      <button
        className="ml-2 hover:bg-gray-50 cursor-pointer border"
        onClick={() => {
          handlePropertyLog(db);
        }}
      >
        Log Properties
      </button>
      <button
        className="ml-2 hover:bg-gray-50 cursor-pointer border"
        onClick={() => {
          addSampleListings(db);
        }}
      >
        Add Listings
      </button>
    </>
  );
}
