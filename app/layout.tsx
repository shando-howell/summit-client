import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Finance Ledger | Serverless",
  description: "Finance Ledger application with a serverless architecture.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
