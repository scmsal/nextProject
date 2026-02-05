import type { Metadata } from "next";
import ClientShell from "./components/structure/ClientShell";

import "./styles/theme.css";
import { DbProvider } from "@/lib/db/dbContext";

export const metadata: Metadata = {
  title: "Rental Taxes",
  description: "Manage your short term rental finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
