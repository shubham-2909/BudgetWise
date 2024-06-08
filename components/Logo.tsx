import { PiggyBank } from "lucide-react";
import Link from "next/link";
export function Logo() {
  return <Link href={`/`}>
    <div className="flex items-center gap-2">
      <PiggyBank className="stroke hidden sm:block h-11 w-11 stroke-green-400 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-green-400 to to-blue-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">BudgetWise</p>
    </div>
  </Link>
}
