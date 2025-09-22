import { z } from "zod"
import { baseSchema } from "./baseSchema"

export const diaryschema = baseSchema.extend({
  sort_by: z.enum(["date", "rating", "likes"]).default("date"),
})

export const newLogSchema = z.object({
  date: z
    .string()
    .max(10)
    .transform((str) => new Date(str)),
  movie: z.json(),
})
