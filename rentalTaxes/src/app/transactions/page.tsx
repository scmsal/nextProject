"use client";

import UploadTransactionsForm from "../components/forms/UploadTransactionsForm";
import TransactionsTable from "../components/tables/TransactionsTable";
import { useDb } from "@/lib/db/dbContext";
import NextLink from "../components/NextLink";
import BackLink from "../components/BackLink";

export default function TransactionsPage() {
  const { transactionsData, db } = useDb();

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="ps-2 text-secondary underline ">
          Step 2: Manage Transactions
        </h3>
        <div className="flex">
          <BackLink slug="/properties" contents="Step 1: Manage Properties" />
          <NextLink slug="summaries" contents="Step 3: Calculate Summaries" />
        </div>
      </div>

      <div>
        <UploadTransactionsForm />
        {/* <DateFilterForm /> */}
        {transactionsData && (
          <TransactionsTable data={transactionsData} db={db} />
        )}
      </div>
    </div>
  );
}
