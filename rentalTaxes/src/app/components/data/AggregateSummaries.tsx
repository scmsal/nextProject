import { useDb } from "@/lib/db/dbContext";
import { FormEvent, useState } from "react";
import { Button } from "@heroui/react";
import DateFilterForm from "../forms/DateFilterForm";
import FilterButtons from "./FilterButtons";
import RevenueAggregatesTable from "../tables/AggregateTable";
import Papa from "papaparse";

export default function AggregateSummaries() {
  const { loadRevenueAggregates, transactionsData, revenueAggregatesData } =
    useDb();

  const [fromDate, setFromDate] = useState(""); //inclusive when set as new Date inside function
  const [toDate, setToDate] = useState(""); //default for input form and display
  const [fromDateInclusive, setFromDateInclusive] = useState(""); //REMOVE, SOLVED BY NEW DATE
  const [toExclNxtMth, setToExclNxtMth] = useState("");
  // const [toDateInclusive, setToDateInclusive] = useState("");

  const handleAggregate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await loadRevenueAggregates({
      fromDate,
      fromDateInclusive,
      toDate,
      toExclNxtMth,
      setToExclNxtMth,
    });
    // setFromDate("");
    // setToDate("");
    // setFromDateInclusive("");
    // setToExclNxtMth("");
  };

  return (
    <>
      <ul className="mb-4">
        <li>
          Quarterly filing: Filing for Suffolk County hotel and motel occupancy
          taxes must be postmarked by the 20th day of March, June, September and
          December.
        </li>
        <li>{`Short term (ST) stays`}: less than 30 nights</li>
        <li>{`Long term (LT) stays`}: 30 or more nights</li>
      </ul>

      <form onSubmit={handleAggregate} className="flex flex-col">
        <DateFilterForm
          fromDate={fromDate}
          toDate={toDate}
          setFrom={setFromDate}
          setTo={setToDate}
          setFromInclusive={setFromDateInclusive} //REMOVE
          setToExclNxtMth={setToExclNxtMth}
        />

        <Button type="submit" className="border py-2 px-4 w-2/5 mb-4">
          Calculate aggregates
        </Button>

        <FilterButtons
          data={transactionsData}
          from={fromDate}
          to={toDate}
          setFrom={setFromDate}
          setTo={setToDate}
          loadAggregate={loadRevenueAggregates}
          setToExclNxtMth={setToExclNxtMth}
        />
      </form>
    </>
  );
}
