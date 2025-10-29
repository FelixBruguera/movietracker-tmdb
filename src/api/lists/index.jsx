import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import { eq, countDistinct } from "drizzle-orm"
import * as schema from "../../db/schema"
import { HTTPException } from "hono/http-exception"
import auth from "../middleware/auth"
import { getAuth } from "../../../lib/auth.server"
import { lists, mediaToLists, listFollowers } from "../../db/schema"
import {
  listIndexSchema,
  listMovieSchema,
  listSchema,
  newListSchema,
} from "../../utils/listsSchema"
import { formatValidationError, getSort } from "../functions"
import { mapFilterCondition } from "./functions"
import {
  deleteList,
  deleteListMedia,
  followList,
  getList,
  getListMedia,
  getListMediaIds,
  getListOwner,
  getLists,
  getUserLists,
  insertList,
  insertListMedia,
  unfollowList,
  updateList,
} from "./queries"
import { insertMedia } from "../reviews/queries"
import axios from "axios"
const app = new Hono().basePath("/api/lists")

app.get("/", async (c) => {
  const validation = listIndexSchema.safeParse(c.req.query())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const itemsPerPage = 20
  const db = drizzle(c.env.DB, { schema: schema })
  const {
    page,
    filter,
    "followers.gte": minFollowers,
    "media.gte": minMedia,
  } = validation.data
  const sortOptions = {
    date: lists.createdAt,
    followers: countDistinct(listFollowers.userId),
    movies: countDistinct(mediaToLists.mediaId),
  }
  const sort = getSort(validation.data, sortOptions)
  const offset = page * itemsPerPage - itemsPerPage
  const userId = session?.user?.id || 0
  const filterCondition = mapFilterCondition(filter, userId)
  const listsIndex = await getLists(
    db,
    minMedia,
    minFollowers,
    userId,
    filterCondition,
    sort,
    offset,
    itemsPerPage,
  )
  const total = listsIndex.at(0)?.total
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    lists: listsIndex,
    total: total,
    totalPages: totalPages,
  })
})

app.get("/:listId", async (c) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const listId = c.req.param("listId")
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session?.user?.id || 0
  const list = await getList(db, userId, listId)
  return c.json(list)
})

app.get("/:listId/media", async (c) => {
  const validation = listSchema.safeParse(c.req.query())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const itemsPerPage = 20
  const listId = c.req.param("listId")
  const db = drizzle(c.env.DB, { schema: schema })
  const { sort_order, page } = validation.data
  const sort = getSort(
    { sort_order: sort_order, sort_by: "date" },
    { date: mediaToLists.createdAt },
  )
  const offset = page * itemsPerPage - itemsPerPage
  const listMedia = await getListMedia(db, listId, sort, offset, itemsPerPage)
  const total = listMedia.at(0)?.total || 0
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    media: listMedia,
    total: total,
    totalPages: totalPages,
  })
})

app.get("/:listId/media/ids", auth, async (c) => {
  const session = c.get("session")
  const userId = session.user.id
  const listId = c.req.param("listId")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await getListMediaIds(db, listId, userId)
  const ids = result.map((id) => id.mediaId)
  return c.json(ids)
})

app.get("/user/:mediaId", auth, async (c) => {
  const session = c.get("session")
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await getUserLists(db, mediaId, session.user.id)
  if (result) {
    return c.json(result)
  } else {
    throw new HTTPException(404)
  }
})

app.post("/", auth, async (c) => {
  const validation = newListSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await insertList(
      db,
      crypto.randomUUID(),
      validation.data,
      session.user.id,
    )
    if (result.meta.changes > 0) {
      return c.newResponse("", 201)
    } else {
      throw new HTTPException(500)
    }
  } catch (e) {
    console.log(e)
    if (e.cause.message.includes("UNIQUE constraint failed")) {
      throw new HTTPException(422, { message: "List names must be unique" })
    }
    throw new HTTPException(500)
  }
})

app.post("/copy/:listId", auth, async (c) => {
  const validation = newListSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const listId = c.req.param("listId")
  const db = drizzle(c.env.DB, { schema: schema })
  const mediaToCopy = await db
    .select({
      mediaId: mediaToLists.mediaId,
    })
    .from(mediaToLists)
    .where(eq(mediaToLists.listId, listId))
  const newListId = crypto.randomUUID()
  const batchStatements = [
    insertList(db, newListId, validation.data, session.user.id),
  ]
  if (mediaToCopy.length > 0) {
    const newMediaEntries = mediaToCopy.map((media) => ({
      listId: newListId,
      mediaId: media.mediaId,
    }))
    batchStatements.push(db.insert(mediaToLists).values(newMediaEntries))
  }
  const result = await db.batch(batchStatements)

  if (result[0].meta.changes > 0) {
    return c.newResponse(null, 201)
  } else {
    console.log(result)
    throw new HTTPException(500, { message: "Failed to copy list" })
  }
})

app.patch("/:id", auth, async (c) => {
  const validation = newListSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await updateList(db, validation.data, session.user.id, id)
  if (result.length > 0) {
    return c.json(result)
  } else {
    throw new HTTPException(404)
  }
})

app.delete("/:id", auth, async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await deleteList(db, id, session.user.id)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

app.post("/:listId/media", auth, async (c) => {
  const validation = listMovieSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const listId = c.req.param("listId")
  const list = await getListOwner(db, listId, userId)
  console.log(list)
  if (list?.at(0)?.userId !== userId) {
    return c.newResponse("Unauthorized", 401)
  }
  const { mediaId } = validation.data
  const [mediaType, tmdbId] = mediaId.split("_")
  const tmdbEndpoint = mediaType === "movies" ? "movie" : "tv"
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${tmdbEndpoint}/${tmdbId}`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    const media = response.data
    const mediaDate = media.release_date || media.first_air_date
    const mediaData = {
      id: mediaId,
      title: media.title || media.name,
      poster: media.poster_path,
      releaseDate: new Date(mediaDate).getFullYear(),
    }
    const result = await db.batch([
      insertMedia(db, mediaData),
      insertListMedia(db, mediaId, listId),
    ])
    if (result[1].meta.changes > 0) {
      return c.newResponse(null, 201)
    }
  } catch (e) {
    if (e.cause.message.includes("UNIQUE constraint failed")) {
      throw new HTTPException(400, { message: "Duplicated media" })
    } else if (
      e.cause.message.includes("Request failed with status code 404")
    ) {
      throw new HTTPException(404, { message: "Invalid mediaId" })
    }
    throw new HTTPException(404)
  }
})

app.delete("/:listId/media/:mediaId", auth, async (c) => {
  const session = c.get("session")
  const listId = c.req.param("listId")
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const list = await getListOwner(db, listId, userId)
  if (list?.at(0)?.userId !== userId) {
    return c.newResponse("Unauthorized", 401)
  }
  const result = await deleteListMedia(db, mediaId, listId)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

app.post("/:listId/follow", auth, async (c) => {
  const session = c.get("session")
  const listId = c.req.param("listId")
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const list = await db.select().from(lists).where(eq(lists.id, listId))
  if (list[0].userId === userId) {
    throw new HTTPException(400, { message: "You can't follow your own list" })
  }
  if (list[0].isPrivate) {
    throw new HTTPException(400, { message: "You can't follow a private list" })
  }
  const result = await followList(db, listId, userId)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 201)
  } else {
    throw new HTTPException(500)
  }
})

app.delete("/:listId/follow", auth, async (c) => {
  const session = c.get("session")
  const listId = c.req.param("listId")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await unfollowList(db, listId, session.user.id)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    throw new HTTPException(404)
  }
})

export default app
