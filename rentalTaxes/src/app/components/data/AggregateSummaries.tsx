import { useDb } from "@/lib/db/dbContext";
import { FormEvent, useState } from "react";
import DateFilterForm from "../forms/DateFilterForm";

export default function AggregateSummaries() {
  const { loadRevenueAggregates } = useDb();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleAggregate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await loadRevenueAggregates({
      fromDate,
      toDate,
    });
  };

  return (
    <form onSubmit={handleAggregate} className="flex flex-col">
      <DateFilterForm
        fromDate={fromDate}
        toDate={toDate}
        setFrom={setFromDate}
        setTo={setToDate}
      />

      <button type="submit" className="border py-2 px-4 w-2/5 mb-4">
        Calculate aggregates
      </button>
    </form>
  );
}
