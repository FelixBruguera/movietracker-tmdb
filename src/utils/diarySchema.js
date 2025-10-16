import { z } from "zod"
import { mediaSchema } from "./baseSchema"

export const newLogSchema = z.object({
  date: z.iso.date().transform((str) => new Date(str)),
  movie: mediaSchema,
})
