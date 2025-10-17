"use client";
import { useState } from "react";
import { importCSV } from "../lib/importCSV";

export default function UploadForm() {
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("Importing");
    try {
      const count = await importCSV(file);
      setStatus(`Imported ${count} transactions.`);
    } catch (err) {
      console.error(err);
      setStatus("Error importing file.");
    }
  };

  return (
    <div>
      <h1 className="pb-3 font-bold text-2xl">Uploads Dashboard</h1>
      <h3>CSV Upload</h3>
      <input
        type="file"
        accept=".csv"
        className="text-gray-700 text-sm file:bg-gray-400 hover:file:bg-gray-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:cursor-pointer"
        onChange={handleUpload}
      />
      <p>{status}</p>
    </div>
  );
}
