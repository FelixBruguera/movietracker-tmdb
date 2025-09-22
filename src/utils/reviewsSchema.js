import { z } from "zod"
import { baseSchema } from "./baseSchema"

export const reviewsSchema = baseSchema.extend({
  sort_by: z.enum(["date", "rating", "likes"]).default("date"),
})

export const newReviewSchema = z.object({
  text: z.string().max(400).optional(),
  rating: z.coerce.number().min(1).max(10),
  movie: z.json(),
  addToDiary: z.coerce.boolean().default(false),
})
