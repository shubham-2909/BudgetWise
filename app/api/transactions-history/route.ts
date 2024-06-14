import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const queryParams = OverviewQuerySchema.safeParse({ from, to })
  if (!queryParams.success) {
    return NextResponse.json(queryParams.error.message, {
      status: 400
    })
  }

  const result = await getTransactionHistoryData(user.id, queryParams.data.from, queryParams.data.to)
  return NextResponse.json(result)
}

export type GetTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionHistoryData>>

async function getTransactionHistoryData(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  })
  if (!userSettings) {
    throw new Error("User Settings are not added!")
  }

  const formatter = GetFormatterForCurrency(userSettings.currency)
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to
      }
    },
    orderBy: {
      date: "desc"
    }
  })

  return transactions.map((transaction) => ({ ...transaction, formattedAmount: formatter.format(transaction.amount) }))
}
