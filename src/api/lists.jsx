import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import {
  eq,
  sql,
  and,
  count,
  avg,
  asc,
  desc,
  or,
  gte,
  countDistinct,
} from "drizzle-orm"
import * as schema from "../db/schema"
import { HTTPException } from "hono/http-exception"
import auth from "./middleware/auth"
import { getAuth } from "../../lib/auth.server"
import { lists, media, user, mediaToLists, listFollowers } from "../db/schema"
import { alias } from "drizzle-orm/sqlite-core"
import {
  listIndexSchema,
  listMovieSchema,
  listSchema,
  newListSchema,
} from "../utils/listsSchema"

const app = new Hono().basePath("/api/lists")

app.get("/", async (c) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const itemsPerPage = 20
  const db = drizzle(c.env.DB, { schema: schema })
  const {
    sort_by,
    sort_order,
    page,
    filter,
    "followers.gte": minFollowers,
    "media.gte": minMedia,
  } = listIndexSchema.parse(c.req.query())
  const sortCol =
    sort_by === "date"
      ? lists.createdAt
      : sort_by === "followers"
        ? countDistinct(listFollowers.userId)
        : countDistinct(mediaToLists.mediaId)
  const sort = sort_order === 1 ? asc(sortCol) : desc(sortCol)
  const offset = page * itemsPerPage - itemsPerPage
  const userId = session?.user?.id || 0
  const filterCondition =
    filter === "user"
      ? eq(lists.userId, session.user.id)
      : filter === "following"
        ? eq(listFollowers.userId, session.user.id)
        : eq(true, true)
  const [listsIndex, aggregates] = await Promise.all([
    db
      .select({
        id: lists.id,
        name: lists.name,
        description: lists.description,
        createdAt: lists.createdAt,
        isPrivate: lists.isPrivate,
        isWatchlist: lists.isWatchlist,
        followers: countDistinct(listFollowers.userId),
        media: countDistinct(mediaToLists.mediaId),
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
      .limit(itemsPerPage),
    db
      .select({
        total: count(lists.id),
      })
      .from(lists)
      .where(or(eq(lists.isPrivate, false), eq(lists.userId, userId))),
  ])
  const total = aggregates[0].total
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
  const followCheck = alias(listFollowers, "followCheck")
  const list = await db
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
    .groupBy(lists.id)
    .where(
      and(
        eq(lists.id, listId),
        or(eq(lists.isPrivate, false), eq(lists.userId, userId)),
      ),
    )
  return c.json(list)
})

app.get("/:listId/media", async (c) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const itemsPerPage = 20
  const movieCount = alias(mediaToLists, "movie_count")
  const listId = c.req.param("listId")
  const db = drizzle(c.env.DB, { schema: schema })
  const { sort_order, page } = listSchema.parse(c.req.query())
  const sort =
    sort_order === 1
      ? asc(mediaToLists.createdAt)
      : desc(mediaToLists.createdAt)
  const offset = page * itemsPerPage - itemsPerPage
  const userId = session?.user?.id || 0
  const [listMedia, aggregations] = await Promise.all([
    db
      .select({
        id: media.id,
        title: media.title,
        poster: media.poster,
        isTv: media.isTv,
      })
      .from(mediaToLists)
      .fullJoin(media, eq(mediaToLists.mediaId, media.id))
      .where(and(eq(mediaToLists.listId, listId)))
      .orderBy(sort)
      .offset(offset)
      .limit(itemsPerPage),
    db
      .select({
        total: count(mediaToLists.id),
      })
      .from(mediaToLists)
      .where(eq(mediaToLists.listId, listId))
      .groupBy(mediaToLists.listId),
  ])
  const total = aggregations[0]?.total || 0
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    media: listMedia,
    total: total,
    totalPages: totalPages,
  })
})

app.get("/user/:mediaId", auth, async (c) => {
  const session = c.get("session")
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
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
    .where(eq(lists.userId, session.user.id))
  if (result) {
    return c.json(result)
  } else {
    throw new HTTPException(404)
  }
})

app.post("/", auth, async (c) => {
  const session = c.get("session")
  const { name, description, isPrivate, isWatchlist } = newListSchema.parse(
    await c.req.json(),
  )
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await db.insert(lists).values({
      id: crypto.randomUUID(),
      name: name,
      description: description,
      userId: session.user.id,
      isPrivate: isPrivate,
      isWatchlist: isWatchlist,
    })
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
  const session = c.get("session")
  const listId = c.req.param("listId")
  const { name, description, isPrivate, isWatchlist } = newListSchema.parse(
    await c.req.json(),
  )
  const db = drizzle(c.env.DB, { schema: schema })
  const mediaToCopy = await db
    .select({
      mediaId: mediaToLists.mediaId,
    })
    .from(mediaToLists)
    .where(eq(mediaToLists.listId, listId))

  const newListId = crypto.randomUUID()
  const batchStatements = [
    db.insert(lists).values({
      id: newListId,
      name: name,
      description: description,
      userId: session.user.id,
      isPrivate: isPrivate,
      isWatchlist: isWatchlist,
    }),
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
  const session = c.get("session")
  const { name, description, isPrivate, isWatchlist } = newListSchema.parse(
    await c.req.json(),
  )
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
    .update(lists)
    .set({
      name: name,
      description: description,
      userId: session.user.id,
      isPrivate: isPrivate,
      isWatchlist: isWatchlist,
    })
    .where(and(eq(lists.id, id), eq(lists.userId, session.user.id)))
    .returning()
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
  const result = await db
    .delete(lists)
    .where(and(eq(lists.id, id), eq(lists.userId, session.user.id)))
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

app.post("/:listId/media", auth, async (c) => {
  const session = c.get("session")
  const listId = c.req.param("listId")
  const { id, title, poster, releaseDate, isTv } = listMovieSchema.parse(
    await c.req.json(),
  )
  const db = drizzle(c.env.DB, { schema: schema })
  const list = await db
    .select({ userId: lists.userId })
    .from(lists)
    .where(and(eq(lists.id, listId), eq(lists.userId, session.user.id)))
  if (list[0].userId !== session.user.id) {
    return c.newResponse("Unauthorized", 401)
  }
  const result = await db.batch([
    db
      .insert(media)
      .values({
        id: id,
        title: title,
        poster: poster,
        releaseDate: new Date(releaseDate),
        isTv: isTv,
      })
      .onConflictDoNothing(),
    db.insert(mediaToLists).values({
      mediaId: id,
      listId: listId,
    }),
  ])
  if (result[1].meta.changes > 0) {
    return c.newResponse(null, 201)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

app.delete("/:listId/media/:mediaId", auth, async (c) => {
  const session = c.get("session")
  const listId = c.req.param("listId")
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const list = await db
    .select({ userId: lists.userId })
    .from(lists)
    .where(and(eq(lists.id, listId), eq(lists.userId, session.user.id)))
  if (list[0].userId !== session.user.id) {
    return c.newResponse("Unauthorized", 401)
  }
  const result = await db
    .delete(mediaToLists)
    .where(
      and(eq(mediaToLists.listId, listId), eq(mediaToLists.mediaId, mediaId)),
    )
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
  const list = await db.select().from(lists).where(eq(lists.id, listId))
  if (list[0].userId === session.user.id) {
    return c.newResponse("You can't follow your own list", 400)
  }
  if (list[0].isPrivate) {
    return c.newResponse("You can't follow a private list", 400)
  }
  const result = await db.insert(listFollowers).values({
    listId: listId,
    userId: session.user.id,
  })
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
  const result = await db
    .delete(listFollowers)
    .where(
      and(
        eq(listFollowers.listId, listId),
        eq(listFollowers.userId, session.user.id),
      ),
    )
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    throw new HTTPException(404)
  }
})

export default app
