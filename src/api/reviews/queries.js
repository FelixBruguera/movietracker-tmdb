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

export function getMediaReviews(
  db,
  userId,
  mediaId,
  sort,
  offset,
  itemsPerPage,
) {
  const currentUserLike = alias(likesToReviews, "currentUserLike")
  return db.batch([
    db
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
      .limit(itemsPerPage),
    db
      .select({
        totalReviews: count(reviews.id),
        averageRating: avg(reviews.rating),
      })
      .from(reviews)
      .where(eq(reviews.mediaId, mediaId)),
  ])
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

export function insertMedia(db, mediaData, isTv) {
  return db
    .insert(media)
    .values({
      id: mediaData.id,
      title: mediaData.title,
      poster: mediaData.poster,
      releaseDate: new Date(mediaData.releaseDate),
      isTv: isTv,
    })
    .onConflictDoNothing()
}

export function insertPerson(db, person) {
  return db
    .insert(people)
    .values({
      id: person.id,
      name: person.name,
      profile_path: person.profile_path,
    })
    .onConflictDoNothing()
}

export function insertPersonMedia({
  db,
  personId,
  mediaId,
  isDirector = false,
  isCreator = false,
}) {
  return db
    .insert(peopleToMedia)
    .values({
      personId: personId,
      mediaId: mediaId,
      isDirector: isDirector,
      isCreator: isCreator,
    })
    .onConflictDoNothing()
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
