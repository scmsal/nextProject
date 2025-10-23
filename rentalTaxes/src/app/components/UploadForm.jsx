"use client";
import { useCallback, useState } from "react";
import { importCsv } from "../../lib/importCSV";
import { initDb } from "@/lib/db/initDb";

export default function UploadForm() {
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = useCallback(
    async (e) => {
      e.preventDefault();

      if (!file) {
        setStatus("No file selected");
        return;
      }
      // Prevent re-entrancy (especially in dev mode / hot reload)

      // if (typeof window !== "undefined") {
      //   //TO DO - look up explanation
      //   if (window.__UPLOAD_RUNNING__) return;
      //   window.__UPLOAD_RUNNING__ = true;
      // }

      try {
        setStatus(`Importing CSV file:, ${file.name}...`);
        const count = await importCsv(file);
        setStatus(`Imported ${count} transactions.`);
      } catch (err) {
        console.error(err);
        setStatus("Error importing file.");
      }
      // finally {
      //   if (typeof window !== "undefined") {
      //     //allow subsequent uploads
      //     window.__UPLOAD_RUNNING__ = false;
      //   }
      // }
    },
    [file]
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
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="ml-3 border py-2 px-4 rounded-lg hover:bg-gray-600 hover:text-white cursor-pointer"
        >
          Upload
        </button>
      </form>
      <p>{status}</p>
    </div>
  );
}
