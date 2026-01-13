import { useDb } from "@/lib/db/dbContext";
import { FormEvent, useState } from "react";
import { propertiesDbTable } from "@/lib/db/schema";
import { Property, PropertyInsert } from "@/types";
import { createPropertyId } from "@/lib/data/normalization";
import { existsInDb } from "@/lib/db/queries";
import { Card, Button, Form } from "@heroui/react";

//Use typed status to make conditional styling possible
//TO DO: see if I need the same for UploadForm.tsx

interface Status {
  message: string;
  type: "success" | "error" | "";
}
export function AddPropertyForm() {
  const { db, loadProperties } = useDb();

  const [status, setStatus] = useState<Status>({
    message: "",
    type: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    //debugging
    for (const [key, value] of formData.entries())
      console.log(`${key}: ${value}`);

    const name = (formData.get("propertyName") as string)?.trim() || "";
    const address = (formData.get("address") as string)?.trim() || "";

    const propertyId = createPropertyId(name, address);
    const cleaned: Property = {
      propertyName: name,
      address: address,
      propertyId,
      town: (formData.get("town") as string)?.trim() || "",
      county: (formData.get("county") as string)?.trim() || "",
    };

    const exists = await existsInDb(
      db,
      propertiesDbTable,
      "propertyId",
      cleaned.propertyId
    );

    const uniqueCleaned = exists ? null : (cleaned as Property);

    if (uniqueCleaned) {
      await addPropertyToDb(uniqueCleaned);
      form.reset();
      await loadProperties();
    } else {
      /*TO DO: eventually use toast library or UI framework for toast. Use a small toast library (react-hot-toast, sonner, react-toastify) or  UI framework’s built-in (e.g. NextUI, Radix, or MUI Snackbar). Trigger it after the insert resolves:
            toast.success("Property successfully added");
    */
      setStatus({ message: "Property already exists", type: "error" });
      form.reset();
    }
  }

  async function addPropertyToDb(newProperty: PropertyInsert) {
    if (!db) {
      setStatus({ message: "Database not initialized.", type: "error" });
      return;
    }
    try {
      await db.insert(propertiesDbTable).values(newProperty);
      setStatus({ message: `Property successfully added.`, type: "success" });
      //TO DO: find out why the setTimeout isn't working. Maybe because it's not rerendering with the empty message?
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    } catch (error) {
      console.error("Database insert error:", error);
      setStatus({ message: "Error adding property", type: "error" });
      console.log("Before timeout", status);
      setTimeout(() => setStatus({ message: "", type: "" }), 2000);
      console.log("Inside timeout", status);
    }
  }

  return (
    <Card className="mt-0 min-h-[300px]!">
      <Form
        className="flex flex-col bg-surface text-surface-foreground"
        onSubmit={handleSubmit}
      >
        <h3>Add Property</h3>
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
          <input
            type="text"
            name="town"
            className="bg-gray-100 mx-4"
            required
          />
        </label>
        <label className="my-2">
          Zip code <input type="text" name="zip" className="bg-gray-100 mx-4" />
        </label>
        <Button
          className="border border-gray py-2 px-4 rounded-lg cursor-pointer bg-background"
          type="submit"
        >
          Submit
        </Button>
        {status && (
          <p
            id="status"
            className={
              status.type === "success" ? "text-green-600" : "text-red-600"
            }
          >
            {status.message}
          </p>
        )}
      </Form>
    </Card>
  );
}
