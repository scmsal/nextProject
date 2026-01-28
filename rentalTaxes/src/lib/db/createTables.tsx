//TODO: enums for the "type" property (e.g reservation, refund)

import { PGlite } from "@electric-sql/pglite";

export const CREATE_TRANSACTIONS_TABLE = `
     CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
        date VARCHAR(50),
        arrival_date VARCHAR(50),
        type VARCHAR(50),
        confirmation_code VARCHAR(50),
        booking_date VARCHAR(50),
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        short_term VARCHAR(50),
        nights INTEGER,
        guest VARCHAR(255),
        listing VARCHAR(255),
        details TEXT,
        amount NUMERIC,
        paid_out NUMERIC,
        service_fee NUMERIC,
        fast_pay_fee NUMERIC,
        cleaning_fee NUMERIC,
        gross_earnings NUMERIC,
        total_occupancy_taxes NUMERIC,
        earnings_year INTEGER,
        county_tax NUMERIC,
        state_tax NUMERIC,
        source_file TEXT,
        uploaded_at TIMESTAMP
      );
  `;

export const CREATE_PROPERTIES_TABLE = `
   CREATE TABLE IF NOT EXISTS properties(
   id SERIAL PRIMARY KEY,
     address varchar(255),
     town varchar(100),
     listings varchar(255)
   );
  `;

export const CREATE_QUARTERLY_TABLE = `
   CREATE TABLE IF NOT EXISTS quarterly(
   id SERIAL PRIMARY KEY,
       monthYear varchar(20),
       totalRevenue numeric,
       qCleaningExternal numeric,
       qCleaningInternal numeric,
       qRefund numeric,
       qReimburse numeric,
       total30Plus numeric,
       totalShortTerm numeric
   );
  `;
