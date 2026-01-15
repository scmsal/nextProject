"use client";

import { parseTransactionsCsvFile } from "@/lib/data/importCSV";
import { useCallback, useState } from "react";
import { useDb } from "@/lib/db/dbContext";
import { useEffect } from "react";
import { normalizeText } from "@/lib/data/normalization";
import { transactionExists } from "@/lib/db/queries";
import { transactionsDbTable } from "@/lib/db/schema";
import { Button, Card } from "@heroui/react";

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

        //TO DO: see if it makes sense applying this. Will the identifiers really be unique for transactions?
        const uniqueCleaned = (
          await Promise.all(
            cleaned.map(async (row) => {
              const exists = await transactionExists(db, row);
              return exists.length > 0 ? null : row;
            })
          )
        ).filter(Boolean); //only include unique rows

        //create map for faster listingId and propertyId lookup

        console.log(listingsData);
        const listingMap = Object.fromEntries(
          listingsData.map((row) => [
            normalizeText(row.listingName),
            { listingId: row.listingId, propertyId: row.propertyId },
          ])
        );

        console.log("listingMap:", listingMap);
        //TO DO: also enrich with source file

        const enriched = cleaned
          // .filter((row) => {
          //   row.type !== "Payout";
          // })
          .map((row) => {
            console.log("inside enriched", row);
            const listingName =
              row.listingName === "" ? "" : normalizeText(row.listingName);
            const match = listingMap[listingName] ?? undefined;

            console.log(
              "listingName:",
              listingName,
              "match:",
              match,
              "type:",
              row.type
            );

            return {
              ...row,
              listingId: match?.listingId ?? null, //FIX it's returning all null
              propertyId: match?.propertyId ?? null, //FIX it's all returning null
              shortTerm: Number(row.nights) < 30 && Number(row.nights) > 0,
              uploadedAt: new Date(),
            };
          });

        //bulk insert into PGlite via Drizzle
        if (!db) {
          setStatus("Database not initialized.");
          return;
        }
        await db.insert(transactionsDbTable).values(enriched); //TO FIX: date is missing from a template

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
    <Card className="w-full md:w-5xl max-w-md">
      <h1 className="pb-3 font-bold text-2xl">Upload Transactions CSV</h1>
      <form onSubmit={handleUpload} className="flex">
        <input
          type="file"
          accept=".csv"
          className="text-gray-700 text-sm file:bg-gray-400 hover:file:bg-gray-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:cursor-pointer"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button type="submit" className="button-bold">
          Upload
        </Button>
      </form>
      <p className="mt-3 text-sm text-gray-700">{status}</p>
    </Card>
  );
}
