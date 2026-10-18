export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-80 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row 
            justify-between items-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    &copy; 2026 Summit. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                        Terms
                    </a>
                    <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                        Privacy
                    </a>
                </div>
            </div>
        </footer>
    );
}