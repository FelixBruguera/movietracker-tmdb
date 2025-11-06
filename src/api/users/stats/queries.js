import {
  and,
  avg,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  isNull,
  like,
  max,
  ne,
  not,
  sql,
} from "drizzle-orm"
import {
  diary,
  genres,
  genresToMedia,
  media,
  networks,
  networksToMedia,
  people,
  peopleToMedia,
  reviews,
} from "../../../db/schema"

export function getRatingsByDecade(db, userId, scope) {
  return db
    .select({
      decade: sql`CAST(${media.releaseDate} / 10 AS INTEGER) * 10`,
      averageRating: avg(reviews.rating),
      total: count(reviews.rating),
    })
    .from(reviews)
    .leftJoin(media, eq(reviews.mediaId, media.id))
    .where(and(like(media.id, `${scope}_%`), eq(reviews.userId, userId)))
    .groupBy(sql`CAST(${media.releaseDate} / 10 AS INTEGER) * 10`)
}

export function getRatingsByYear(db, userId, scope) {
  return db
    .select({
      year: media.releaseDate,
      averageRating: avg(reviews.rating),
      total: count(reviews.rating),
    })
    .from(reviews)
    .leftJoin(media, eq(reviews.mediaId, media.id))
    .where(and(like(media.id, `${scope}_%`), eq(reviews.userId, userId)))
    .groupBy(media.releaseDate)
}

export function getRatingsByGenre(db, userId, scope) {
  return db
    .select({
      genre: genres.name,
      averageRating: avg(reviews.rating),
      total: count(reviews.rating),
    })
    .from(reviews)
    .leftJoin(genresToMedia, eq(reviews.mediaId, genresToMedia.mediaId))
    .leftJoin(genres, eq(genres.id, genresToMedia.genreId))
    .having(({ total }) => gte(total, 2))
    .where(
      and(
        like(genresToMedia.mediaId, `${scope}_%`),
        eq(reviews.userId, userId),
      ),
    )
    .groupBy(genres.id)
    .orderBy(desc(avg(reviews.rating)))
    .limit(10)
}

export function getBestRatedDirectors(db, userId) {
  return db
    .select({
      id: people.id,
      name: people.name,
      profile_path: people.profile_path,
      averageRating: avg(reviews.rating),
      total: count(reviews.rating),
    })
    .from(reviews)
    .leftJoin(peopleToMedia, eq(peopleToMedia.mediaId, reviews.mediaId))
    .leftJoin(people, eq(peopleToMedia.personId, people.id))
    .having(({ total }) => gte(total, 2))
    .where(
      and(
        like(peopleToMedia.mediaId, "movies_%"),
        eq(reviews.userId, userId),
        eq(peopleToMedia.isDirector, true),
      ),
    )
    .groupBy(people.id)
    .orderBy(desc(avg(reviews.rating)))
    .limit(10)
}

export function getMostWatchedDirectors(db, userId) {
  return db
    .select({
      id: people.id,
      name: people.name,
      profile_path: people.profile_path,
      total: countDistinct(diary.mediaId),
    })
    .from(diary)
    .leftJoin(peopleToMedia, eq(peopleToMedia.mediaId, diary.mediaId))
    .leftJoin(people, eq(peopleToMedia.personId, people.id))
    .where(
      and(
        like(peopleToMedia.mediaId, "movies_%"),
        eq(diary.userId, userId),
        eq(peopleToMedia.isDirector, true),
      ),
    )
    .groupBy(people.id)
    .orderBy(desc(countDistinct(diary.mediaId)))
    .limit(10)
}

export function getBestRatedCreators(db, userId) {
  return db
    .select({
      id: people.id,
      name: people.name,
      profile_path: people.profile_path,
      averageRating: avg(reviews.rating),
      total: count(reviews.rating),
    })
    .from(reviews)
    .leftJoin(peopleToMedia, eq(peopleToMedia.mediaId, reviews.mediaId))
    .leftJoin(people, eq(peopleToMedia.personId, people.id))
    .having(({ total }) => gte(total, 2))
    .where(
      and(
        like(peopleToMedia.mediaId, "tv_%"),
        eq(reviews.userId, userId),
        eq(peopleToMedia.isCreator, true),
      ),
    )
    .groupBy(people.id)
    .orderBy(desc(avg(reviews.rating)))
    .limit(10)
}

export function getMostWatchedCreators(db, userId) {
  return db
    .select({
      id: people.id,
      name: people.name,
      profile_path: people.profile_path,
      total: countDistinct(diary.mediaId),
    })
    .from(diary)
    .leftJoin(peopleToMedia, eq(peopleToMedia.mediaId, diary.mediaId))
    .leftJoin(people, eq(peopleToMedia.personId, people.id))
    .where(
      and(
        like(peopleToMedia.mediaId, "tv_%"),
        eq(diary.userId, userId),
        eq(peopleToMedia.isCreator, true),
      ),
    )
    .groupBy(people.id)
    .orderBy(desc(countDistinct(diary.mediaId)))
    .limit(10)
}

export function getMostWatchedGenres(db, userId, scope) {
  return db
    .select({
      genre: genres.name,
      total: count(diary.id),
    })
    .from(diary)
    .leftJoin(genresToMedia, eq(diary.mediaId, genresToMedia.mediaId))
    .leftJoin(genres, eq(genres.id, genresToMedia.genreId))
    .where(
      and(like(genresToMedia.mediaId, `${scope}_%`), eq(diary.userId, userId)),
    )
    .groupBy(genres.id)
    .orderBy(desc(count(diary.id)))
    .limit(10)
}

export function getLogsByYear(db, userId, scope) {
  return db
    .select({
      year: sql`strftime("%Y", ${diary.date}, 'unixepoch')`,
      total: count(diary.id),
    })
    .from(diary)
    .leftJoin(media, eq(media.id, diary.mediaId))
    .where(and(like(media.id, `${scope}_%`), eq(diary.userId, userId)))
    .groupBy(sql`strftime("%Y", ${diary.date}, 'unixepoch')`)
}

export function getMostWatchedActors(db, userId, scope) {
  return db
    .select({
      id: people.id,
      name: people.name,
      profile_path: people.profile_path,
      total: countDistinct(diary.mediaId),
    })
    .from(diary)
    .leftJoin(peopleToMedia, eq(peopleToMedia.mediaId, diary.mediaId))
    .leftJoin(people, eq(peopleToMedia.personId, people.id))
    .where(
      and(
        like(peopleToMedia.mediaId, `${scope}_%`),
        eq(diary.userId, userId),
        eq(peopleToMedia.isDirector, false),
        eq(peopleToMedia.isCreator, false),
      ),
    )
    .groupBy(people.id)
    .orderBy(desc(countDistinct(diary.mediaId)))
    .limit(10)
}

export function getMostWatchedMedia(db, userId, scope) {
  return db
    .select({
      id: media.id,
      title: media.title,
      poster_path: media.poster,
      total: count(diary.id),
    })
    .from(diary)
    .leftJoin(media, eq(media.id, diary.mediaId))
    .having(({ total }) => gte(total, 2))
    .where(and(like(diary.mediaId, `${scope}_%`), eq(diary.userId, userId)))
    .groupBy(diary.mediaId)
    .orderBy(desc(count(diary.id)))
    .limit(10)
}

export function getMostWatchedNetworks(db, userId) {
  return db
    .select({
      id: networks.id,
      name: networks.name,
      logo_path: networks.logo_path,
      total: countDistinct(diary.mediaId),
    })
    .from(diary)
    .leftJoin(networksToMedia, eq(networksToMedia.mediaId, diary.mediaId))
    .leftJoin(networks, eq(networksToMedia.networkId, networks.id))
    .where(and(like(networksToMedia.mediaId, `tv_%`), eq(diary.userId, userId)))
    .groupBy(networks.id)
    .orderBy(desc(countDistinct(diary.mediaId)))
    .limit(10)
}

export function getRatingsByNetwork(db, userId) {
  return db
    .select({
      id: networks.id,
      name: networks.name,
      logo_path: networks.logo_path,
      averageRating: avg(reviews.rating),
      total: count(reviews.rating),
    })
    .from(reviews)
    .leftJoin(networksToMedia, eq(reviews.mediaId, networksToMedia.mediaId))
    .leftJoin(networks, eq(networks.id, networksToMedia.networkId))
    .having(({ total }) => gte(total, 2))
    .where(
      and(like(networksToMedia.mediaId, `tv_%`), eq(reviews.userId, userId)),
    )
    .groupBy(networks.id)
    .orderBy(desc(avg(reviews.rating)))
    .limit(10)
}

export function getRatingDistribution(db, userId, scope) {
  return db
    .select({
      rating: reviews.rating,
      total: count(reviews.rating),
    })
    .from(reviews)
    .where(and(like(reviews.mediaId, `${scope}_%`), eq(reviews.userId, userId)))
    .groupBy(reviews.rating)
}

export function getDayOfWeekHeatmap(db, userId, scope) {
  return db
    .select({
      value: sql`strftime("%w", ${diary.date}, 'unixepoch')`,
      total: count(diary.date),
    })
    .from(diary)
    .where(and(like(diary.mediaId, `${scope}_%`), eq(diary.userId, userId)))
    .groupBy(sql`strftime("%w", ${diary.date},'unixepoch')`)
}

export function getMonthlyHeatmap(db, userId, scope) {
  return db
    .select({
      value: sql`strftime("%m", ${diary.date}, 'unixepoch')`,
      total: count(diary.date),
    })
    .from(diary)
    .where(and(like(diary.mediaId, `${scope}_%`), eq(diary.userId, userId)))
    .groupBy(sql`strftime("%m", ${diary.date},'unixepoch')`)
}
