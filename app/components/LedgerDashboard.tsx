"use client";

import { useState, useEffect } from "react";

type Account = {
 id: string;
 name: string;
 type: string;
};

type Balance = Account & {
    total_debits: string;
    total_credits: string;
    balance: string;
}

export default function LedgerDashboard() {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [debitAccount, setDebitAccount] = useState("");
    const [creditAccount, setCreditAccount] = useState("");
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [balances, setBalances] = useState<Balance[]>([]);

    const fetchData = async () => {
        try {
            const [accRes, balRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/balances`)
            ]);
            if (accRes.ok) setAccounts(await accRes.json());
            if (balRes.ok) setBalances(await balRes.json());
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
        }
    };

    // Fetch acounts payload when the component mounts
    useEffect(() => {
        setInterval(() => {
            fetchData();
        }, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            description,
            entries: [
                { accountId: debitAccount, type: "debit", amount: parseFloat(amount) },
                { accountId: creditAccount, type: "credit", amount: parseFloat(amount) }
            ]
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Success! Transaction ID: ${data.transactionId}`);
                // Reset form
                setDescription("");
                setAmount("");
                setDebitAccount("");
                setCreditAccount("");
                // Refresh the balances table immediately after success
                fetchData();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error || 'Failed to post transaction.'}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to connect to the local API.");
        }
    };

    // Helper function to format currency
    const formatMoney = (val: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(val));
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Summit</h1>      

                {/* Transaction Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-6">Post New Transactions</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Description and Amount */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="Founder Investment"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="10000.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Double Entry Split */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <label className="block text-sm font-medium text-green-800 mb-1">Debit (Receiving)</label>
                                <select
                                    required
                                    className="w-full border-gray-200 rounded-lg outline-none text-gray-600"
                                    value={debitAccount}
                                    onChange={(e) => setDebitAccount(e.target.value)}
                                >
                                    <option value="">Select Account...</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name} ({acc.type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <label className="block text-sm font-medium text-red-800 mb-1">Credit (Source)</label>
                                <select
                                    required
                                    className="w-full border-gray-200 rounded-lg outline-none text-gray-600"
                                    value={creditAccount}
                                    onChange={(e) => setCreditAccount(e.target.value)}
                                >
                                    <option value="">Select Account...</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name} ({acc.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-500 transition-colors"
                        >
                            Post to Ledger
                        </button>
                    </form>
                </div>

                {/* Balances Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-6">Real-Time Account Balances</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 font-medium text-gray-600">Account</th>
                                    <th className="p-4 font-medium text-gray-600">Type</th>
                                    <th className="p-4 font-medium text-gray-600 text-right">Debits</th>
                                    <th className="p-4 font-medium text-gray-600 text-right">Credits</th>
                                    <th className="p-4 font-medium text-gray-600 text-right">Current Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {balances.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{b.name}</td>
                                        <td className="p-4 capitalize text-gray-600">{b.type}</td>
                                        <td className="p-4 text-right text-gray-600">{formatMoney(b.total_debits)}</td>
                                        <td className="p-4 text-right text-gray-600">{formatMoney(b.total_credits)}</td>
                                        <td className="p-4 text-right font-semibold text-gray-600">{formatMoney(b.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}