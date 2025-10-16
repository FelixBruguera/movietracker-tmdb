import { z } from "zod"

export const baseSchema = z.object({
  page: z.coerce.number().min(1).max(500).default(1),
  sort_order: z
    .enum(["-1", "1"])
    .transform((num) => parseFloat(num))
    .default(-1),
})

export const personSchema = z.object({
  id: z.number().max(9999999999),
  name: z.string().max(400),
  profile_path: z.string().max(400).nullable(),
  job: z.string().max(100).optional(),
})

export const mediaSchema = z.object({
  id: z.number().max(9999999999),
  title: z.string().max(200),
  releaseDate: z.number().max(9999),
  poster: z.string().max(400),
  cast: z.array(personSchema),
  directors: z.array(personSchema).optional(),
  genres: z.array(z.object({ id: z.number().max(9999999999) })),
  created_by: z.array(personSchema).optional(),
  networks: z
    .array(
      z.object({
        id: z.number().max(9999999999),
        name: z.string().max(100),
        logo_path: z.string().max(400),
      }),
    )
    .optional(),
})
