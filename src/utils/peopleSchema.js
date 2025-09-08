import { z } from "zod"
import data from "../../lib/filters.json"
import { baseSchema } from "./baseSchema"

const scopes = { Movies: "movie_credits", "TV Shows": "tv_credits" }

export const peopleSchema = baseSchema.extend({
  scope: z
    .enum(["Movies", "TV Shows"])
    .transform((scope) => scopes[scope])
    .default("movie_credits"),
  department: z.enum(data.departments).default("All"),
  sort_by: z
    .enum(["Best rated", "Most votes", "Most recent"])
    .default("Most recent"),
})
