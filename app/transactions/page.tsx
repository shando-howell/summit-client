import { unstable_noStore as noStore } from 'next/cache';

interface TransactionLine {
    id: number;
    account_id: string;
    account_name: string;
    type: 'debit' | 'credit';
    amount_cents: number;
}

interface Transaction {
    id: number;
    description: string;
    entry_date: string;
    lines: TransactionLine[];
}

const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default async function TransactionsPage() {
    noStore();

    const txRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        cache: 'no-store',
    });

    const transactions: Transaction[] = txRes.ok ? await txRes.json() : [];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recent Transactions</h1>
            <p className="text-slate-500 mt-2">Review your recent transactions.</p>
            <div className="space-y-6">
                {transactions.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No transactions found.</p>
                ) : (
                    transactions.map((tx) => (
                        <div key={tx.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {/* Transaction Header */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-200 flex justify-between items-center">
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {tx.description}
                                </div>
                                <div className="text-sm text-slate-500 text-right">
                                    <p>{new Date(tx.entry_date).toLocaleString()}</p>
                                    <p className="text-xs font-mono mt-1">TX #{tx.id}</p>
                                </div>
                            </div>

                            {/* Transaction Lines (Debits and Credits) */}
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500">
                                        <th className="text-left p-3 font-medium">Account</th>
                                        <th className="text-right p-3 font-medium w-32">Debit</th>
                                        <th className="text-right p-3 font-medium w-32">Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tx.lines.map((line) => (
                                        <tr key={line.id} className="border-b bvorder-slate-50 dark:border-slate-800/50 last:border-0">
                                            <td className="p-3">
                                                <span className="font-mono text-xs text-slate-400 mr-2">{line.account_id}</span>
                                                <span className="text-slate-700 dark:text-slate-300">
                                                    {line.type === 'credit' ? <span className="ml-4">{line.account_name}</span> : line.account_name}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right text-slate-900 dark:text-white font-mono">
                                                {line.type === 'debit' ? formatCurrency(line.amount_cents) : ''}
                                            </td>
                                            <td className="p-3 text-right text-slate-900 dark:text-white font-mono">
                                                {line.type === 'credit' ? formatCurrency(line.amount_cents) : ''}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}