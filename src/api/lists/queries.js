import {
  and,
  countDistinct,
  eq,
  gte,
  inArray,
  or,
  count,
  sql,
  lte,
} from "drizzle-orm"
import {
  genresToMedia,
  listFollowers,
  lists,
  media,
  mediaToLists,
  user,
} from "../../db/schema"
import { alias } from "drizzle-orm/sqlite-core"
import { chunkInserts } from "../reviews/functions"

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
      posters: sql`(SELECT json_group_array(q.poster) FROM (SELECT poster FROM media_lists LEFT JOIN media ON media_lists.media_id = media.id WHERE media_lists.list_id = lists.id ORDER BY media_lists.created_at DESC LIMIT 5) AS Q)`,
      user: user.username,
      userAvatar: user.image
    })
    .from(lists)
    .leftJoin(mediaToLists, eq(lists.id, mediaToLists.listId))
    .leftJoin(listFollowers, eq(lists.id, listFollowers.listId))
    .leftJoin(user, eq(user.id, lists.userId))
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

export function getListMedia(db, listId, sort, offset, itemsPerPage, filters, userId) {
  return db
    .select({
      id: media.id,
      title: media.title,
      poster: media.poster,
      total: sql`CAST(COUNT(*) OVER() AS INTEGER)`,
    })
    .from(mediaToLists)
    .fullJoin(media, eq(mediaToLists.mediaId, media.id))
    .leftJoin(lists, eq(lists.id, mediaToLists.listId))
    .leftJoin(genresToMedia, eq(genresToMedia.mediaId, mediaToLists.mediaId))
    .where(and(eq(mediaToLists.listId, listId),or(eq(lists.isPrivate, false), eq(lists.userId, userId)), ...filters))
    .groupBy(media.id)
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

export function getUserListsWithCollectionCheck(db, mediaIds, userId) {
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
      and(eq(mediaToLists.listId, lists.id), inArray(mediaToLists.mediaId, mediaIds)),
    )
    .where(eq(lists.userId, userId))
    .groupBy(lists.id)
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

export function deleteListCollection(db, mediaIds, listId) {
  return db
    .delete(mediaToLists)
    .where(
      and(eq(mediaToLists.listId, listId), inArray(mediaToLists.mediaId, mediaIds)),
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

export function getMediaToCopy(db, listId, userId) {
  return db.select({
    mediaId: mediaToLists.mediaId,
  })
  .from(mediaToLists)
  .leftJoin(lists, eq(mediaToLists.listId, lists.id))
  .where(and(eq(mediaToLists.listId, listId), or(eq(lists.isPrivate, false), eq(lists.userId, userId))))
}

export function insertCopyMedia(db, mediaToInsert, listId) {
  const queries = mediaToInsert.map((media) => {
    return {
      listId: listId,
      mediaId: media.mediaId,
    }})
  const chunckedQueries = chunkInserts(queries, 25)
  return chunckedQueries.map((query) =>
    db.insert(mediaToLists).values(query)
  )
}
