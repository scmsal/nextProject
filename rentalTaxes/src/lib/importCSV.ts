import Papa from "papaparse";

// Define a type for a single CSV row
//TODO: CONVERT STRINGS TO NUMERIC/BOOLEAN WHERE APPLICABLE?
export interface RawTransactionsCsv {
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

export interface RawPropertiesCsv {
  propertyName?: string;
  address?: string;
  town?: string;
  county?: string;
}

export interface RawListingsCsv {
  listingName?: string;
  propertyId: number;
}

// pure data parser, no DB access
export async function parseTransactionsCsvFile(file: File) {
  const results = await new Promise<{
    data: RawTransactionsCsv[];
    errors: any[];
  }>((resolve, reject) => {
    Papa.parse<RawTransactionsCsv>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });

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
    listingName: row["Listing"] ?? "", // Normalize here? row["Listing"].trim().toLowerCase()
    listingId: null,
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

export async function parsePropertiesCsvFile(file: File) {
  const results = await new Promise<{
    data: RawPropertiesCsv[];
    errors: any[];
  }>((resolve, reject) => {
    Papa.parse<RawPropertiesCsv>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });
  // Normalize & clean data

  const cleaned = results.data.map((row) => ({
    propertyName: row["propertyName"] ?? "",
    address: row["address"] ?? "",
    town: row["town"] ?? "",
    county: row["county"] ?? "",
  }));
  return cleaned;
}

export async function parseListingsCsvFile(file: File) {
  const results = await new Promise<{
    data: RawListingsCsv[];
    errors: any[];
  }>((resolve, reject) => {
    Papa.parse<RawListingsCsv>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });
  // Normalize & clean data

  const cleaned = results.data.map((row) => ({
    listingName: row["listingName"] ?? "",
    propertyId: row["propertyId"] ?? null,
  }));
  return cleaned;
}
