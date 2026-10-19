import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
     <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
      Precision <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
        Accounting
      </span>
     </h1>
     <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10">
      A serverless double-entry ledger system built for financial integrity.
     </p>
     <div className="flex gap-4">
      <button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium
      transition-colors">
        <Link href="/dashboard">
          Dashboard
        </Link>
      </button>
     </div>
    </div>
  );
}
