import { and, avg, count, eq, isNull, ne, not, sql } from "drizzle-orm"
import { media, reviews } from "../../../db/schema"

export function getRatingsByDecade(db, userId) {
  return db
    .select({
      decade: sql`(${media.releaseDate} / 10) * 10`,
      averageRating: avg(reviews.rating),
      total: count(reviews.rating),
    })
    .from(reviews)
    .leftJoin(media, eq(reviews.mediaId, media.id))
    .where(and(eq(reviews.userId, userId), ne(media.isTv, 1)))
    .groupBy(sql`(${media.releaseDate} / 10) * 10`)
}
