import { sourceMapsEnabled } from "process";

const { db } = require("./dbContext");
export const sampleTransactions = [
  {
    date: "2022-01-01",
    arrivalDate: "2022-01-02",
    type: "hotel",
    confirmationCode: "CONF123",
    bookingDate: "2022-01-01",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    shortTerm: "yes",
    nights: 1,
    guest: "Jane Doe",
    listing: "Hotel XYZ",
    details: "Test booking",
    amount: 100,
    paidOut: 90,
    serviceFee: 10,
    fastPayFee: 5,
    cleaningFee: 5,
    grossEarnings: 100,
    totalOccupancyTaxes: 10,
    earningsYear: 2022,
    countyTax: 5,
    stateTax: 5,
    sourceFile: "sample1.csv",
  },
];

// Add sample data for properties and listings
