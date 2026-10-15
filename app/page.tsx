import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main>
        <h1>
          Finance Ledger with a Serverless Architecture
        </h1>
        <Link href="/dashboard">Dashboard</Link>
      </main>
    </div>
  );
}
