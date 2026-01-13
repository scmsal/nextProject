"use client";

import { listingsDbTable } from "@/lib/db/schema";
import { parseListingsCsvFile } from "@/lib/data/importCSV";
import { useCallback, useState } from "react";
import { useDb } from "@/lib/db/dbContext";
import { existsInDb } from "@/lib/db/queries";
import { Listing } from "@/types";
import { Card, Form, Button } from "@heroui/react";

export default function UploadListingsForm() {
  const { db, listingsData, loadListings } = useDb();
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

        const cleaned = await parseListingsCsvFile(file);

        if (!db) {
          setStatus("Database not initialized.");
          return;
        }

        const uniqueCleaned = (
          await Promise.all(
            cleaned.map(async (row) => {
              const exists = await existsInDb(
                db,
                listingsDbTable,
                "listingId",
                row.listingId
              );
              return exists ? null : row; //only include unique rows
            })
          )
        ).filter(Boolean) as Listing[]; //remove nulls;

        await db.insert(listingsDbTable).values(uniqueCleaned);
        setStatus(`Imported ${cleaned.length} listings.`);
        await loadListings();
      } catch (err) {
        console.error(err);
        setStatus("Error importing file.");
      }
    },
    [file, db]
  );

  return (
    <Card className="bg-surface text-surface-foreground min-h-[312px]!">
      <h1 className="pb-3 font-bold text-2xl text-background">
        Upload Listings CSV
      </h1>
      <ul>
        <li>
          {" "}
          Make sure the listing names match the ones in your transactions files.
        </li>
        <li>Headings: listing_name, property_id </li>
      </ul>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".csv"
          className="text-gray-700 text-sm file:bg-gray-400 hover:file:bg-gray-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:cursor-pointer"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button
          className="border border-gray py-2 px-4 rounded-lg cursor-pointer bg-background"
          type="submit"
        >
          Upload
        </Button>
      </form>
      <p className="mt-3 text-sm text-gray-700">{status}</p>
    </Card>
  );
}
