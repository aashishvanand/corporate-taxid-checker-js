import type { Metadata } from "next";
import { getSupportedCountries } from "corporate-taxid-checker-js";

// Derived from the library so the count never drifts from what it supports
const countryCount = getSupportedCountries().length;

export const metadata: Metadata = {
  title: "Corporate Tax ID Checker",
  description: `Validate corporate tax identification numbers across ${countryCount} countries`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
