"use client";

import UploadTransactionsForm from "../components/forms/UploadTransactionsForm";
import TransactionsTable from "../components/tables/TransactionsTable";
import { useDb } from "@/lib/db/dbContext";

export default function TransactionsPage() {
  const { transactionsData, db } = useDb();

  return (
    <div>
      <h3 className="ps-2 text-secondary underline ">
        Step 2: Manage Transactions
      </h3>
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
