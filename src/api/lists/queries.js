import { and, eq, inArray } from "drizzle-orm"
import { lists, mediaToLists } from "../../db/schema"

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
