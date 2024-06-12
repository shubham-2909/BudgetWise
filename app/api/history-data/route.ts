import prisma from "@/lib/prisma";
import { Period, TimeFrame } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11),
  year: z.coerce.number().min(2000).max(3000)
})

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }

  const { searchParams } = new URL(req.url)
  const month = searchParams.get("month")
  const timeframe = searchParams.get("timeframe")
  const year = searchParams.get("year")
  const queryParams = getHistoryDataSchema.safeParse({ month, year, timeframe })
  if (!queryParams.success) {
    return NextResponse.json(queryParams.error.message, {
      status: 400
    })
  }
  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    year: queryParams.data.year,
    month: queryParams.data.month
  })
  return NextResponse.json(data)
}

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>
async function getHistoryData(userId: string, timeframe: TimeFrame, period: Period) {
  switch (timeframe) {
    case "month":
      return await getHistoryDataMonth(userId, period.year, period.month)
    case "year":
      return await getHistoryDataYear(userId, period.year)
  }
}


type HistoryData = {
  expense: number
  income: number
  year: number
  month: number
  day?: number
}
async function getHistoryDataYear(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: "month",
    where: {
      userId,
      year
    },
    _sum: {
      income: true,
      expense: true
    },
    orderBy: {
      month: "asc"
    }
  })

  if (!result || result.length === 0) return []

  const history: HistoryData[] = []

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;
    const month = result.find(x => x.month === i)

    if (month) {
      expense += month._sum.expense || 0
      income += month._sum.income || 0
    }
    history.push({ expense, income, month: i, year })
  }

  return history
}

async function getHistoryDataMonth(
  userId: string,
  year: number,
  month: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: "asc",
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    });
  }

  return history;
}
