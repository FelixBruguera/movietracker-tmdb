import { asc, desc } from "drizzle-orm"

export function formatValidationError(validationResult) {
  const error = JSON.parse(validationResult.error.message)[0]
  return { error: `${error.path} validation failed: ${error.message}` }
}

export function getSort(data, options) {
  const { sort_by, sort_order } = data
  const sortCol = options[sort_by]
  return sort_order === 1 ? asc(sortCol) : desc(sortCol)
}
