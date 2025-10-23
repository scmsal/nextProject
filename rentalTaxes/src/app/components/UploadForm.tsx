"use client";

import { useDrizzle } from "@/lib/db/client";
import { transactions } from "@/lib/db/schema";
import { parseCsvFile } from "@/lib/importCsv";
import { useCallback, useState } from "react";

export default function UploadForm() {
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { drizzle } = useDrizzle();

  const handleUpload = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!file) {
        setStatus("No file selected");
        return;
      }

      try {
        setStatus(`Importing CSV file:, ${file.name}...`);

        //parse and clean csv data
        const cleaned = await parseCsvFile(file);

        //bulk insert into PGlite via Drizzle
        await drizzle.insert(transactions).values(cleaned);

        setStatus(`Imported ${cleaned.length} transactions.`);
      } catch (err) {
        console.error(err);
        setStatus("Error importing file.");
      }
    },
    [file, drizzle]
  );

  return (
    <div>
      <h1 className="pb-3 font-bold text-2xl">Uploads Dashboard</h1>
      <h3>CSV Upload</h3>
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
