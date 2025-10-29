import { and, countDistinct, eq, gte, sql } from "drizzle-orm"
import {
  diary,
  likesToReviews,
  listFollowers,
  lists,
  media,
  mediaToLists,
  reviews,
  searches,
  user,
} from "../../db/schema"
import { alias } from "drizzle-orm/sqlite-core"

export function getUsers(db, sort, offset, itemsPerPage, minReviews, minLogs) {
  return db
    .select({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      image: user.image,
      reviews: countDistinct(reviews.id),
      logs: countDistinct(diary.id),
      total: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
    })
    .from(user)
    .leftJoin(reviews, eq(reviews.userId, user.id))
    .leftJoin(diary, eq(diary.userId, user.id))
    .groupBy(user.id)
    .orderBy(sort)
    .offset(offset)
    .limit(itemsPerPage)
    .having(({ reviews, logs }) =>
      and(gte(reviews, minReviews), gte(logs, minLogs)),
    )
}

export function getUser(db, id) {
  return db
    .select({
      id: user.id,
      username: user.username,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, id))
}

export function getDiary(db, group, sort, offset, itemsPerPage, userId) {
  const totalCount = db.$with("totalCount").as(
    db
      .select({
        total: sql`CAST(COUNT(DISTINCT ${diary.id}) AS INTEGER)`.as("total"),
      })
      .from(diary)
      .where(eq(diary.userId, userId)),
  )
  return db
    .with(totalCount)
    .select({
      group: group,
      entries:
        sql`json_group_array(json_object('mediaId', ${media.id}, 'diaryId', ${diary.id}, 'poster_path', ${media.poster}, 'title', ${media.title}, 'date', ${diary.date}))`.mapWith(
          JSON.parse,
        ),
      totalGroups: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
      total: totalCount.total,
    })
    .from(diary)
    .crossJoin(totalCount)
    .innerJoin(media, eq(diary.mediaId, media.id))
    .where(eq(diary.userId, userId))
    .groupBy(group)
    .orderBy(sort)
    .offset(offset)
    .limit(itemsPerPage)
}

export function getUserReviews(db, id, userId, sort, offset, itemsPerPage) {
  const currentUserLike = alias(likesToReviews, "currentUserLike")
  return db
    .select({
      id: reviews.id,
      text: reviews.text,
      rating: reviews.rating,
      createdAt: reviews.createdAt,
      likes: countDistinct(likesToReviews.userId),
      currentUserLiked:
        sql`case when ${currentUserLike.userId} is not null then true else false end`.as(
          "currentUserLiked",
        ),
      media: {
        id: media.id,
        poster_path: media.poster,
        title: media.title,
      },
      total: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
      averageRating: sql`CAST(AVG(reviews.rating) OVER() AS FLOAT)`,
    })
    .from(reviews)
    .innerJoin(media, eq(reviews.mediaId, media.id))
    .leftJoin(likesToReviews, eq(reviews.id, likesToReviews.reviewId))
    .leftJoin(
      currentUserLike,
      and(
        eq(reviews.id, currentUserLike.reviewId),
        eq(currentUserLike.userId, userId),
      ),
    )
    .groupBy(reviews.id)
    .where(eq(reviews.userId, id))
    .orderBy(sort)
    .offset(offset)
    .limit(itemsPerPage)
}

export function getUserLists(db, id, sort, offset, itemsPerPage) {
  return db
    .select({
      id: lists.id,
      name: lists.name,
      description: lists.description,
      createdAt: lists.createdAt,
      isWatchlist: lists.isWatchlist,
      media: countDistinct(mediaToLists.mediaId),
      followers: countDistinct(listFollowers.userId),
      total: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
    })
    .from(lists)
    .leftJoin(mediaToLists, eq(lists.id, mediaToLists.listId))
    .leftJoin(listFollowers, eq(lists.id, listFollowers.listId))
    .groupBy(lists.id)
    .where(and(eq(lists.userId, id), eq(lists.isPrivate, false)))
    .orderBy(sort)
    .offset(offset)
    .limit(itemsPerPage)
}

export function getUserSearches(db, userId) {
  return db
    .select({
      id: searches.id,
      search: searches.search,
      path: searches.path,
      name: searches.name,
    })
    .from(searches)
    .where(eq(searches.userId, userId))
}

export function insertSearch(db, name, path, search, userId) {
  return db
    .insert(searches)
    .values({
      name: name,
      path: path,
      search: search,
      userId: userId,
    })
    .returning({
      id: searches.id,
      name: searches.name,
      search: searches.search,
      path: searches.path,
    })
}

export function updateSearch(db, name, searchId, userId) {
  return db
    .update(searches)
    .set({ name: name, search: sql`json_set(search, '$.search', ${name})` })
    .where(and(eq(searches.id, searchId), eq(searches.userId, userId)))
    .returning({
      id: searches.id,
      name: searches.name,
      search: searches.search,
      path: searches.path,
    })
}

export function deleteSearch(db, searchId, userId) {
  return db
    .delete(searches)
    .where(and(eq(searches.id, searchId), eq(searches.userId, userId)))
}
