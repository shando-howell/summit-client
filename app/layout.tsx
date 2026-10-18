import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


export const metadata: Metadata = {
  title: "Summit",
  description: "Finance Ledger application with a serverless architecture.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900
        dark:text-white antialiased">
          <Navbar />
          <main className="grow pt-16">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
