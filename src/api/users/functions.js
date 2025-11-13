import { eq, gte, like, lte } from "drizzle-orm"

export function mapMediaType(filter, table) {
  const options = {
    all: eq(true, true),
    movies: like(table.mediaId, "movies_%"),
    tv: like(table.mediaId, "tv_%"),
  }
  return options[filter]
}

export function mapGenre(genre, table) {
  if (genre === 0) {
    return eq(true, true)
  }
  return eq(table.genreId, genre)
}

export function mapRatingRange(min, max, table) {
  return [gte(table.rating, min), lte(table.rating, max)]
}

export function mapYearRange(min, max, table) {
  return [gte(table.releaseDate, min), lte(table.releaseDate, max)]
}
