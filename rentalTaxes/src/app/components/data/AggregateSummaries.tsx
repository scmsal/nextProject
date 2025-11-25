import { useDb } from "@/lib/db/providers";
import { FormEvent } from "react";

export default function AggregateSummaries() {
  const { loadRevenueAggregates } = useDb();

  // const [startFilterDate, setStartFilterDate] = useState<string>("");
  // const [endFilterDate, setEndFilterDate] = useState<string | "">("");

  // async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const form = e.target as HTMLFormElement;
  //   const formData = new FormData(form);
  //   //debugging
  //   for (const [key, value] of formData.entries())
  //     console.log(`${key}: ${value}`);
  // }

  const handleAggregate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    console.log("handleAggregate clicked");
    let rawFromDate = formData.get("startFilter");
    let rawToDate = formData.get("endFilter");
    await loadRevenueAggregates({
      fromDate: rawFromDate ? String(rawFromDate) : undefined,
      toDate: rawToDate ? String(rawToDate) : undefined,
    });
  };
  return (
    <form onSubmit={handleAggregate} className="flex flex-col">
      <div className="mb-4">
        <label htmlFor="startFilter">
          From
          <input
            type="date"
            id="startFilter"
            name="startFilter"
            className="ml-2 border"
          />
        </label>
        <label htmlFor="endFilter" className="ml-4">
          To
          <input
            type="date"
            id="endFilter"
            name="endFilter"
            className="ml-2 border"
          />
        </label>
      </div>

      <button type="submit" className="border py-2 px-4 w-2/5 mb-4">
        Calculate aggregates
      </button>
    </form>
  );
}
