import Dexie from "dexie";

export const db = new Dexie("financialDB");

// Define your object stores and indexes
db.version(1).stores({
  transactions:
    "++id,date,arrivalDate,type,confirmationCode,bookingDate,startDate,endDate,nights,shortTerm,guest,listing,details,amount,paidOut,serviceFee,fastPayFee,cleaningFee,grossEarnings,totalOccupancyTaxes,earningsYear,countyTax,stateTax", // primary key + indexed fields
  properties: "++id,address,town,listingId,listingNames",
  quarterly:
    "++id,monthYear,qIncome,qCleaningExternal,qCleaningInternal,qRefund,qReimburse,qStateTaxes,qCountyTaxes,qServiceFees,qFastPayFees,qNetIncome",
  yearly:
    "++id,yearlyIncome,yearlyCleaningExternal,yearlyCleaningInternal,yearlyTaxes,yearlyServiceFees,yearlyFastPayFees,yearlyNetIncome,yearNetIncome",
});
