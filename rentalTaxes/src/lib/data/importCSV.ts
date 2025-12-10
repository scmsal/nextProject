import Papa from "papaparse";
import {
  createListingId,
  createPropertyId,
  normalizeText,
} from "./normalization";
import { timeStamp } from "console";

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
}

export interface RawPropertiesCsv {
  name?: string;
  address?: string;
  town?: string;
  county?: string;
}

export interface RawListingsCsv {
  listing_name?: string;
  property_id: string;
}

export function parseDate(timestamp: string): Date {
  const parts = timestamp.trim().split("/");
  const monthIndex = Number(parts[0]) - 1;
  const dayNumber = Number(parts[1]);
  const yearNumber =
    Number(parts[2]) < 100 ? Number(parts[2]) + 2000 : Number(parts[2]);
  /*
See alternative:
function parseDateString(s: string): Date {
  // parse M/D/YY or M/D/YYYY safely
  const [m, d, y] = s.split("/").map(Number);
  const fullYear = y < 100 ? 2000 + y : y;
  return new Date(fullYear, m - 1, d);
}
*/

  const parsedDate = new Date(yearNumber, monthIndex, dayNumber);

  return parsedDate;
}

// pure data parser, no DB access
export async function parseTransactionsCsvFile(file: File) {
  const results = await new Promise<{
    data: RawTransactionsCsv[];
    errors: unknown[];
  }>((resolve, reject) => {
    Papa.parse<RawTransactionsCsv>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });

  // Normalize & clean data
  const cleaned = results.data.map((row) => {
    const dateRaw = row["Date"];
    const startDateRaw = row["Start date"];
    const endDateRaw = row["End date"];
    const arrivalDateRaw = row["Arriving by date"];
    const bookingDateRaw = row["Booking date"];

    if (!dateRaw) {
      throw new Error("Missing required Date field in CSV row.");
    } // TO DO: UI alert
    return {
      date: parseDate(dateRaw).toISOString(),
      arrivalDate: arrivalDateRaw
        ? parseDate(arrivalDateRaw).toISOString()
        : null,
      type: row["Type"] ?? "",
      confirmationCode: row["Confirmation code"] ?? "",
      bookingDate: bookingDateRaw
        ? parseDate(bookingDateRaw).toISOString()
        : null,
      startDate: startDateRaw ? parseDate(startDateRaw).toISOString() : null,
      endDate: endDateRaw ? parseDate(endDateRaw).toISOString() : null,
      shortTerm: row["Short Term"] ?? "",
      nights: parseInt(row["Nights"] || "0"),
      guest: row["Guest"] ?? "",
      listingName: row["Listing"] ?? "",
      // listingId: null,
      // propertyId: null,
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
    };
  });
  console.log("SNAPSHOT:", JSON.stringify(cleaned[0], null, 2));

  return cleaned;
}

export async function parsePropertiesCsvFile(file: File) {
  const results = await new Promise<{
    data: RawPropertiesCsv[];
    errors: unknown[];
  }>((resolve, reject) => {
    Papa.parse<RawPropertiesCsv>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });

  // Normalize, clean, and enrich data (add propertyId)

  const cleaned = results.data.map((row) => {
    const { name = "", address = "" } = row;
    const propertyId = createPropertyId(name, address);
    return {
      propertyName: row["name"] ?? "",
      address: row["address"] ?? "",
      propertyId,
      town: row["town"] ?? "",
      county: row["county"] ?? "",
    };
  });

  return cleaned;
}

export async function parseListingsCsvFile(file: File) {
  const results = await new Promise<{
    data: RawListingsCsv[];
    errors: unknown[];
  }>((resolve, reject) => {
    Papa.parse<RawListingsCsv>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    });
  });
  // Normalize & clean data

  const cleaned = results.data.map((row) => {
    const { listing_name = "", property_id: property_id = "" } = row;
    const listingId = createListingId(listing_name, property_id);
    return {
      listingName: row["listing_name"] ?? "",
      propertyId: row["property_id"],
      listingId,
    };
  });
  return cleaned;
}
