"use client";

import { propertiesTable } from "@/lib/db/schema";
import { parsePropertiesCsvFile } from "@/lib/data/importCSV";
import { useCallback, useState } from "react";
import { useDb } from "@/lib/db/dbContext";
import { existsInDb } from "@/lib/db/queries";
import { Property } from "@/types";

export default function UploadPropertiesForm() {
  const { db, loadProperties } = useDb();
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
        // clean and normalize data
        const cleaned = await parsePropertiesCsvFile(file);

        if (!db) {
          setStatus("Database not initialized.");
          return;
        }

        // Filter out duplicates asynchronously (existsInDb returns a Promise)

        const uniqueCleaned = (
          await Promise.all(
            cleaned.map(async (row) => {
              const exists = await existsInDb(
                db,
                propertiesTable,
                "propertyId",
                row.propertyId
              );
              return exists ? null : row; //only include unique rows
            })
          )
        ).filter(Boolean) as Property[]; //remove nulls;

        //insert into database

        await db.insert(propertiesTable).values(uniqueCleaned);
        setStatus(`Imported ${cleaned.length} properties.`);
        await loadProperties();
      } catch (err) {
        console.error(err);
        setStatus("Error importing file.");
      }
    },
    [file, db]
  );

  return (
    <div>
      <h1 className="pb-3 font-bold text-2xl">Upload Properties CSV</h1>
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
