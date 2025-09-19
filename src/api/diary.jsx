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
  diary
} from "../db/schema"
import { newReviewSchema, reviewsSchema } from "../utils/reviewsSchema"
import { alias } from "drizzle-orm/sqlite-core"
import { newLogSchema } from "../utils/diarySchema"
import { watchlistQuery } from "./reviews"

const app = new Hono().basePath("/api/diary")

app.post("/", auth, async (c) => {
  const session = c.get("session")
  const { movie, date } = newLogSchema.parse(await c.req.json())
  const moviePeople = movie.cast.concat(movie.directors)
  const genres = movie.genres
  const db = drizzle(c.env.DB, { schema: schema })
  const peopleQueries = moviePeople.map((person) =>
    db
      .insert(people)
      .values({
        id: person.id,
        name: person.name,
        profile_path: person.profile_path,
      })
      .onConflictDoNothing(),
  )
  const peopleToMediaQueries = moviePeople.map((person) =>
    db
      .insert(peopleToMedia)
      .values({
        personId: person.id,
        mediaId: movie.id,
        isDirector: person.job === "Director",
        isCreator: false,
      })
      .onConflictDoNothing(),
  )
  const genreToMediaQueries = genres.map((genre) =>
    db
      .insert(genresToMedia)
      .values({
        genreId: genre.id,
        mediaId: movie.id,
      })
      .onConflictDoNothing(),
  )
  const result = await db.batch([
    db
      .insert(media)
      .values({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        releaseDate: new Date(movie.releaseDate),
      })
      .onConflictDoNothing(),
    ...peopleQueries,
    ...peopleToMediaQueries,
    ...genreToMediaQueries,
    watchlistQuery(db, session.user.id, movie.id),
    db.insert(diary).values({
      date: date,
      userId: session.user.id,
      mediaId: movie.id,
    }),
  ])
  if (result[0].success) {
    return c.newResponse("", 201)
  } else {
    console.log(result)
    throw new HTTPException(500)
  }
})

export default app