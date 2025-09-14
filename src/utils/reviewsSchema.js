import { z } from "zod"
import data from "../../lib/filters.json"
import { baseSchema } from "./baseSchema"

export const reviewsSchema = baseSchema.extend({
  sort_by: z.enum(["date", "rating", "likes"]).default("date"),
  sortOrder: z
    .enum(["-1", "1"])
    .transform((num) => parseFloat(num))
    .default(-1),
})

export const newReviewSchema = z.object({
  text: z.string().max(400).optional(),
  rating: z.coerce.number().min(1).max(10),
  movie: z.json(),
})
