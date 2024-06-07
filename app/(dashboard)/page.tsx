import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CreateTransactionDialog } from "./_components/CreateTransactionDialog"
import { Overview } from "./_components/Overview"

export default async function page() {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const userSettings = await prisma.userSettings.findUnique({ where: { userId: user?.id } })
  if (!userSettings) {
    redirect("/wizard")
  }
  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="font-bold text-3xl">Hello {user.firstName} 👋</p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog trigger={
              <Button className="text-white border-emerald-500 bg-emerald-950 hover:bg-emerald-700 hover:text-white" variant={`outline`}>New Income 🤑</Button>
            } type="income" />
            <CreateTransactionDialog trigger={<Button className="text-white hover:text-white bg-rose-950 border-rose-500 hover:bg-rose-700" variant={`outline`} >New Expense 🫠</Button>} type="expense" />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
    </div>
  )
}
