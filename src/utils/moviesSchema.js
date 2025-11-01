import { z } from "zod"
import { baseSchema } from "./baseSchema"

const moviesSchema = baseSchema
  .extend({
    with_cast: z.string().max(50).optional(),
    with_people: z.string().max(20).optional(),
    with_genres: z.string().max(160).optional(),
    with_watch_providers: z.string().max(150).optional(),
    watch_region: z.string().max(2).optional(),
    with_watch_monetization_types: z
      .literal("flatrate|rent|buy|ads|free")
      .default("flatrate|rent|buy|ads|free"),
    with_original_language: z
      .string()
      .max(2)
      .transform((lang) => (lang === "xx" ? undefined : lang))
      .optional(),
    with_keywords: z
      .string()
      .max(1300)
      .transform((keywords) =>
        keywords.length > 0
          ? JSON.parse(decodeURIComponent(keywords))
              .map((obj) => obj.id)
              .join(",")
          : keywords,
      )
      .default(""),
    "vote_count.gte": z.coerce.number().min(1).max(999999).optional(),
    "vote_average.gte": z.coerce.number().min(1).max(10).default(1),
    "vote_average.lte": z.coerce.number().min(1).max(10).default(10),
    "with_runtime.gte": z.coerce.number().min(1).max(1256).optional(),
    "with_runtime.lte": z.coerce.number().min(1).max(1256).optional(),
    "primary_release_date.gte": z.coerce
      .number()
      .min(1896)
      .max(9999)
      .transform((year) => `${year}-01-01`)
      .optional(),
    "primary_release_date.lte": z.coerce
      .number()
      .min(1896)
      .max(9999)
      .transform((year) => `${year}-12-31`)
      .optional(),
    sort_by: z
      .enum(["popularity", "vote_average", "vote_count"])
      .default("popularity"),
    include_adult: z.literal(false).default(false),
    language: z.literal("en-US").default("en-US"),
    without_keywords: z
      .literal("155477,1664,190370,267122,171341,229706,251175")
      .default("155477,1664,190370,267122,171341,229706,251175"),
  })
  .refine((data) => data["vote_average.gte"] <= data["vote_average.lte"], {
    error: "Invalid average rating range",
  })
  .refine(
    (data) =>
      data["primary_release_date.gte"] && data["primary_release_date.lte"]
        ? data["primary_release_date.gte"] <= data["primary_release_date.lte"]
        : true,
    { error: "Invalid release year range" },
  )

export default moviesSchema
