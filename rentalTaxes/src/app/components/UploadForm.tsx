"use client";

import { quarterlyFile, transactions } from "@/lib/db/schema";
import { parseCsvFile } from "@/lib/importCsv";
import { useCallback, useState } from "react";
import { useDb } from "@/lib/db/providers";

export default function UploadForm() {
  const { db, loadTransactions } = useDb();
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [quarter, setQuarter] = useState("");

  const handleUpload = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!file) {
        setStatus("No file selected");
        return;
      }

      if (!quarter) {
        setStatus("Please select the quarter you are reporting");
        return;
      }
      try {
        setStatus(`Importing CSV file:, ${file.name}...`);

        //TO DO: get filename to include as source in the table
        //TO DO: get quarter by payout date

        //parse and clean csv data
        // You need to pass the whole table of listing data so it can convert the listing name to a listingId
        const cleaned = await parseCsvFile(file, quarter);

        //bulk insert into PGlite via Drizzle
        if (!db) {
          setStatus("Database not initialized.");
          return;
        }
        await db.insert(transactions).values(cleaned);

        setStatus(`Imported ${cleaned.length} transactions.`);
        await loadTransactions();
      } catch (err) {
        console.error(err);
        setStatus("Error importing file.");
      }
    },
    [file, db]
  );

  return (
    <div>
      <h1 className="pb-3 font-bold text-2xl">Uploads Dashboard</h1>
      <h3>CSV Upload</h3>
      <form onSubmit={handleUpload}>
        <select
          onChange={(e) => setQuarter(e.target.value)}
          className="me-2 border"
        >
          <option value="null">Select quarter</option>
          <option value="Q1">Q1-March</option>
          <option value="Q2">Q2-June</option>
          <option value="Q3">Q3-September</option>
          <option value="Q4">Q4-December</option>
        </select>
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
