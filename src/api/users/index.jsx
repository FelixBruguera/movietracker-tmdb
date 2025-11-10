import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import {
  user,
  reviews,
  diary,
  likesToReviews,
  lists,
  mediaToLists,
  listFollowers,
} from "../../db/schema"
import { sql, count, countDistinct, desc, asc } from "drizzle-orm"
import * as schema from "../../db/schema"
import {
  searchQuerySchema,
  searchQuerySchemaTV,
  searchSchema,
} from "../../utils/searchSchema"
import { HTTPException } from "hono/http-exception"
import auth from "../middleware/auth"
import {
  userDiarySchema,
  userListsSchema,
  userReviewsSchema,
  usersSchema,
} from "../../utils/usersSchema"
import { getAuth } from "../../../lib/auth.server"
import stats from "../users/stats/index"
import { formatValidationError, getSort } from "../functions"
import {
  deleteSearch,
  getDiary,
  getUser,
  getUserLists,
  getUserReviews,
  getUsers,
  getUserSearches,
  insertSearch,
  updateSearch,
} from "./queries"
import { mapGenre, mapMediaType, mapRatingRange, mapYearRange, transformFilter } from "./functions"
import { profileReviewsSchema } from "../../utils/profileSchema"

const app = new Hono().basePath("/api/users")
app.route("/:id", stats)

app.get("/", async (c) => {
  const validation = usersSchema.safeParse(c.req.query())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const db = drizzle(c.env.DB, { schema: schema })
  const itemsPerPage = 20
  const {
    page,
    "reviews.gte": minReviews,
    "logs.gte": minLogs,
  } = validation.data
  const sortOptions = {
    date: user.createdAt,
    reviews: countDistinct(reviews.id),
    logs: countDistinct(diary.id),
  }
  const sort = getSort(validation.data, sortOptions)
  const offset = page * itemsPerPage - itemsPerPage
  const usersIndex = await getUsers(
    db,
    sort,
    offset,
    itemsPerPage,
    minReviews,
    minLogs,
  )
  const total = usersIndex.at(0)?.total
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    users: usersIndex,
    total: total,
    totalPages: totalPages,
  })
})

app.get("/searches", auth, async (c) => {
  const session = c.get("session")
  const db = drizzle(c.env.DB, { schema: schema })
  const searchList = await getUserSearches(db, session.user.id)
  return c.json(searchList)
})

app.post("/searches", auth, async (c) => {
  const bodyValidation = searchSchema.safeParse(await c.req.json())
  if (!bodyValidation.success) {
    return c.json(formatValidationError(bodyValidation), 400)
  }
  const { name, path } = bodyValidation.data
  const queryValidation = path.includes("tv")
    ? searchQuerySchemaTV.safeParse(c.req.query())
    : searchQuerySchema.safeParse(c.req.query())
  if (!queryValidation.success) {
    return c.json(formatValidationError(queryValidation), 400)
  }
  const session = c.get("session")
  const parsedQuery = queryValidation.data
  parsedQuery.search = name
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await insertSearch(
      db,
      name,
      path,
      parsedQuery,
      session.user.id,
    )
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
  const validation = searchSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const id = c.req.param("id")
  const { name } = validation.data
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await updateSearch(db, name, id, session.user.id)
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
  const result = await deleteSearch(db, id, session.user.id)
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
  const result = await getUser(db, id)
  return c.json(result)
})

app.get("/:id/diary", async (c) => {
  const validation = userDiarySchema.safeParse(c.req.query())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const { sort_by, sort_order, page, filter } = validation.data
  const itemsPerPage = 5
  const group =
    sort_by === "monthly"
      ? sql`strftime('%Y-%m', ${diary.date}, 'unixepoch')`
      : sql`strftime('%Y', ${diary.date}, 'unixepoch')`
  const sort = sort_order === 1 ? asc(group) : desc(group)
  const offset = page * itemsPerPage - itemsPerPage
  const filterCondition = transformFilter(filter, diary)
  const result = await getDiary(
    db,
    group,
    sort,
    offset,
    itemsPerPage,
    id,
    filterCondition,
  )
  console.log(result)
  const total = result.at(0)?.total
  const totalGroups = result.at(0)?.totalGroups
  const totalPages = Math.ceil(totalGroups / itemsPerPage)
  return c.json({
    media: result,
    total: total,
    totalPages: totalPages,
  })
})

app.get("/:id/reviews", async (c) => {
  const validation = profileReviewsSchema.safeParse(c.req.query())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const userId = session?.user.id || null
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const { page, media_type, with_genres, "rating.gte": ratingMin, "rating.lte": ratingMax, "release_year.gte": yearMin, "release_year.lte": yearMax } = validation.data
  const itemsPerPage = 10
  const sortOptions = {
    rating: reviews.rating,
    likes: count(likesToReviews.reviewId),
    date: reviews.createdAt,
  }
  const sort = getSort(validation.data, sortOptions)
  const offset = page * itemsPerPage - itemsPerPage
  const filters = [mapMediaType(media_type, reviews), mapGenre(with_genres, schema.genresToMedia), ...mapRatingRange(ratingMin, ratingMax, reviews), ...mapYearRange(yearMin, yearMax, schema.media)]
  const result = await getUserReviews(
    db,
    id,
    userId,
    sort,
    offset,
    itemsPerPage,
    filters,
  )
  const total = result.at(0)?.total
  const averageRating = result.at(0)?.averageRating
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    reviews: result,
    total: total,
    totalPages: totalPages,
    averageRating: averageRating,
  })
})

app.get("/:id/lists", async (c) => {
  const validation = userListsSchema.safeParse(c.req.query())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const { page } = validation.data
  const itemsPerPage = 10
  const sortOptions = {
    date: lists.createdAt,
    media: countDistinct(mediaToLists.mediaId),
    followers: countDistinct(listFollowers.userId),
  }
  const sort = getSort(validation.data, sortOptions)
  const offset = page * itemsPerPage - itemsPerPage
  const result = await getUserLists(db, id, sort, offset, itemsPerPage)
  const total = result.at(0)?.total
  const totalPages = Math.ceil(total / itemsPerPage)
  return c.json({
    lists: result,
    total: total,
    totalPages: totalPages,
  })
})

export default app
