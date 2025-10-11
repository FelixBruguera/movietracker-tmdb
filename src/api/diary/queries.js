import { diary } from "../../db/schema"

export function insertLog(db, userId, mediaId) {
  return db.insert(diary).values({
    date: new Date(),
    userId: userId,
    mediaId: mediaId,
  })
}
