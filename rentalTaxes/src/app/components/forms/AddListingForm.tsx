import { useDb } from "@/lib/db/providers";
import { FormEvent, useState, useEffect } from "react";
import { listings } from "@/lib/db/schema";
import { Listing, Property } from "@/types";

//Use typed status to make conditional styling possible
//TO DO: see if I need the same for UploadForm.tsx

//TO DO: use createListingKey and add propertyKey
//TO DO: clear property selection after submit
interface Status {
  message: string;
  type: "success" | "error" | "";
}
export function AddListingForm() {
  const { db, propertiesData } = useDb();

  const [status, setStatus] = useState<Status>({
    message: "",
    type: "",
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | "">("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    for (const [key, value] of formData.entries())
      console.log(`${key}: ${value}`);

    const cleaned = {
      listingName: (formData.get("listingName") as string)?.trim() || "",
      propertyId: formData.get("propertyId") || null,
    };

    await addListingToDb(cleaned);
    form.reset();
    /*TO DO: eventually use toast library or UI framework for toast. Use a small toast library (react-hot-toast, sonner, react-toastify) or  UI framework’s built-in (e.g. NextUI, Radix, or MUI Snackbar). Trigger it after the insert resolves:
            toast.success("Property successfully added");
    */
  }
  function isPgError(error: any): error is { code: string } {
    return typeof error?.code === "string";
  }

  async function addListingToDb(cleaned: any) {
    if (!db) {
      setStatus({ message: "Database not initialized.", type: "error" });
      return;
    }
    try {
      await db.insert(listings).values(cleaned);
      setStatus({ message: `Listing successfully added.`, type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    } catch (error: any) {
      //Postgres unique constraint violation
      if (isPgError(error) && error.code === "23505") {
        setStatus({
          message: "A listing with this name already exists.",
          type: "error",
        });
      } else {
        console.error("Database insert error:", error);
        setStatus({ message: "Error adding listing", type: "error" });
      }
    }
  }

  useEffect(() => {
    console.log("propertiesData", propertiesData);
  }, [propertiesData]);

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
          className="mx-4 bg-gray-100"
          required
          value={selectedPropertyId === "" ? "" : String(selectedPropertyId)}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedPropertyId(val === "" ? "" : Number(val));
          }}
        >
          <option value="">Select property</option>

          {propertiesData.length === 0
            ? null
            : propertiesData.map((p) => {
                const label =
                  p.propertyName?.trim() || `Property #${p.propertyKey} `;
                return (
                  <option key={p.propertyKey} value={p.propertyKey}>
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
