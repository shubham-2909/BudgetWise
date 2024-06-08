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
    throw new Error(queryParams.error.message)
  }

  const stats = await getCategoryStats(queryParams.data.from, queryParams.data.to, user.id)
  return NextResponse.json(stats)
}

export type GetCategoryStatsResponseType = Awaited<ReturnType<typeof getCategoryStats>>
async function getCategoryStats(from: Date, to: Date, userId: string) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to
      },
    },
    _sum: {
      amount: true
    },
    orderBy: {
      _sum: {
        amount: "desc"
      }
    }
  })
  return stats
}
