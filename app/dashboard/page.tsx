import Link from "next/link";
import LedgerDashboard from "../components/LedgerDashboard";

export default function DashboardPage(){
    return (
        <div>
            <div className="text-sm text-tracking-widest text-gray-400 p-4">
                <Link href="/">Home</Link>
            </div>
            <LedgerDashboard />
        </div>
    )
}