import Papa from "papaparse";
import { getDb } from "@/lib/db/pglite";

export async function importCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Ensure data has numeric amounts
          const cleaned = results.data.map((row) => ({
            // Dates
            date: row.date || "",
            bookingDate: row.bookingDate || "",
            payArriveByDate: row.payArriveByDate || "",
            startDate: row.startDate || "",
            endDate: row.endDate || "",

            // Booking & Listing Details
            type: row.type || "",
            confirmationCode: row.confirmationCode || "",
            guest: row.guest || "",
            listing: row.listing || "",
            details: row.details || "",
            nights: parseInt(row.nights) || 0,
            shortTerm: row.shortTerm || "",

            // Financials & Earnings
            amount: parseFloat(row.amount) || 0,
            paidOut: parseFloat(row.paidOut) || 0,
            grossEarnings: parseFloat(row.grossEarnings) || 0,
            earningsYear: parseInt(row.earningsYear) || 0,

            // Fees
            serviceFee: parseFloat(row.serviceFee) || 0,
            fastPayFee: parseFloat(row.fastPayFee) || 0,
            cleaningFee: parseFloat(row.cleaningFee) || 0,

            // Taxes
            totalOccupancyTaxes: parseFloat(row.totalOccupancyTaxes) || 0,
            countyTax: parseFloat(row.countyTax) || 0,
            stateTax: parseFloat(row.stateTax) || 0,
          }));
          await db.transactions.bulkAdd(cleaned);
          resolve(cleaned.length);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}
