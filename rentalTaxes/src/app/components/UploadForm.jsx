"use client";
import { testDb } from "@/lib/db/client";
import { PGlite } from "@electric-sql/pglite";
import { useCallback, useState } from "react";
import { importCsv } from "../../lib/importCSV";

export default function UploadForm({ onUploadComplete }) {
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = useCallback(async (e) => {
    e.preventDefault();
    const client = await PGlite.create("idb://rentalTaxesDB");
    await client.exec(`
      CREATE TABLE transactions (
      id SERIAL PRIMARY KEY,
        date VARCHAR(50),
        arrival_date VARCHAR(50),
        type VARCHAR(50),
        confirmation_code VARCHAR(50),
        booking_date VARCHAR(50),
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        short_term VARCHAR(50),
        nights INTEGER,
        guest VARCHAR(255),
        listing VARCHAR(255),
        details TEXT,
        amount NUMERIC,
        paid_out NUMERIC,
        service_fee NUMERIC,
        fast_pay_fee NUMERIC,
        cleaning_fee NUMERIC,
        gross_earnings NUMERIC,
        total_occupancy_taxes NUMERIC,
        earnings_year INTEGER,
        county_tax NUMERIC,
        state_tax NUMERIC
      );
      `);
    console.log("✅ Manually created transactions table");

    if (!file) return;

    setStatus("Importing:", file);
    try {
      const count = await importCsv(file);
      setStatus(`Imported ${count} transactions.`);
    } catch (err) {
      console.error(err);
      setStatus("Error importing file.");
    }
  });

  return (
    <div>
      <h1 className="pb-3 font-bold text-2xl">Uploads Dashboard</h1>
      <h3>CSV Upload</h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".csv"
          className="text-gray-700 text-sm file:bg-gray-400 hover:file:bg-gray-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:cursor-pointer"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
