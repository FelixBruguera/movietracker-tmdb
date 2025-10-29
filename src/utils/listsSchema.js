import { z } from "zod"
import { baseSchema } from "./baseSchema"

export const listSchema = baseSchema.extend({
  sort_by: z.enum(["date"]).default("date"),
})

export const listIndexSchema = baseSchema.extend({
  sort_by: z.enum(["date", "followers", "movies"]).default("date"),
  filter: z.enum(["user", "following"]).optional(),
  "followers.gte": z.coerce.number().min(0).default(0),
  "media.gte": z.coerce.number().min(0).default(0),
})

export const newListSchema = z.object({
  name: z.string().max(100).optional(),
  description: z.string().max(400).optional(),
  isPrivate: z.boolean(),
  isWatchlist: z.boolean(),
})

export const listMovieSchema = z.object({
  mediaId: z.string().max(20),
})
