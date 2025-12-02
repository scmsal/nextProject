"use client";

import { parseTransactionsCsvFile } from "@/lib/data/importCSV";
import { useCallback, useState } from "react";
import { useDb } from "@/lib/db/dbContext";
import { useEffect } from "react";
import { normalizeText } from "@/lib/data/normalization";
import { transactionExists } from "@/lib/db/queries";
import { transactionsTable } from "@/lib/db/schema";

export default function UploadTransactionsForm() {
  const { db, loadTransactions, listingsData } = useDb();
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!file) {
        setStatus("No file selected");
        return;
      }

      try {
        setStatus(`Importing CSV file:, ${file.name}...`);

        //TO DO: get filename to include as source in the table
        //parse and clean csv data

        const cleaned = await parseTransactionsCsvFile(file);

        if (!db) {
          setStatus("Database not initialized.");
          return;
        }

        const uniqueCleaned = (
          await Promise.all(
            cleaned.map(async (row) => {
              const exists = await transactionExists(db, row);
              return exists.length > 0 ? null : row;
            })
          )
        ).filter(Boolean); //only include unique rows

        //created map for faster listingId and propertyId lookup
        const listingMap = Object.fromEntries(
          listingsData.map((row) => [
            normalizeText(row.listingName),
            { listingId: row.listingId, propertyId: row.propertyId },
          ])
        );

        //TO DO: also enrich with source file
        const enriched = cleaned.map((row) => {
          const listingName = normalizeText(row.listingName);
          const match = listingMap[listingName];

          return {
            ...row,
            listingId: match?.listingId ?? null,
            propertyId: match?.propertyId ?? null,
            shortTerm: Number(row.nights) < 30 && Number(row.nights) > 0,
            uploadedAt: new Date(),
          };
        });

        //bulk insert into PGlite via Drizzle
        if (!db) {
          setStatus("Database not initialized.");
          return;
        }
        await db.insert(transactionsTable).values(enriched); //TO FIX: date is missing from a template

        setStatus(`Imported ${enriched.length} transactions.`);
        await loadTransactions();

        //warn about unmatched listings. TO DO: make it appear in UI too.

        const unmatched = enriched.filter(
          (row) => row.confirmationCode && row.listingId === null
        );
        if (unmatched.length > 0) {
          console.warn(
            "Unmatched listings: ",
            unmatched.map((r) => r.listingName)
          );
        }
      } catch (err) {
        console.error(err);
        setStatus("Error importing file.");
      }
    },
    [file, db]
  );

  return (
    <div>
      <h1 className="pb-3 font-bold text-2xl">Upload Transactions CSV</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".csv"
          className="text-gray-700 text-sm file:bg-gray-400 hover:file:bg-gray-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:cursor-pointer"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="ml-3 border py-2 px-4 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer"
        >
          Upload
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-700">{status}</p>
    </div>
  );
}
