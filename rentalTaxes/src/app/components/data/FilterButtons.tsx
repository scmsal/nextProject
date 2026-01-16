import { Transaction } from "@/types";
import { useEffect, useState } from "react";

interface FilterButtonsProps {
  data: Transaction[];
  from: string;
  to: string;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  setTo: React.Dispatch<React.SetStateAction<string>>;
  setToExclNxtMth: React.Dispatch<React.SetStateAction<string>>;
  loadAggregate: (params: {
    fromDate: string;
    fromDateInclusive: string;
    toDate: string;
    toExclNxtMth: string;
    setToExclNxtMth: (val: string) => void;
  }) => Promise<void>;
}

export default function FilterButtons({
  data,
  from,
  to,
  setFrom,
  setTo,
  setToExclNxtMth,
  loadAggregate,
}: FilterButtonsProps) {
  type Quarter = 0 | 1 | 2 | 3 | 4;
  const currentYear = new Date().getFullYear();

  const [selectedQuarter, setSelectedQuarter] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  //TO DO: maybe abstract this function so it can be reused for the transactions table
  let minYear: number;
  let maxYear: number;
  let noData = false;

  if (data.length === 0) {
    minYear = currentYear;
    maxYear = new Date().getFullYear();
    noData = true;
    console.log("minYear, maxYear:", minYear, maxYear);
  } else {
    const result = data.reduce(
      (acc, t) => {
        const y = new Date(t.date).getFullYear();
        return {
          minYear: y < acc.minYear ? y : acc.minYear,
          maxYear: y > acc.maxYear ? y : acc.maxYear,
          //Learning note: The reduce callback returns the new accumulator, no explicit assignment.
        };
      },
      { minYear: Infinity, maxYear: -Infinity }
    );

    minYear = result.minYear;
    maxYear = result.maxYear;
  }

  const years: number[] =
    data.length === 0
      ? [currentYear]
      : Array.from(
          { length: currentYear - minYear + 1 },
          (_, i) => minYear + i
        );

  interface QuarterRange {
    startMonth: number;
    endMonth: number;
    text: string;
  }

  const quarterRanges: { [Q in Quarter]: QuarterRange } = {
    0: { startMonth: 0, endMonth: 11, text: "Jan - Dec" },
    1: { startMonth: 11, endMonth: 1, text: "Q1 Dec - Feb" },
    2: { startMonth: 2, endMonth: 4, text: "Q2 Mar - May" },
    3: { startMonth: 5, endMonth: 7, text: "Q3 Jun - Aug" },
    4: { startMonth: 8, endMonth: 10, text: "Q4 Sep - Nov" },
  };

  function getCustomQuarter(date: Date) {
    const m = date.getMonth(); // 0–11
    const y = date.getFullYear();

    if (m === 11) return { quarter: 1, quarterYear: y + 1 }; // Dec → next year's Q1
    if (m === 0 || m === 1) return { quarter: 1, quarterYear: y }; // Jan–Feb

    if (m >= 2 && m <= 4) return { quarter: 2, quarterYear: y }; // Mar–May
    if (m >= 5 && m <= 7) return { quarter: 3, quarterYear: y }; // Jun–Aug
    return { quarter: 4, quarterYear: y }; // Sep–Nov
  }
  function getCalendarYearRange(year: number) {
    const startMonth = 0;
    const startYear = year;
  }

  function getQuarterRange(quarter: Quarter, year: number) {
    const { startMonth, endMonth } = quarterRanges[quarter];
    const startYear = startMonth === 11 ? year - 1 : year;
    const endYear = year;
    // const endDay = new Date(endYear, endMonth).getDate();

    //const start = new Date(startYear, startMonth, 1, 0, 0, 0, 0).toISOString();
    // const end   = new Date(endYear, endMonth + 1, 1, 0, 0, 0, 0).toISOString(); // first day of next month

    /*TO FIX: start and end are returning the date in the wrong format. The specified value "Sun Dec 01 2024 00:00:00 GMT-0500 (Eastern Standard Time)" does not conform to the required format, "yyyy-MM-dd".*/
    const start = new Date(startYear, startMonth, 1);
    const end = new Date(endYear, endMonth + 1, 1); //next month start
    let toDisplay = end;
    //Change start and end dates from "Sun Dec 01 2024 00:00:00 GMT-0500 (Eastern Standard Time)" format to "yyyy-MM-dd".
    const formattedStart = start.toISOString().slice(0, 10);
    const formattedEnd = end.toISOString().slice(0, 10); //next month start
    console.log("start: " + formattedStart + " end:", formattedEnd);
    setFrom(formattedStart);
    setToExclNxtMth(formattedEnd);
    //TO DO: finish connecting this to the "Displaying figures from...dates"
    toDisplay.setDate(toDisplay.getDate() - 1);

    //TO DO: see if I really need to return these or if it's appropriate to just set the state instead. Evaluate whether this function will be reused to just reurn the dates without changing state. Also double check the desired type for the returned variables.
    return { formattedStart, formattedEnd };
  }

  //quarters buttons
  let isActiveQ = ({ quarter }: { quarter: string }) => {
    return quarter ? quarter === String(selectedQuarter) : undefined;
  };

  let isActiveY = ({ year }: { year: number }) => {
    return year ? year === selectedYear : undefined;
  };

  useEffect(() => {}, [selectedQuarter, selectedYear]);

  //TO DO: make a clear filters button
  return (
    <div>
      {/* <button
        className={`py-1 px-2 mb-4 ${
          isActiveQ({ quarter })
            ? "font-bold hover:text-gray-700 border-b "
            : " text-gray-600 hover:text-gray-900 "
        }`}
        onClick={() => {
          setSelectedQuarter(Number(quarter));
        }}
      >
        {info.text}
      </button> */}

      {/* TO DO : figure out how to deal with calendar year vs Airbnb custom filing year */}
      {/* <label htmlFor="year" className="mr-4">
        Filing year
      </label> */}
      <select
        name="year"
        value={selectedYear ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          console.log("Selected year:", selectedYear);
          console.log("Selected val:", val, typeof val);
          setSelectedYear(Number(val));
          // setSelectedYear(val === "" ? null : Number(val));
          console.log("Selected year:", selectedYear);
        }}
        className="bg-field-on-background"
      >
        <option value="">All years</option>
        {years.map((y) => {
          return (
            <option
              key={y}
              value={y}
              className={isActiveY({ year: y }) ? "font-bold" : ""}
            >
              {y}
            </option>
          );
        })}
      </select>
      {Object.entries(quarterRanges).map(([quarter, info]) => (
        <button
          key={quarter}
          className={`py-1 px-2 mb-4 ${
            isActiveQ({ quarter })
              ? "font-bold hover:text-gray-700 border-b "
              : " text-gray-600 hover:text-gray-900 "
          }`}
          onClick={() => {
            const q = Number(quarter);
            setSelectedQuarter(q);
            console.log();
            getQuarterRange(q as Quarter, selectedYear);
          }}
        >
          {info.text}
        </button>
      ))}
      {/* <button
        className="shadow p-2 ml-2"
        onClick={() => {
          loadAggregate({ fromDate: from, toDate: to });
        }}
      >
        Apply filter
      </button> */}

      {/* TO DO: make the following text only show when the table is populated */}
      {
        // <p>
        //   <span> Displaying figures for </span>
        //   <span className="font-bold">
        //     {/* {`${quarterRanges[selectedQuarter as Quarter].text}`} {selectedYear} */}
        //     {`${from} to ${to}`}
        //   </span>
        // </p>
      }
    </div>
  );
}
