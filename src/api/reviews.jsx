import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import { eq, sql, and, count, avg, asc, desc, inArray } from "drizzle-orm"
import * as schema from "../db/schema"
import { HTTPException } from "hono/http-exception"
import auth from "./middleware/auth"
import { getAuth } from "../../lib/auth.server"
import {
  reviews,
  media,
  people,
  peopleToMedia,
  genresToMedia,
  user,
  likesToReviews,
  networks,
  networksToMedia,
  lists,
  mediaToLists,
  diary,
} from "../db/schema"
import { newReviewSchema, reviewsSchema } from "../utils/reviewsSchema"
import { alias } from "drizzle-orm/sqlite-core"

const app = new Hono().basePath("/api/reviews")

app.get("/:mediaId", async (c) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const itemsPerPage = 10
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const { sort_by, sort_order, page } = reviewsSchema.parse(c.req.query())
  const sortCol =
    sort_by === "date"
      ? reviews.createdAt
      : sort_by === "rating"
        ? reviews.rating
        : count(likesToReviews.reviewId)
  const sort = sort_order === 1 ? asc(sortCol) : desc(sortCol)
  console.log([sort_by, sort])
  const offset = page * itemsPerPage - itemsPerPage
  const currentUserLike = alias(likesToReviews, "currentUserLike")
  const userId = session?.user?.id || 0
  const [reviewList, aggregates] = await Promise.all([
    db
      .select({
        id: reviews.id,
        text: reviews.text,
        rating: reviews.rating,
        createdAt: reviews.createdAt,
        user: {
          id: reviews.userId,
          username: user.username,
          image: user.image,
        },
        likes: count(likesToReviews.reviewId),
        currentUserLiked:
          sql`case when ${currentUserLike.userId} is not null then true else false end`.as(
            "currentUserLiked",
          ),
      })
      .from(reviews)
      .fullJoin(user, eq(reviews.userId, user.id))
      .leftJoin(likesToReviews, eq(reviews.id, likesToReviews.reviewId))
      .groupBy(reviews.id)
      .leftJoin(
        currentUserLike,
        and(
          eq(reviews.id, currentUserLike.reviewId),
          eq(currentUserLike.userId, userId),
        ),
      )
      .groupBy(reviews.id)
      .where(eq(reviews.mediaId, mediaId))
      .orderBy(sort)
      .offset(offset)
      .limit(itemsPerPage),
    db
      .select({
        totalReviews: count(reviews.id),
        averageRating: avg(reviews.rating),
      })
      .from(reviews)
      .where(eq(reviews.mediaId, mediaId)),
  ])
  const aggregateData = aggregates[0]
  return c.json({
    reviews: reviewList,
    totalReviews: aggregateData.totalReviews,
    averageRating: aggregateData.averageRating,
  })
})

app.get("/user/:mediaId", async (c) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const response = session
    ? await db
        .select({
          id: reviews.id,
          text: reviews.text,
          rating: reviews.rating,
          createdAt: reviews.createdAt,
        })
        .from(reviews)
        .where(
          and(
            eq(reviews.mediaId, mediaId),
            eq(reviews.userId, session.user.id),
          ),
        )
    : []
  return c.json(response)
})

export const watchlistQuery = (db, userId, mediaId) => {
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

app.post("/", auth, async (c) => {
  const session = c.get("session")
  const { movie, text, rating, addToDiary } = newReviewSchema.parse(
    await c.req.json(),
  )
  const moviePeople = movie.cast.concat(movie.directors)
  const genres = movie.genres
  const db = drizzle(c.env.DB, { schema: schema })
  const queries = [
    db
      .insert(media)
      .values({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        releaseDate: new Date(movie.releaseDate),
      })
      .onConflictDoNothing(),
    ...moviePeople.map((person) =>
      db
        .insert(people)
        .values({
          id: person.id,
          name: person.name,
          profile_path: person.profile_path,
        })
        .onConflictDoNothing(),
    ),
    ...moviePeople.map((person) =>
      db
        .insert(peopleToMedia)
        .values({
          personId: person.id,
          mediaId: movie.id,
          isDirector: person.job === "Director",
          isCreator: false,
        })
        .onConflictDoNothing(),
    ),
    ...genres.map((genre) =>
      db
        .insert(genresToMedia)
        .values({
          genreId: genre.id,
          mediaId: movie.id,
        })
        .onConflictDoNothing(),
    ),
    watchlistQuery(db, session.user.id, movie.id),
    db.insert(reviews).values({
      text: text,
      rating: rating,
      userId: session.user.id,
      mediaId: movie.id,
    }),
  ]

  if (addToDiary) {
    queries.push(
      db.insert(diary).values({
        date: new Date(),
        userId: session.user.id,
        mediaId: movie.id,
      }),
    )
  }
  const result = await db.batch(queries)
  if (result[0].success) {
    return c.newResponse("", 201)
  } else {
    console.log(result)
    throw new HTTPException(500)
  }
})

app.post("/tv", auth, async (c) => {
  const session = c.get("session")
  const {
    movie: show,
    text,
    rating,
    addToDiary,
  } = newReviewSchema.parse(await c.req.json())
  const cast = show.cast
  const creators = show.created_by
  const showPeople = cast.concat(creators)
  const genres = show.genres
  const networkData = show.networks
  const db = drizzle(c.env.DB, { schema: schema })
  const queries = [
    db
      .insert(media)
      .values({
        id: show.id,
        title: show.title,
        poster: show.poster,
        releaseDate: new Date(show.releaseDate),
        isTv: true,
      })
      .onConflictDoNothing(),
    ...showPeople.map((person) =>
      db
        .insert(people)
        .values({
          id: person.id,
          name: person.name,
          profile_path: person.profile_path,
        })
        .onConflictDoNothing(),
    ),
    ...cast.map((person) =>
      db
        .insert(peopleToMedia)
        .values({
          personId: person.id,
          mediaId: show.id,
          isDirector: false,
          isCreator: false,
        })
        .onConflictDoNothing(),
    ),
    ...networkData.map((network) =>
      db
        .insert(networks)
        .values({
          id: network.id,
          name: network.name,
          logo_path: network.logo_path,
        })
        .onConflictDoNothing(),
    ),
    ...networkData.map((network) =>
      db
        .insert(networksToMedia)
        .values({
          networkId: network.id,
          mediaId: show.id,
        })
        .onConflictDoNothing(),
    ),
    ...creators.map((person) =>
      db
        .insert(peopleToMedia)
        .values({
          personId: person.id,
          mediaId: show.id,
          isDirector: false,
          isCreator: true,
        })
        .onConflictDoNothing(),
    ),
    ...genres.map((genre) =>
      db
        .insert(genresToMedia)
        .values({
          genreId: genre.id,
          mediaId: show.id,
        })
        .onConflictDoNothing(),
    ),
    watchlistQuery(db, session.user.id, show.id),
    db.insert(reviews).values({
      text: text,
      rating: rating,
      userId: session.user.id,
      mediaId: show.id,
    }),
  ]
  if (addToDiary) {
    queries.push(
      db.insert(diary).values({
        date: new Date(),
        userId: session.user.id,
        mediaId: show.id,
      }),
    )
  }
  const result = await db.batch(queries)
  if (result[0].success) {
    return c.newResponse("", 201)
  } else {
    console.log(result)
    throw new HTTPException(500)
  }
})

app.patch("/:id", auth, async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const { text, rating, addToDiary, movie } = newReviewSchema.parse(
    await c.req.json(),
  )
  const db = drizzle(c.env.DB, { schema: schema })
  const queries = [
    db
      .update(reviews)
      .set({ text: text, rating: rating })
      .where(and(eq(reviews.id, id), eq(reviews.userId, session.user.id)))
      .returning({ text: reviews.text, rating: reviews.rating }),
  ]
  if (addToDiary) {
    queries.push(
      db.insert(diary).values({
        date: new Date(),
        userId: session.user.id,
        mediaId: movie.id,
      }),
    )
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
  const result = await db
    .delete(reviews)
    .where(and(eq(reviews.id, id), eq(reviews.userId, session.user.id)))
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
  const result = await db
    .insert(likesToReviews)
    .values({ userId: session.user.id, reviewId: id })
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
  const result = await db
    .delete(likesToReviews)
    .where(
      and(
        eq(likesToReviews.userId, session.user.id),
        eq(likesToReviews.reviewId, id),
      ),
    )
  console.log(result)
  if (result.success) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

export default app
