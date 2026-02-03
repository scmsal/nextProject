"use client";

import AggregateSummaries from "../components/data/AggregateSummaries";
import RevenueAggregatesTable from "../components/tables/AggregateTable";
import { useDb } from "@/lib/db/dbContext";
import BackLink from "../components/BackLink";

export default function SummariesPage() {
  const { revenueAggregatesData } = useDb();

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="ps-2 text-secondary underline ">
          Step 3: Calculate summaries
        </h3>
        <BackLink slug="transactions" contents="Step 2: Manage transactions" />
      </div>

      <div className="flex flex-col">
        <AggregateSummaries />
        <RevenueAggregatesTable data={revenueAggregatesData} />
      </div>
    </div>
  );
}
