import JournalCalculator from "../components/JournalCalculator";

export const instant = false;

interface Account {
  id: string;
  name: string;
  category: string;
}

export default async function JournalPage() {
  // Fetch accounts on the server
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
    cache: 'no-store',
  });

  const accounts: Account[] = res.ok ? await res.json() : [];

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Journal</h1>
        <p className="text-slate-600 mt-2">Record a new double-entry transaction.</p>
      </div>
      <JournalCalculator accounts={accounts} />
    </div>
  )
}
