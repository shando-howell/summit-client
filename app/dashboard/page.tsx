import { currentUser } from '@clerk/nextjs/server';
import { unstable_noStore as noStore } from 'next/cache';

interface Account {
    id: string;
    name: string;
    category: string;
}

export default async function DashboardPage(){
    noStore();

    // Get the lobgged-in user from Clerk
    const user = await currentUser();

    // Fetch the accounts from the AWS API Gateway
    // We use 'no-store' so Next.js doesn't aggressively cache the database response
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        const errorData = await res.text();
        console.error("AWS API Failed:", res.status, errorData);
    }

    // If the fetch fails, default to an empty array so the page doesn't crash
    const accounts: Account[] = res.ok ? await res.json() : [];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {user?.firstName || 'Accountant'}
                </h1>
                <p className="text-slate-500 mt-2">Here is your current Chart of Accounts.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200
            dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Account ID</th>
                            <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Account Name</th>
                            <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-slate-400">
                                    No accounts found.
                                </td>
                            </tr>
                        ) : (
                            accounts.map((acc) => (
                                <tr key={acc.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50
                                dark:hover:bg-slate-800/50">
                                    <td className="p-4 font-mono text-sm text-slate-500 dark:text-slate-400">{acc.id}</td>
                                    <td className="p-4 font-medium text-slate-900 dark:text-white">{acc.name}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded 
                                        text-xs font-medium tracking-wide uppercase">
                                            {acc.category}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}