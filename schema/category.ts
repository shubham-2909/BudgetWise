import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string(),
  icon: z.string(),
  type: z.enum(["expense", "income"])
})

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>
