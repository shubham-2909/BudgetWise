import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const { searchParams } = new URL(req.url)

  const paramType = searchParams.get("type")
  const validator = z.enum(["expense", "income"]).nullable()

  const queryParams = validator.safeParse(paramType)

  if (!queryParams.success) {
    return Response.json(queryParams.error)
  }

  const type = queryParams.data

  const categories = await prisma.category.findMany({ where: { userId: user.id, ...(type && { type }) }, orderBy: { name: "asc" } }) // include the type only if its defined

  return Response.json(categories)

}
