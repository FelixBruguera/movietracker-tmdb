import { z } from "zod"

export const newLogSchema = z.object({
  date: z
    .string()
    .max(10)
    .transform((str) => new Date(str)),
  movie: z.json(),
})
