import { z } from "zod"
import { baseSchema } from "./baseSchema"

export const profileReviewsSchema = baseSchema
  .extend({
    sort_by: z.enum(["date", "rating", "likes"]).default("date"),
    with_genres: z.coerce.number().max(9999999999).default(0),
    media_type: z.enum(["all", "movies", "tv"]).default("all"),
    "rating.gte": z.coerce.number().min(1).max(10).default(1),
    "rating.lte": z.coerce.number().min(1).max(10).default(10),
    "release_year.gte": z.coerce.number().min(1896).max(9999).default(0),
    "release_year.lte": z.coerce.number().min(1896).max(9999).default(9999),
  })
  .refine((data) => data["rating.gte"] <= data["rating.lte"], {
    error: "Invalid rating range",
  })
  .refine(
    (data) =>
      data["release_year.gte"] && data["release_year.lte"]
        ? data["release_year.gte"] <= data["release_year.lte"]
        : true,
    { error: "Invalid release year range" },
  )
export const diarySchema = baseSchema
  .extend({
    sort_by: z.enum(["monthly", "yearly"]).default("monthly"),
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
