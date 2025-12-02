import { useDb } from "@/lib/db/dbContext";
import { FormEvent, useState, useEffect } from "react";
import { listingsTable } from "@/lib/db/schema";
import { Listing } from "@/types";
import { createListingId } from "@/lib/data/normalization";
import { existsInDb } from "@/lib/db/queries";

//Use typed status to make conditional styling possible
//TO DO: see if I need the same for UploadForm.tsx

//TO DO: use createListingKey and add propertyId
//TO DO: clear property selection after submit
interface Status {
  message: string;
  type: "success" | "error" | "";
}
export function AddListingForm() {
  const { db, propertiesData, loadListings } = useDb();

  const [status, setStatus] = useState<Status>({
    message: "",
    type: "",
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | "">("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    //debugging
    for (const [key, value] of formData.entries())
      console.log(`${key}: ${value}`);

    const name = (formData.get("listingName") as string)?.trim() ?? "";
    const propertyId = (formData.get("propertyId") as string) ?? ""; //NOTE THIS PATTERN
    const listingId = createListingId(name, propertyId);

    const cleaned: Listing = {
      listingName: name,
      propertyId,
      listingId,
    };

    const exists = await existsInDb(
      db,
      listingsTable,
      "listingId",
      cleaned.listingId
    );

    const uniqueCleaned = exists ? null : (cleaned as Listing);

    if (uniqueCleaned) {
      await addListingToDb(cleaned);
      form.reset();
      await loadListings();
      setSelectedPropertyId("");
    } else {
      /*TO DO: eventually use toast library or UI framework for toast. Use a small toast library (react-hot-toast, sonner, react-toastify) or  UI framework’s built-in (e.g. NextUI, Radix, or MUI Snackbar). Trigger it after the insert resolves:
            toast.success("Listing successfully added");
    */
      setStatus({ message: "Listing already exists", type: "error" });
      form.reset();
      setSelectedPropertyId("");
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    }
  }

  async function addListingToDb(newListing: any) {
    if (!db) {
      setStatus({ message: "Database not initialized.", type: "error" });
      return;
    }
    try {
      await db.insert(listingsTable).values(newListing);
      setStatus({ message: `Listing successfully added.`, type: "success" });

      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    } catch (error) {
      console.error("Database insert error:", error);
      setStatus({ message: "Error adding listing", type: "error" });
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h1 className="pb-3 font-bold text-2xl"> Add Listing</h1>
      <label className="my-2">
        Listing name:
        <input
          type="text"
          name="listingName"
          className="bg-gray-100 mx-4"
          required
        />
      </label>
      <label className="my-2">
        Property:
        <select
          name="propertyId"
          id="propertyDropdown"
          className="mx-4 bg-gray-100"
          required
          value={selectedPropertyId === "" ? "" : String(selectedPropertyId)}
          onChange={(e) => {
            let val = e.target.value;
            setSelectedPropertyId(val === "" ? "" : val);
          }}
        >
          <option value="">Select property</option>

          {propertiesData.length === 0
            ? null
            : propertiesData.map((p) => {
                const label =
                  p.propertyName?.trim() || `Property #${p.propertyId} `;
                return (
                  <option key={p.propertyId} value={p.propertyId}>
                    {label}
                  </option>
                );
              })}
        </select>
      </label>

      <button className="border p-2" type="submit">
        Submit
      </button>
      {status && (
        <p
          className={
            status.type === "success" ? "text-green-600" : "text-red-600"
          }
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
