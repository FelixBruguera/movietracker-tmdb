import { z } from "zod"
import { baseSchema } from "./baseSchema"

export const listSchema = baseSchema
  .extend({
    sort_by: z.enum(["date"]).default("date"),
    with_genres: z.coerce.number().max(9999999999).default(0),
    media_type: z.enum(["all", "movies", "tv"]).default("all"),
    "release_year.gte": z.coerce.number().min(1896).max(9999).default(0),
    "release_year.lte": z.coerce.number().min(1896).max(9999).default(9999),
  })
  .refine(
    (data) =>
      data["release_year.gte"] && data["release_year.lte"]
        ? data["release_year.gte"] <= data["release_year.lte"]
        : true,
    { error: "Invalid release year range" },
  )

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

export const listCollectionSchema = z.object({
  collectionId: z.string().max(20),
})
