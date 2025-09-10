import { z } from "zod"
import moviesSchema from "./moviesSchema"

export const searchSchema = z.object({
  name: z.string().min(3).max(100),
  path: z.enum(["/", "/tv"]).default("/"),
})

export const searchQuerySchema = moviesSchema
  .omit({ include_adult: true })
  .safeExtend({
    with_keywords: z.string().max(1300).default(""),
    "primary_release_date.gte": z.coerce
      .number()
      .min(1896)
      .max(9999)
      .optional(),
    "primary_release_date.lte": z.coerce
      .number()
      .min(1896)
      .max(9999)
      .optional(),
    with_original_language: z.string().max(2).optional(),
    with_genres: z
      .union([z.array(z.string()).max(50), z.string().max(80)])
      .optional(),
    with_watch_providers: z
      .union([z.array(z.number()).max(50), z.string().max(150)])
      .optional(),
  })

export const searchQuerySchemaTV = searchQuerySchema
  .omit({ "primary_release_date.gte": true, "primary_release_date.lte": true })
  .safeExtend({
    "first_air_date.gte": z.coerce.number().min(1896).max(9999).optional(),
    "first_air_date.lte": z.coerce.number().min(1896).max(9999).optional(),
  })
