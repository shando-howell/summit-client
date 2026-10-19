'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Show, SignInButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md
        border-b border-gray-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="shrink-0">
                        <Link href="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                            Summit
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900
                        dark:text-slate-300 dark:hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/journal" className="text-sm font-medium text-slate-600 hover:text-slate-900
                        dark:text-slate-300 dark:hover:text-white transition-colors">
                            Journal Entry
                        </Link>
                        <Link href="/transactions" className="text-sm font-medium text-slate-600 hover:text-slate-900
                        dark:text-slate-300 dark:hover:text-white transition-colors">
                            Transactions
                        </Link>
                        
                        <div className="flex items-center space-x-4">
                            <Show when="signed-out">
                                <SignInButton mode="modal">
                                    <button>
                                        Sign In
                                    </button>
                                </SignInButton>
                            </Show>
                            <Show when="signed-in">
                                <UserButton />
                            </Show>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 dark:text-slate-300 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">
                                Dashboard
                            </Link>
                            <Link href="/journal" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">
                                Journal Entry
                            </Link>
                            <Link href="/transactions" className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300">
                                Transactions
                            </Link>
                            <div className="flex items-center space-x-4">
                                <Show when="signed-out">
                                    <SignInButton mode="modal">
                                        <button>
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </Show>
                                <Show when="signed-in">
                                    <UserButton />
                                </Show>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}