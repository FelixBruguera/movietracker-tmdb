import { z } from "zod"

export const baseSchema = z.object({
  page: z.coerce.number().min(1).max(500).default(1),
  sort_order: z
    .enum(["-1", "1"])
    .transform((num) => parseFloat(num))
    .default(-1),
})
