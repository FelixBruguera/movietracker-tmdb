import { z } from "zod"
import moviesSchema from "./moviesSchema"

const tvSchema = moviesSchema
  .omit({ "primary_release_date.gte": true, "primary_release_date.lte": true })
  .safeExtend({
    "first_air_date.gte": z.coerce
      .number()
      .min(1896)
      .max(9999)
      .transform((year) => `${year}-01-01`)
      .optional(),
    "first_air_date.lte": z.coerce
      .number()
      .min(1896)
      .max(9999)
      .transform((year) => `${year}-12-31`)
      .optional(),
  })
  .refine((data) =>
    data["first_air_date.gte"] && data["first_air_date.gte"]
      ? data["first_air_date.gte"] <= data["first_air_date.lte"]
      : true,
  )

export default tvSchema
