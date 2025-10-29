import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import { count } from "drizzle-orm"
import * as schema from "../../db/schema"
import { HTTPException } from "hono/http-exception"
import auth from "../middleware/auth"
import { getAuth } from "../../../lib/auth.server.ts"
import { reviews, likesToReviews } from "../../db/schema"
import { newReviewSchema, reviewsSchema } from "../../utils/reviewsSchema"
import { formatValidationError, getSort } from "../functions"
import {
  deleteReview,
  dislikeReview,
  getMediaReviews,
  getUserReview,
  insertGenreMedia,
  insertMedia,
  insertNetwork,
  insertNetworkMedia,
  insertPeople,
  insertPeopleMedia,
  insertReview,
  likeReview,
  updateReview,
} from "./queries"
import { watchlistQuery } from "../lists/queries"
import { insertLog } from "../diary/queries"
import axios from "axios"

const app = new Hono().basePath("/api/reviews")

app.get("/:mediaId", async (c) => {
  const validation = reviewsSchema.safeParse(c.req.query())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const itemsPerPage = 10
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const page = validation.data.page
  const sortOptions = {
    rating: reviews.rating,
    likes: count(likesToReviews.reviewId),
    date: reviews.createdAt,
  }
  const sort = getSort(validation.data, sortOptions)
  const offset = page * itemsPerPage - itemsPerPage
  const userId = session?.user?.id || 0
  const result = await getMediaReviews(
    db,
    userId,
    mediaId,
    sort,
    offset,
    itemsPerPage,
  )
  const aggregates = result.at(0)
  return c.json({
    reviews: result,
    totalReviews: aggregates?.total,
    totalPages: Math.ceil(aggregates?.total / itemsPerPage) || 0,
    averageRating: aggregates?.averageRating,
  })
})

app.get("/user/:mediaId", async (c) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const response = await getUserReview(db, mediaId, session?.user?.id)
  return c.json(response)
})

app.post("/", auth, async (c) => {
  const validation = newReviewSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const { mediaId, text, rating, addToDiary } = validation.data
  const tmdbId = mediaId.split("_")[1]
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    const movie = response.data
    const directors = movie.credits.crew.filter(
      (person) => person.job === "Director",
    )
    const moviePeople = movie.credits.cast.concat(directors)
    const movieData = {
      id: mediaId,
      title: movie.title,
      releaseDate: new Date(movie.release_date).getFullYear(),
      poster: movie.poster_path,
    }
    const genres = movie.genres
    const db = drizzle(c.env.DB, { schema: schema })
    const userId = session.user.id
    const queries = [
      insertMedia(db, movieData),
      ...insertPeople(db, moviePeople),
      ...insertPeopleMedia(db, moviePeople, mediaId),
      ...genres.map((genre) => insertGenreMedia(db, genre.id, mediaId)),
      watchlistQuery(db, session.user.id, mediaId),
      insertReview(db, text, rating, userId, mediaId),
    ]
    if (addToDiary) {
      queries.push(insertLog(db, userId, mediaId, new Date()))
    }
    const result = await db.batch(queries)
    if (result[0].success) {
      return c.newResponse("", 201)
    } else {
      console.log(result)
      throw new HTTPException(500)
    }
  } catch (e) {
    if (e.cause.message.includes("Request failed with status code 404")) {
      throw new HTTPException(404, { message: "Invalid mediaId" })
    }
    throw new HTTPException(500)
  }
})

app.post("/tv", auth, async (c) => {
  const validation = newReviewSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const { mediaId, text, rating, addToDiary } = validation.data
  const tmdbId = mediaId.split("_")[1]
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbId}?append_to_response=credits`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    const show = response.data
    const cast = show.credits.cast
    const creators = show.created_by.map((creator) => {
      return { ...creator, job: "Creator" }
    })
    const showPeople = cast.concat(creators)
    const genres = show.genres
    const networkData = show.networks
    const db = drizzle(c.env.DB, { schema: schema })
    const userId = session.user.id
    const showData = {
      id: mediaId,
      title: show.name,
      releaseDate: new Date(show.first_air_date).getFullYear(),
      poster: show.poster_path,
    }
    const queries = [
      insertMedia(db, showData),
      ...insertPeople(db, showPeople),
      ...insertPeopleMedia(db, showPeople, mediaId),
      ...networkData.map((network) => insertNetwork(db, network)),
      ...networkData.map((network) =>
        insertNetworkMedia(db, network.id, mediaId),
      ),
      ...genres.map((genre) => insertGenreMedia(db, genre.id, mediaId)),
      watchlistQuery(db, session.user.id, mediaId),
      insertReview(db, text, rating, userId, mediaId),
    ]
    if (addToDiary) {
      queries.push(insertLog(db, userId, mediaId, new Date()))
    }
    const result = await db.batch(queries)
    if (result[0].success) {
      return c.newResponse("", 201)
    } else {
      console.log(result)
      throw new HTTPException(500)
    }
  } catch (e) {
    if (e.cause.message.includes("Request failed with status code 404")) {
      throw new HTTPException(404, { message: "Invalid mediaId" })
    }
    throw new HTTPException(500)
  }
})

app.patch("/:id", auth, async (c) => {
  const validation = newReviewSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const id = c.req.param("id")
  const { text, rating, addToDiary, movie } = validation.data
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const queries = [updateReview(db, text, rating, id, userId)]
  if (addToDiary) {
    queries.push(insertLog(db, userId, movie.id, new Date()))
  }
  const result = await db.batch(queries)
  console.log(result)
  if (result[0][0]) {
    return c.json(result[0][0])
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

app.delete("/:id", auth, async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await deleteReview(db, id, session.user.id)
  console.log(result)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

app.post("/like/:id", auth, async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await likeReview(db, id, session.user.id)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 201)
  } else {
    throw new HTTPException(500)
  }
})

app.delete("/like/:id", auth, async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await dislikeReview(db, id, session.user.id)
  console.log(result)
  if (result.success) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

export default app
