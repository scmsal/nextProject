import { useDb } from "@/lib/db/providers";
import { FormEvent, useState } from "react";
import { properties } from "@/lib/db/schema";
import { Property } from "@/types";

export function PropertiesForm() {
  const { db } = useDb();
  const [status, setStatus] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    for (const [key, value] of formData.entries())
      console.log(`${key}: ${value}`);

    const cleaned = {
      propertyName: (formData.get("propertyName") as string)?.trim() || "",
      address: (formData.get("address") as string)?.trim() || "",
      town: (formData.get("town") as string)?.trim() || "",
      county: (formData.get("county") as string)?.trim() || "",
    };

    await addPropertyToDb(cleaned);
    form.reset();
    /*TO DO: eventually use toast library or UI framework for toast. Use a small toast library (react-hot-toast, sonner, react-toastify) or  UI framework’s built-in (e.g. NextUI, Radix, or MUI Snackbar). Trigger it after the insert resolves:
            toast.success("Property successfully added");
    */
    setStatus(`Property successfully added.`);
    setTimeout(() => setStatus(""), 2000);
  }

  async function addPropertyToDb(cleaned: any) {
    if (!db) {
      setStatus("Database not initialized.");
      return;
    }
    await db.insert(properties).values(cleaned);
    //TO DO: handle error status
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h1 className="pb-3 font-bold text-2xl"> Add Property</h1>
      <label className="my-2">
        Property name:
        <input
          type="text"
          name="propertyName"
          className="bg-gray-100 mx-4"
          required
        />
      </label>
      <label className="my-2">
        County:
        <select name="county" className="mx-4 bg-gray-100" required>
          <option value="Suffolk">Suffolk</option>
          <option value="Nassau">Nassau</option>
        </select>
      </label>
      <label className="my-2">
        Street address
        <input type="text" name="address" className="bg-gray-100 mx-4" />
      </label>
      <label className="my-2">
        City/Town
        <input type="text" name="town" className="bg-gray-100 mx-4" required />
      </label>
      <label className="my-2">
        Zip code <input type="text" name="zip" className="bg-gray-100 mx-4" />
      </label>
      <button className="border p-2" type="submit">
        Submit
      </button>
      {status && <p className="text-green-600">{status}</p>}
    </form>
  );
}
