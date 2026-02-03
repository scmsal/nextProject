import { useDb } from "@/lib/db/dbContext";
import { FormEvent, useState } from "react";
import { Card } from "@heroui/react";
import FilterButtons from "./FilterButtons";

export default function AggregateSummaries() {
  const { loadRevenueAggregates, transactionsData, revenueAggregatesData } =
    useDb();

  const [fromDate, setFromDate] = useState(""); //inclusive when set as new Date inside function
  const [toDate, setToDate] = useState(""); //default for input form and display

  const handleAggregate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await loadRevenueAggregates({
      fromDate,
      toDate,
    });
  };
  return (
    <div>
      <Card className="mb-4">
        <ul>
          <li>
            <strong> Quarterly filing:</strong> Filing for Suffolk County hotel
            and motel occupancy taxes must be postmarked by the 20th day of
            March, June, September and December.
          </li>
          <li>
            <strong>{`Short term (ST) stays`}:</strong> less than 30 nights;
            taxable revenue for county occupancy taxes
          </li>
          <li>
            <strong>{`Long term (LT) stays`}: </strong>{" "}
            {`30+ nights (part of "Allowable deductions)"`}
          </li>
          <li>
            <strong>Total gross revenue:</strong> includes all reservations,
            fees, and adjustments included in the CSV file data. Payouts and
            resolution payouts are excluded.
          </li>
        </ul>
      </Card>
      <FilterButtons
        data={transactionsData}
        from={fromDate}
        to={toDate}
        setFrom={setFromDate}
        setTo={setToDate}
        loadAggregate={loadRevenueAggregates}
      />
    </div>
  );
}
