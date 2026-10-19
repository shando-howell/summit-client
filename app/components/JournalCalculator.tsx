'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type EntryType = 'debit' | 'credit';

interface JournalLine {
    id: string;
    account: string;
    amountRaw: string; // The string typed by the user (e.g., "150.50")
    amountCents: number; // The integer used for safe math (e.g. 15050)
    type: EntryType;
}

interface Account {
    id: string;
    name: string;
    category: string;
}

interface JournalCalculatorProps {
    accounts: Account[];
}

// Utility functions for safe currency math
const toCents = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100);
};

const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
}

export default function JournalCalculator({ accounts }: JournalCalculatorProps) {
    const { getToken } = useAuth();
    const router = useRouter();

    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    const [lines, setLines] = useState<JournalLine[]>([
        { id: '1', account: '', amountRaw: '', amountCents: 0, type: 'debit' },
        { id: '2', account: '', amountRaw: '', amountCents: 0, type: 'credit' }
    ]);

    // Derived state: Calculates perfectly every time 'lines' changes
    const { totalDebits, totalCredits, isBalanced, difference, hasEmptyAccounts } = useMemo(() => {
        let debits = 0;
        let credits = 0;
        let emptyAccs = false;

        lines.forEach((line) => {
            if (line.type === 'debit') debits += line.amountCents;
            if (line.type === 'credit') credits += line.amountCents;
            if (!line.account) emptyAccs = true;
        });

        return {
            totalDebits: debits,
            totalCredits: credits,
            isBalanced: debits > 0 && debits === credits,
            difference: Math.abs(debits - credits),
            hasEmptyAccounts: emptyAccs,
        }
    }, [lines]);

    const addLine = () => {
        const newId = Math.random().toString(36).substring(7);
        setLines([...lines, { id: newId, account: '', amountRaw: '', amountCents: 0, type: 'debit' }]);
    }

    const updateLine = (id: string, field: keyof JournalLine, value: string) => {
        setLines(lines.map(line => {
            if (line.id !== id) return line;

            const updatedLine = { ...line, [field]: value };
            // If they changed the amount, immediately recalculate the cents integer
            if (field === 'amountRaw') {
                updatedLine.amountCents = toCents(value);
            }
            return updatedLine as JournalLine;
        }));
    };

    const removeLine = (id: string) => {
        if (lines.length <= 2) return; // Keep at least 2 lines
        setLines(lines.filter(line => line.id !== id));
    };

    // The Network Request Function
    const submitTransaction = async () => {
        if (!isBalanced || hasEmptyAccounts) return;

        setIsSubmitting(true);
        setStatusMessage({ text: '', type: '' });

        try {
            // Grab the JWT from the active Clerk session
            const token = await getToken();

            const payload = {
                description: description || 'Manual Journal Entry',
                entryDate: new Date().toISOString(),
                lines: lines.map(line => ({
                    accountId: line.account,
                    type: line.type,
                    amountCents: line.amountCents
                }))
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to post transaction.');
            }

            setStatusMessage({ text: 'Transaction successfully posted!', type: 'success' });

            // Reset form on success
            setDescription('');
            setLines([
                { id: '1', account: '', amountRaw: '', amountCents: 0, type: 'debit' },
                { id: '2', account: '', amountRaw: '', amountCents: 0, type: 'credit' },
            ]);

            router.refresh();
        } catch (error) {
            console.error(error);
            setStatusMessage({ text: `${error}`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border
        border-slate-200 dark:border-slate-800">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Journal Entry</h2>
                <button onClick={addLine} className="text-sm font-medium text-blue-600 dark:text-blue-400
                hover:underline">
                    + Add Line
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Transaction Description (e.g., Bought office supplies)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800
                    border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
            </div>

            {/* Entry Rows */}
            <div className="space-y-4 mb-8">
                {lines.map((line, index) => (
                    <div key={line.id} className="flex gap-4 items-start">
                        <select
                            value={line.type}
                            onChange={(e) => updateLine(line.id, 'type', e.target.value)}
                            className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300
                            dark:border-slate-700"
                        >
                            <option value="debit">Debit</option>
                            <option value="credit">Credit</option>
                        </select>

                        <select
                            value={line.account}
                            onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                            className="flex-1 p-2 border rounded-lg bg-slate-50 dark:bg-slate-800
                            border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        >
                            <option value="" disabled>Select an Account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.id} - {acc.name}
                                </option>
                            ))}
                        </select>

                        <input 
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={line.amountRaw}
                            onChange={(e) => updateLine(line.id, 'amountRaw', e.target.value)}
                            className="w-32 p-2 border rounded-lg bg-slate-50 dark:bg-slate-800
                            border-slate-300 dark:border-slate-700 text-right"
                        />

                        <button
                            onClick={() => removeLine(line.id)}
                            disabled={lines.length <= 2}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg disabled:opacity-50"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>

            {/* Balance Summary Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="flex justify-between itemns-center mb-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-slate-500">Total Debits: <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(totalDebits)}</span></p>
                        <p className="text-slate-500">Total Credits: <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(totalCredits)}</span></p>
                    </div>

                    <div className={`text-right ${isBalanced ? 'text-emerald-500' : 'text-amber-500'}`}>
                        <p className="font-bold">
                            {isBalanced ? 'Balanced' : 'Out of Balance'}
                        </p>
                        {!isBalanced && (
                            <p className="text-sm font-mono">Diff: {formatCurrency(difference)}</p>
                        )}
                    </div>
                </div>

                {statusMessage.text && (
                    <div className={`mb-4 p-3 rounded text-sm ${
                        statusMessage.type === 'success' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'}`}
                    >
                        {statusMessage.text}
                    </div>
                )}

                <button
                    onClick={submitTransaction}
                    disabled={!isBalanced || isSubmitting}
                    className="w-full py-3 rounded-lg font-bold text-white transition-colors bg-blue-600
                    hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Posting...' : 'Post Transaction to Ledger'}
                </button>
            </div>
        </div>
    );
}