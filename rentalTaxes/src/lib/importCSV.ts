import Papa from "papaparse";

// Define a type for a single CSV row
//TODO: CONVERT STRINGS TO NUMERIC/BOOLEAN WHERE APPLICABLE?
export interface RawCsvRow {
  Date?: string;
  "Arriving by date"?: string;
  Type?: string;
  "Confirmation code"?: string;
  "Booking date"?: string;
  "Start date"?: string;
  "End date"?: string;
  Nights?: string;
  "Short Term"?: string;
  Guest?: string;
  Listing?: string;
  Details?: string;
  "Reference code"?: string;
  Amount?: string;
  "Paid out"?: string;
  "Service fee"?: string;
  "Cleaning fee"?: string;
  "Gross earnings"?: string;
  "Occupancy taxes"?: string;
  "Earnings year"?: string;
  // countyTax?: null; //TODO DO: THIS WILL BE A CALCULATED FIELD
  // stateTax?: null; //TODO DO: THIS WILL BE A CALCULATED FIELD
}

// pure data parser, no DB access
export async function parseCsvFile(file: File) {
  const results = await new Promise<{ data: RawCsvRow[]; errors: any[] }>(
    (resolve, reject) => {
      Papa.parse<RawCsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: resolve,
        error: reject,
      });
    }
  );

  // Normalize & clean data

  const cleaned = results.data.map((row) => ({
    date: row["Date"] ?? "",
    arrivalDate: row["Arriving by date"] ?? "",
    type: row["Type"] ?? "",
    confirmationCode: row["Confirmation code"] ?? "",
    bookingDate: row["Booking date"] ?? "",
    startDate: row["Start date"] ?? "",
    endDate: row["End date"] ?? "",
    shortTerm: row["Short Term"] ?? "",
    nights: parseInt(row["Nights"] || "0"),
    guest: row["Guest"] ?? "",
    listing: row["Listing"] ?? "",
    details: row["Details"] ?? "",
    amount: parseFloat(row["Amount"] || "0"),
    paidOut: parseFloat(row["Paid out"] || "0"),
    serviceFee: parseFloat(row["Service fee"] || "0"),
    cleaningFee: parseFloat(row["Cleaning fee"] || "0"),
    grossEarnings: parseFloat(row["Gross earnings"] || "0"),
    totalOccupancyTaxes: parseFloat(row["Occupancy taxes"] || "0"),
    earningsYear: parseInt(row["Earnings year"] || "0"),
    countyTax: null,
    stateTax: null,
  }));

  return cleaned;
}
