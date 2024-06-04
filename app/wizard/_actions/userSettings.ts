"use server"

import prisma from "@/lib/prisma"
import { UpdateUserCurrencySchema } from "@/schema/userSettings"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function updateCurrency(currency: string) {
  const { success, error } = UpdateUserCurrencySchema.safeParse(currency)
  if (!success) {
    throw error
  }
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const userSettings = await prisma.userSettings.update({ where: { userId: user.id }, data: { currency } })

  return userSettings

}
