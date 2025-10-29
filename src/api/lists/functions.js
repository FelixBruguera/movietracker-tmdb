import { eq } from "drizzle-orm"
import { listFollowers, lists } from "../../db/schema"

export function mapFilterCondition(filter, userId = null) {
  switch (filter) {
    case "user":
      return eq(lists.userId, userId)
    case "following":
      return eq(listFollowers.userId, userId)
    default:
      return eq(true, true)
  }
}
