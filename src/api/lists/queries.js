import {
  and,
  countDistinct,
  eq,
  gte,
  inArray,
  or,
  count,
  sql,
} from "drizzle-orm"
import {
  listFollowers,
  lists,
  media,
  mediaToLists,
  user,
} from "../../db/schema"
import { alias } from "drizzle-orm/sqlite-core"

export function watchlistQuery(db, userId, mediaId) {
  const deleteSubquery = db
    .select({ id: lists.id })
    .from(lists)
    .where(and(eq(lists.isWatchlist, true), eq(lists.userId, userId)))
  return db
    .delete(mediaToLists)
    .where(
      and(
        eq(mediaToLists.mediaId, mediaId),
        inArray(mediaToLists.listId, deleteSubquery),
      ),
    )
}

export function getLists(
  db,
  minMedia,
  minFollowers,
  userId,
  filterCondition,
  sort,
  offset,
  itemsPerPage,
) {
  return db
    .select({
      id: lists.id,
      name: lists.name,
      description: lists.description,
      createdAt: lists.createdAt,
      isPrivate: lists.isPrivate,
      isWatchlist: lists.isWatchlist,
      followers: countDistinct(listFollowers.userId),
      media: countDistinct(mediaToLists.mediaId),
      total: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
    })
    .from(lists)
    .leftJoin(mediaToLists, eq(lists.id, mediaToLists.listId))
    .leftJoin(listFollowers, eq(lists.id, listFollowers.listId))
    .having(({ media, followers }) =>
      and(gte(media, minMedia), gte(followers, minFollowers)),
    )
    .groupBy(lists.id)
    .where(
      and(
        or(eq(lists.isPrivate, false), eq(lists.userId, userId)),
        filterCondition,
      ),
    )
    .orderBy(sort)
    .offset(offset)
    .limit(itemsPerPage)
}

export function getList(db, userId, listId) {
  const followCheck = alias(listFollowers, "followCheck")
  return db
    .select({
      id: lists.id,
      name: lists.name,
      description: lists.description,
      createdAt: lists.createdAt,
      isPrivate: lists.isPrivate,
      isWatchlist: lists.isWatchlist,
      user: {
        id: lists.userId,
        username: user.username,
        image: user.image,
      },
      followers: countDistinct(listFollowers.userId),
      currentUserFollows:
        sql`case when ${followCheck.userId} is not null then true else false end`.as(
          "currentUserFollows",
        ),
    })
    .from(lists)
    .fullJoin(user, eq(lists.userId, user.id))
    .leftJoin(listFollowers, eq(lists.id, listFollowers.listId))
    .groupBy(lists.id)
    .leftJoin(
      followCheck,
      and(eq(lists.id, followCheck.listId), eq(followCheck.userId, userId)),
    )
    .where(
      and(
        eq(lists.id, listId),
        or(eq(lists.isPrivate, false), eq(lists.userId, userId)),
      ),
    )
}

export function getListOwner(db, listId, userId) {
  return db
    .select({ userId: lists.userId })
    .from(lists)
    .where(and(eq(lists.id, listId), eq(lists.userId, userId)))
}

export function getListMedia(db, listId, sort, offset, itemsPerPage) {
  return db
    .select({
      id: media.id,
      title: media.title,
      poster: media.poster,
      total: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
    })
    .from(mediaToLists)
    .fullJoin(media, eq(mediaToLists.mediaId, media.id))
    .where(and(eq(mediaToLists.listId, listId)))
    .orderBy(sort)
    .offset(offset)
    .limit(itemsPerPage)
}

export function getListMediaIds(db, listId, userId) {
  return db
    .select({
      mediaId: mediaToLists.mediaId,
    })
    .from(mediaToLists)
    .leftJoin(lists, eq(mediaToLists.listId, lists.id))
    .where(and(eq(lists.id, listId), eq(lists.userId, userId)))
}

export function getUserLists(db, mediaId, userId) {
  return db
    .select({
      id: lists.id,
      name: lists.name,
      isPrivate: lists.isPrivate,
      isWatchlist: lists.isWatchlist,
      includesMedia:
        sql`case when ${mediaToLists.mediaId} is not null then true else false end`.as(
          "includesMedia",
        ),
    })
    .from(lists)
    .leftJoin(
      mediaToLists,
      and(eq(mediaToLists.listId, lists.id), eq(mediaToLists.mediaId, mediaId)),
    )
    .where(eq(lists.userId, userId))
}

export function insertList(db, id, data, userId) {
  const newListId = id ?? crypto.randomUUID()
  return db.insert(lists).values({
    id: newListId,
    name: data.name,
    description: data.description,
    userId: userId,
    isPrivate: data.isPrivate,
    isWatchlist: data.isWatchlist,
  })
}

export function insertListMedia(db, mediaId, listId) {
  return db.insert(mediaToLists).values({
    mediaId: mediaId,
    listId: listId,
  })
}

export function deleteListMedia(db, mediaId, listId) {
  return db
    .delete(mediaToLists)
    .where(
      and(eq(mediaToLists.listId, listId), eq(mediaToLists.mediaId, mediaId)),
    )
}

export function updateList(db, data, userId, listId) {
  return db
    .update(lists)
    .set({
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate,
      isWatchlist: data.isWatchlist,
    })
    .where(and(eq(lists.id, listId), eq(lists.userId, userId)))
    .returning()
}

export function deleteList(db, listId, userId) {
  return db
    .delete(lists)
    .where(and(eq(lists.id, listId), eq(lists.userId, userId)))
}

export function followList(db, listId, userId) {
  return db.insert(listFollowers).values({
    listId: listId,
    userId: userId,
  })
}

export function unfollowList(db, listId, userId) {
  return db
    .delete(listFollowers)
    .where(
      and(eq(listFollowers.listId, listId), eq(listFollowers.userId, userId)),
    )
}
