"use server"

import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function DeleteTransaction(transactionId: string) {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id: transactionId
    }
  })

  if (!transaction) {
    throw new Error("Bad Request")
  }

  await prisma.$transaction([
    //Delete the Transaction from DB
    prisma.transaction.delete({
      where: {
        userId: user.id,
        id: transactionId
      }
    }),
    // update the corresponding monthHistory
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear()
        },
      },
      data: {
        ...(transaction.type === "income" ? { income: { decrement: transaction.amount } } : {
          expense: {
            decrement: transaction.amount
          }
        })
      }
    }),
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear()
        },
      },
      data: {
        ...(transaction.type === "income" ? { income: { decrement: transaction.amount } } : {
          expense: {
            decrement: transaction.amount
          }
        })
      }
    })
  ])
}
