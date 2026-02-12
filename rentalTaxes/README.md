# Rental Income Aggregation App

A privacy-first rental income tracking app built with **Next.js** that ingests CSV transaction data, models it in a relational schema, and generates financial summaries through structured client-side aggregation.

Designed to demonstrate frontend architecture, data modeling, and workflow clarity, as well as UI rendering.

## Status

Active development. This project is evolving with ongoing refinements to data modeling, validation logic, and aggregation rules.

Current limitations:
- Not all listing fields are editable
- Some workflows are iterative and subject to change
- Additional compliance calculations (e.g., 90+ day NY State threshold logic) are in progress

The repository reflects incremental improvements and architectural adjustments as requirements become more defined.

---

## Why This Project Is Relevant

Airbnb export data is structured as **one row per transaction, one listing per row**.

However, Suffolk County and potentially other New York county hotel and motel occupancy tax reporting requires:

- Aggregation by **property** (multiple listings grouped together)
- Totals segmented by **length of stay** (short-term: ≤29 days, long-term: ≥30 days)

This creates a real-world data modeling problem: transforming flat transactional data into regulatory-compliant summaries.

The application models and aggregates transaction data to support:

- Property-level rollups across multiple listings
- Stay-length segmentation for county tax reporting
- Future calculation of the **90+ day long-term stay threshold** required for NY State compliance and refund eligibility

---

## Stack

**Frontend**

- Next.js (App Router)
- React + TypeScript
- Context API for data orchestration
- TanStack Table
- HeroUI
- Lucide React

**Data**

- PGlite (in-browser Postgres)
- Drizzle ORM
- PapaParse (CSV ingestion)

---

## Core Architecture

### 1. Ingestion → Validation → Persistence

- CSV parsed client-side
- Records normalized and typed
- Stored in PGlite using a defined schema (Drizzle)

### 2. Controlled Data Fetching

- Data fetched once via Drizzle ORM
- Stored in React Context
- All subsequent aggregations computed client-side

This reduces database calls and simplifies state consistency.

### 3. Client-Side Aggregation Layer

Financial summaries (monthly totals, category breakdowns, net income) are computed using deterministic JavaScript transformations.

Reasoning:

- Minimizes DB round trips
- Keeps calculations predictable
- Avoids PGlite limitations around nested queries
- Maintains separation between persistence and analytics logic

---

## Features

- CSV upload + validation
- Typed relational schema
- Income categorization (short term vs long term)
- Quarterly, annual, and property-level aggregation
- Tabular financial summaries
- Local-only data processing

---

## Objectives

This project demonstrates:

- React architecture beyond component rendering
- Structured data modeling
- SQL fluency via schema design
- Workflow-driven UI state transitions
- Performance-conscious data fetching
- Privacy-first engineering decisions

---

## Tradeoffs

### Client-Side Aggregation Instead of Complex SQL

**Pros**

- Fewer DB calls
- Clear separation of concerns
- Easier debugging of financial logic
- Avoids nested-query limitations in PGlite

**Cons**

- Memory-bound for very large datasets
- Not optimized for multi-user scale

---

### Local-Only Database

**Pros**

- No external API dependency
- Full data ownership
- Offline-capable

**Cons**

- No cross-device sync
- Single-user scope

---

## Run Locally

```bash
npm install
npm run dev
```
