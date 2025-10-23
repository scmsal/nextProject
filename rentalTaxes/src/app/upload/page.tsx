"use client";

import UploadForm from "../components/UploadForm";
import { useState } from "react";
import { runMigrations } from "@/lib/db/runMigrations";

export default function Page() {
  // const [refresh, setRefresh] = useState(0);

  return (
    <div className="container">
      <UploadForm />
    </div>
  );
}

//onUploadComplete={() => setRefresh((r) => r + 1)}
