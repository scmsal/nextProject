"use client";

import AggregateSummaries from "../components/data/AggregateSummaries";
import RevenueAggregatesTable from "../components/tables/AggregateTable";
import { useDb } from "@/lib/db/dbContext";

export default function SummariesPage() {
  const { revenueAggregatesData } = useDb();

  return (
    <div>
      <h3 className="underline text-secondary">Step 3: Calculate summaries</h3>
      <div className="flex flex-col">
        <AggregateSummaries />
        <RevenueAggregatesTable data={revenueAggregatesData} />
      </div>
    </div>
  );
}
