import type { Metadata } from "next";

import "./styles/globals.css";
import { DbProvider } from "@/lib/db/dbContext";
//Added with installation of Roboto font for Material UI
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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
        <DbProvider>{children}</DbProvider>
      </body>
    </html>
  );
}
