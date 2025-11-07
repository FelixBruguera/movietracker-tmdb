import { eq, like } from "drizzle-orm"

export function transformFilter(filter, table) {
  const options = {
    all: eq(true, true),
    movies: like(table.mediaId, "movies_%"),
    tv: like(table.mediaId, "tv_%"),
  }
  return options[filter]
}
