import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Tax ID Checker",
  description: "Validate corporate tax identification numbers across 131 countries",
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
