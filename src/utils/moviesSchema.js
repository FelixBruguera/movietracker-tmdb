import { z } from "zod"
import { baseSchema } from "./baseSchema"

const maxYear = new Date().getFullYear()
const moviesSchema = baseSchema.extend({
    query: z.string().max(100).optional(),
    with_cast: z.string().max(50).optional(),
    with_people: z.string().max(20).optional(),
    with_genres: z.union([z.array(z.string()).max(50).optional(), z.string().max(80).transform(genres => genres?.split(",").join("|")).optional()]),
    with_original_language: z.string().max(2).transform(lang => lang === "xx" ? undefined : lang).optional(),
    type: z
    .literal(["Movie", "Series", "All"])
    .transform((type) => type.toLowerCase())
    .optional(),
    "vote_count.gte": z.coerce.number().min(1).optional(),
    "vote_average.gte": z.coerce.number().min(1).max(10).default(1),
    "vote_average.lte": z.coerce.number().min(1).max(10).default(10),
    "with_runtime.gte": z.coerce.number().min(1).max(1256).optional(),
    "with_runtime.lte": z.coerce.number().min(1).max(1256).optional(),
    "primary_release_date.gte": z.coerce.number().min(1850).max(maxYear).transform(year => `${year}-01-01`).optional(),
    "primary_release_date.lte": z.coerce.number().min(1850).max(maxYear).transform(year => `${year}-12-31`).optional(),
    sort_by: z
    .enum(["popularity.asc", "popularity.desc", "vote_average.asc", "vote_average.desc", "vote_count.asc", "vote_count.desc"])
    .default("popularity.desc"),
    include_adult: z.literal(false).default(false),
    language: z.literal("en-US").default("en-US")
})
.refine((data) => data["vote_average.gte"] < data["vote_average.lte"])
.refine((data) => data["primary_release_date.gte"] < data["primary_release_date.lte"])

export default moviesSchema