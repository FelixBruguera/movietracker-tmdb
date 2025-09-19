import { z } from "zod"
import { baseSchema } from "./baseSchema"

const moviesSchema = baseSchema
  .extend({
    query: z.string().max(100).optional(),
    with_cast: z.string().max(50).optional(),
    with_people: z.string().max(20).optional(),
    with_genres: z
      .union([
        z.array(z.string()).max(50),
        z
          .string()
          .max(80)
          .transform((genres) => genres?.split(",").join("|")),
      ])
      .optional(),
    with_watch_providers: z
      .union([
        z.array(z.number()).max(50),
        z
          .string()
          .max(150)
          .transform((providers) => providers?.split(",")),
      ])
      .transform((providers) => providers.join("|"))
      .optional(),
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
              .join("|")
          : keywords,
      )
      .default(""),
    "vote_count.gte": z.coerce.number().min(1).optional(),
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
      .enum(["popularity.desc", "vote_average.desc", "vote_count.desc"])
      .default("popularity.desc"),
    include_adult: z.literal(false).default(false),
    language: z.literal("en-US").default("en-US"),
    without_keywords: z
      .literal("155477,1664,190370,267122,171341,229706,251175")
      .default("155477,1664,190370,267122,171341,229706,251175"),
  })
  .refine((data) => data["vote_average.gte"] <= data["vote_average.lte"])
  .refine((data) =>
    data["primary_release_date.gte"] && data["primary_release_date.lte"]
      ? data["primary_release_date.gte"] <= data["primary_release_date.lte"]
      : true,
  )

export default moviesSchema
