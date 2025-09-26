import { z } from "zod"
import { baseSchema } from "./baseSchema"

export const usersSchema = baseSchema.extend({
  sort_by: z.enum(["date", "reviews", "logs"]).default("date"),
  "reviews.gte": z.coerce.number().min(0).default(0),
  "logs.gte": z.coerce.number().min(0).default(0),
})

export const userDiarySchema = baseSchema.extend({
  sort_by: z.enum(["monthly", "yearly"]).default("monthly")
})

export const userReviewsSchema = baseSchema.extend({
  sort_by: z.enum(["date", "rating", "likes"]).default("date")
})

export const userListsSchema = baseSchema.extend({
  sort_by: z.enum(["date", "followers", "movies"]).default("date")
})