import Papa from "papaparse";
import { getDb } from "@/lib/db/client";
import { transactions, properties } from "@/lib/db/schema";

// Define a type for a single CSV row
//TODO: CONVERT STRINGS TO NUMERIC/BOOLEAN WHERE APPLICABLE?
interface CsvRow {
  date?: string;
  bookingDate?: string;
  payArriveByDate?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  confirmationCode?: string;
  guest?: string;
  listing?: string;
  details?: string;
  nights?: string;
  shortTerm?: string; //TODO: this will be a calculated field, if nights <= 30; convert to boolean?
  amount?: string;
  paidOut?: string;
  grossEarnings?: string;
  earningsYear?: string;
  serviceFee?: string;
  fastPayFee?: string;
  cleaningFee?: string; //TODO:ADD LOGIC FOR who gets the cleaning fee
  totalOccupancyTaxes?: string;
  countyTax?: string; //TODO DO: THIS WILL BE A CALCULATED FIELD
  stateTax?: string; //TODO DO: THIS WILL BE A CALCULATED FIELD
}

// The main import function
export async function importCsv(file: File): Promise<number> {
  const db = getDb();

  // Parse CSV asynchronously
  const results = await new Promise<{ data: CsvRow[]; errors: any[] }>(
    (resolve, reject) => {
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: resolve,
        error: reject,
      });
    }
  );

  // Normalize & clean data
  const cleaned = results.data.map((row) => ({
    date: row.date ?? "",
    bookingDate: row.bookingDate ?? "",
    payArriveByDate: row.payArriveByDate ?? "",
    startDate: row.startDate ?? "",
    endDate: row.endDate ?? "",
    type: row.type ?? "",
    confirmationCode: row.confirmationCode ?? "",
    guest: row.guest ?? "",
    listing: row.listing ?? "",
    details: row.details ?? "",
    nights: parseInt(row.nights || "0"),
    shortTerm: parseInt(row.nights || "0") <= 30 ? true : false,
    amount: parseFloat(row.amount || "0"),
    paidOut: parseFloat(row.paidOut || "0"),
    grossEarnings: parseFloat(row.grossEarnings || "0"),
    earningsYear: parseInt(row.earningsYear || "0"),
    serviceFee: parseFloat(row.serviceFee || "0"),
    fastPayFee: parseFloat(row.fastPayFee || "0"),
    cleaningFee: parseFloat(row.cleaningFee || "0"),
    totalOccupancyTaxes: parseFloat(row.totalOccupancyTaxes || "0"),
    countyTax: parseFloat(row.countyTax || "0"), //todo: this will be a calculated field. Set up county tax %
    stateTax: parseFloat(row.stateTax || "0"), //todo: this will be a calculated field; Set up state tax %
  }));

  // Insert into Drizzle / pglite

  await db.insert(transactions).values(cleaned);

  return cleaned.length;
}
