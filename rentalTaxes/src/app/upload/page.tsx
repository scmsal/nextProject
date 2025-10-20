import UploadForm from "../components/UploadForm";
import { useState } from "react";

export default function Page() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="container">
      <UploadForm onUploadComplete={() => setRefresh((r) => r + 1)} />
    </div>
  );
}
