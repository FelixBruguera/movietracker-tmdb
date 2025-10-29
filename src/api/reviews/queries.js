import { and, avg, eq, sql, count } from "drizzle-orm"
import {
  genresToMedia,
  likesToReviews,
  media,
  networks,
  networksToMedia,
  people,
  peopleToMedia,
  reviews,
  user,
} from "../../db/schema"
import { alias } from "drizzle-orm/sqlite-core"
import { chunkInserts } from "./functions"

export function getMediaReviews(
  db,
  userId,
  mediaId,
  sort,
  offset,
  itemsPerPage,
) {
  const currentUserLike = alias(likesToReviews, "currentUserLike")
  return db
    .select({
      id: reviews.id,
      text: reviews.text,
      rating: reviews.rating,
      createdAt: reviews.createdAt,
      user: {
        id: reviews.userId,
        username: user.username,
        image: user.image,
      },
      likes: count(likesToReviews.reviewId),
      currentUserLiked:
        sql`case when ${currentUserLike.userId} is not null then true else false end`.as(
          "currentUserLiked",
        ),
      total: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
      averageRating: sql`CAST(AVG(reviews.rating) OVER() AS FLOAT)`,
    })
    .from(reviews)
    .fullJoin(user, eq(reviews.userId, user.id))
    .leftJoin(likesToReviews, eq(reviews.id, likesToReviews.reviewId))
    .leftJoin(
      currentUserLike,
      and(
        eq(reviews.id, currentUserLike.reviewId),
        eq(currentUserLike.userId, userId),
      ),
    )
    .groupBy(reviews.id)
    .where(eq(reviews.mediaId, mediaId))
    .orderBy(sort)
    .offset(offset)
    .limit(itemsPerPage)
}

export function getUserReview(db, mediaId, userId) {
  if (!userId) {
    return []
  }
  return db
    .select({
      id: reviews.id,
      text: reviews.text,
      rating: reviews.rating,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(and(eq(reviews.mediaId, mediaId), eq(reviews.userId, userId)))
}

export function insertMedia(db, mediaData) {
  return db
    .insert(media)
    .values({
      id: mediaData.id,
      title: mediaData.title,
      poster: mediaData.poster,
      releaseDate: mediaData.releaseDate,
    })
    .onConflictDoNothing()
}

export function insertPeople(db, peopleToInsert) {
  const queries = peopleToInsert.map((person) => {
    return {
      id: person.id,
      name: person.name,
      profile_path: person.profile_path,
    }
  })
  const chunckedQueries = chunkInserts(queries, 25)
  return chunckedQueries.map((query) =>
    db.insert(people).values(query).onConflictDoNothing(),
  )
}

export function insertPeopleMedia(db, peopleToInsert, mediaId) {
  const queries = peopleToInsert.map((person) => {
    return {
      personId: person.id,
      mediaId: mediaId,
      isDirector: person.job === "Director",
      isCreator: person.job === "Creator",
    }
  })
  const chunckedQueries = chunkInserts(queries, 25)
  return chunckedQueries.map((query) =>
    db.insert(peopleToMedia).values(query).onConflictDoNothing(),
  )
}

export function insertGenreMedia(db, genreId, mediaId) {
  return db
    .insert(genresToMedia)
    .values({
      genreId: genreId,
      mediaId: mediaId,
    })
    .onConflictDoNothing()
}

export function insertNetwork(db, network) {
  return db
    .insert(networks)
    .values({
      id: network.id,
      name: network.name,
      logo_path: network.logo_path,
    })
    .onConflictDoNothing()
}

export function insertNetworkMedia(db, networkId, mediaId) {
  return db
    .insert(networksToMedia)
    .values({
      networkId: networkId,
      mediaId: mediaId,
    })
    .onConflictDoNothing()
}

export function insertReview(db, text, rating, userId, mediaId) {
  return db.insert(reviews).values({
    text: text,
    rating: rating,
    userId: userId,
    mediaId: mediaId,
  })
}

export function updateReview(db, text, rating, reviewId, userId) {
  return db
    .update(reviews)
    .set({ text: text, rating: rating })
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, userId)))
    .returning({ text: reviews.text, rating: reviews.rating })
}

export function deleteReview(db, reviewId, userId) {
  return db
    .delete(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, userId)))
}

export function likeReview(db, reviewId, userId) {
  return db
    .insert(likesToReviews)
    .values({ userId: userId, reviewId: reviewId })
}

export function dislikeReview(db, reviewId, userId) {
  return db
    .delete(likesToReviews)
    .where(
      and(
        eq(likesToReviews.userId, userId),
        eq(likesToReviews.reviewId, reviewId),
      ),
    )
}
