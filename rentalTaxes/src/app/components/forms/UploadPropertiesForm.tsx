"use client";

import { propertiesDbTable } from "@/lib/db/schema";
import { parsePropertiesCsvFile } from "@/lib/data/importCSV";
import { useCallback, useState } from "react";
import { useDb } from "@/lib/db/dbContext";
import { existsInDb } from "@/lib/db/queries";
import { Property } from "@/types";
import { Card, Button, Form } from "@heroui/react";

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
                propertiesDbTable,
                "propertyId",
                row.propertyId
              );
              return exists ? null : row; //only include unique rows
            })
          )
        ).filter(Boolean) as Property[]; //remove nulls;

        //insert into database

        await db.insert(propertiesDbTable).values(uniqueCleaned);
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
    <Card className="min-h-[312px]!">
      <h1 className="pb-3 font-bold text-2xl text-background">
        Upload Properties CSV
      </h1>
      <p className="text-black">Headings: name, address, town, county</p>
      <Form onSubmit={handleUpload}>
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
      </Form>
      <p className="mt-3 text-sm text-gray-700">{status}</p>
    </Card>
  );
}
