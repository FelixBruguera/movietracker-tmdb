import { z } from "zod"

export const baseSchema = z.object({
  page: z.coerce.number().min(1).max(500).default(1),
})
