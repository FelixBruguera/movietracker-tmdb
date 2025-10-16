import { and, eq } from "drizzle-orm"
import { diary } from "../../db/schema"

export function insertLog(db, userId, mediaId, date) {
  return db.insert(diary).values({
    date: new Date(date),
    userId: userId,
    mediaId: mediaId,
  })
}

export function getUserMediaLogs(db, userId, mediaId) {
  return db.select({
    id: diary.id,
    date: diary.date,
  })
  .from(diary)
  .where(and(eq(diary.userId, userId), eq(diary.mediaId, mediaId)))
}

export function updateLog(db, date, logId, userId) {
  return db.update(diary)
  .set({
    date: date,
  })
  .where(and(eq(diary.id, logId), eq(diary.userId, userId)))
  .returning()
}

export function deleteLog(db, logId, userId) {
  return db.delete(diary)
  .where(and(eq(diary.id, logId), eq(diary.userId, userId)))
}
