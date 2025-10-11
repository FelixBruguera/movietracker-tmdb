import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import {
  searches,
  user,
  reviews,
  diary,
  media,
  likesToReviews,
  lists,
  mediaToLists,
  listFollowers,
} from "../db/schema"
import {
  eq,
  sql,
  and,
  count,
  countDistinct,
  desc,
  asc,
  gte,
  avg,
} from "drizzle-orm"
import * as schema from "../db/schema"
import {
  searchQuerySchema,
  searchQuerySchemaTV,
  searchSchema,
} from "../utils/searchSchema"
import { HTTPException } from "hono/http-exception"
import auth from "./middleware/auth"
import {
  userDiarySchema,
  userListsSchema,
  userReviewsSchema,
  usersSchema,
} from "../utils/usersSchema"
import { alias } from "drizzle-orm/sqlite-core"
import { getAuth } from "../../lib/auth.server"

const app = new Hono().basePath("/api/users")

app.get("/", async (c) => {
  const db = drizzle(c.env.DB, { schema: schema })
  const itemsPerPage = 20
  const {
    page,
    sort_by,
    sort_order,
    "reviews.gte": minReviews,
    "logs.gte": minLogs,
  } = usersSchema.parse(c.req.query())
  const sortCol =
    sort_by === "date"
      ? user.createdAt
      : sort_by === "reviews"
        ? countDistinct(reviews.id)
        : countDistinct(diary.id)
  const sort = sort_order === 1 ? asc(sortCol) : desc(sortCol)
  const offset = page * itemsPerPage - itemsPerPage
  const [usersIndex, aggregates] = await Promise.all([
    db
      .select({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        image: user.image,
        reviews: countDistinct(reviews.id),
        logs: countDistinct(diary.id),
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
      ),
    db
      .select({
        total: count(user.id),
      })
      .from(user),
  ])
  const total = aggregates[0].total
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    users: usersIndex,
    total: total,
    totalPages: totalPages,
  })
})

app.get("/searches", auth, async (c) => {
  console.log("searches")
  const session = c.get("session")
  const db = drizzle(c.env.DB, { schema: schema })
  console.log(session)
  const searchList = await db
    .select({
      id: searches.id,
      search: searches.search,
      path: searches.path,
      name: searches.name,
    })
    .from(searches)
    .where(eq(session.user.id, searches.userId))
  return c.json(searchList)
})

app.post("/searches", auth, async (c) => {
  const session = c.get("session")
  const body = await c.req.json()
  console.log(body)
  const parsedBody = searchSchema.parse(body)
  const query = c.req.query()
  console.log(query, query.include_adult)
  const parsedQuery = parsedBody.path.includes("tv")
    ? searchQuerySchemaTV.parse(query)
    : searchQuerySchema.parse(query)
  parsedQuery.search = parsedBody.name
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await db
      .insert(searches)
      .values({
        name: parsedBody.name,
        path: parsedBody.path,
        search: parsedQuery,
        userId: session.user.id,
      })
      .returning({
        id: searches.id,
        name: searches.name,
        search: searches.search,
        path: searches.path,
      })
    return c.json(result)
  } catch (e) {
    console.log(e.cause.message)
    if (e.cause.message.includes("UNIQUE constraint failed")) {
      throw new HTTPException(400, { message: "Search name must be unique" })
    } else {
      throw new HTTPException(500)
    }
  }
})

app.patch("/searches/:id", auth, async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const body = await c.req.json()
  const { name } = searchSchema.parse(body)
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await db
      .update(searches)
      .set({ name: name, search: sql`json_set(search, '$.search', ${name})` })
      .where(and(eq(searches.id, id), eq(searches.userId, session.user.id)))
      .returning({
        id: searches.id,
        name: searches.name,
        search: searches.search,
        path: searches.path,
      })
    if (result.length > 0) {
      return c.json(result[0])
    } else {
      return c.newResponse(null, 404)
    }
  } catch (e) {
    console.log(e.cause.message)
    if (e.cause.message.includes("UNIQUE constraint failed")) {
      throw new HTTPException(400, { message: "Search name must be unique" })
    } else {
      throw new HTTPException(500)
    }
  }
})

app.delete("/searches/:id", auth, async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
    .delete(searches)
    .where(and(eq(searches.id, id), eq(searches.userId, session.user.id)))
  console.log(result)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

app.get("/:id", async (c) => {
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
    .select({
      id: user.id,
      username: user.username,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, id))
  return c.json(result)
})

app.get("/:id/diary", async (c) => {
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const { sort_by, sort_order, page } = userDiarySchema.parse(c.req.query())
  const itemsPerPage = 5
  const group =
    sort_by === "monthly"
      ? sql`strftime('%Y-%m', ${diary.date}, 'unixepoch')`
      : sql`strftime('%Y', ${diary.date}, 'unixepoch')`
  const sort = sort_order === 1 ? asc(group) : desc(group)
  const offset = page * itemsPerPage - itemsPerPage
  const [result, aggregations] = await Promise.all([
    db
      .select({
        group: group,
        entries:
          sql`json_group_array(json_object('mediaId', ${media.id}, 'diaryId', ${diary.id}, 'poster_path', ${media.poster}, 'title', ${media.title}, 'date', ${diary.date}, 'isTv', ${media.isTv}))`.mapWith(
            JSON.parse,
          ),
      })
      .from(diary)
      .innerJoin(media, eq(diary.mediaId, media.id))
      .where(eq(diary.userId, id))
      .groupBy(group)
      .orderBy(sort)
      .offset(offset)
      .limit(itemsPerPage),
    db
      .select({
        totalGroups: countDistinct(group),
        totalEntries: count(diary.id),
      })
      .from(diary)
      .where(eq(diary.userId, id)),
  ])
  const total = aggregations[0].totalEntries
  const totalGroups = aggregations[0].totalGroups
  const totalPages = Math.ceil(totalGroups / itemsPerPage)
  return c.json({
    media: result,
    total: total,
    totalPages: totalPages,
  })
})

app.get("/:id/reviews", async (c) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const userId = session?.user.id || null
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const { sort_by, sort_order, page } = userReviewsSchema.parse(c.req.query())
  const itemsPerPage = 10
  const sortCol =
    sort_by === "rating"
      ? reviews.rating
      : sort_by === "likes"
        ? count(likesToReviews.reviewId)
        : reviews.createdAt
  const sort = sort_order === 1 ? asc(sortCol) : desc(sortCol)
  const offset = page * itemsPerPage - itemsPerPage
  const currentUserLike = alias(likesToReviews, "currentUserLike")
  const [result, aggregations] = await Promise.all([
    db
      .select({
        id: reviews.id,
        text: reviews.text,
        rating: reviews.rating,
        createdAt: reviews.createdAt,
        likes: count(likesToReviews.reviewId),
        currentUserLiked:
          sql`case when ${currentUserLike.userId} is not null then true else false end`.as(
            "currentUserLiked",
          ),
        media: {
          id: media.id,
          poster_path: media.poster,
          title: media.title,
          isTv: media.isTv,
        },
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
      .limit(itemsPerPage),
    db
      .select({
        total: count(reviews.id),
        averageRating: avg(reviews.rating),
      })
      .from(reviews)
      .where(eq(reviews.userId, id)),
  ])
  const total = aggregations[0].total
  const averageRating = aggregations[0].averageRating
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    reviews: result,
    total: total,
    totalPages: totalPages,
    averageRating: averageRating,
  })
})

app.get("/:id/lists", async (c) => {
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const { sort_by, sort_order, page } = userListsSchema.parse(c.req.query())
  const itemsPerPage = 10
  const sortCol =
    sort_by === "date"
      ? lists.createdAt
      : sort_by === "media"
        ? countDistinct(mediaToLists.mediaId)
        : countDistinct(listFollowers.userId)
  const sort = sort_order === 1 ? asc(sortCol) : desc(sortCol)
  const offset = page * itemsPerPage - itemsPerPage
  const [result, aggregations] = await Promise.all([
    db
      .select({
        id: lists.id,
        name: lists.name,
        description: lists.description,
        createdAt: lists.createdAt,
        isWatchlist: lists.isWatchlist,
        media: countDistinct(mediaToLists.mediaId),
        followers: countDistinct(listFollowers.userId),
      })
      .from(lists)
      .leftJoin(mediaToLists, eq(lists.id, mediaToLists.listId))
      .leftJoin(listFollowers, eq(lists.id, listFollowers.listId))
      .groupBy(lists.id)
      .where(and(eq(lists.userId, id), eq(lists.isPrivate, false)))
      .orderBy(sort)
      .offset(offset)
      .limit(itemsPerPage),
    db
      .select({
        total: count(lists.id),
      })
      .from(lists)
      .where(and(eq(lists.userId, id), eq(lists.isPrivate, false))),
  ])
  const total = aggregations[0].total
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    lists: result,
    total: total,
    totalPages: totalPages,
  })
})

export default app
