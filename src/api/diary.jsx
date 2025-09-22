import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import { eq, and } from "drizzle-orm"
import * as schema from "../db/schema"
import { HTTPException } from "hono/http-exception"
import auth from "./middleware/auth"
import {
  media,
  people,
  peopleToMedia,
  genresToMedia,
  networks,
  networksToMedia,
  diary,
} from "../db/schema"
import { newLogSchema } from "../utils/diarySchema"
import { watchlistQuery } from "./reviews"

const app = new Hono().basePath("/api/diary")
app.use(auth)

app.post("/", async (c) => {
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

app.post("/tv", async (c) => {
  const session = c.get("session")
  const { movie: show, date } = newLogSchema.parse(await c.req.json())
  const cast = show.cast
  const creators = show.created_by
  const showPeople = cast.concat(creators)
  const genres = show.genres
  const networkData = show.networks
  const db = drizzle(c.env.DB, { schema: schema })
  const peopleQueries = showPeople.map((person) =>
    db
      .insert(people)
      .values({
        id: person.id,
        name: person.name,
        profile_path: person.profile_path,
      })
      .onConflictDoNothing(),
  )
  const castToMediaQueries = cast.map((person) =>
    db
      .insert(peopleToMedia)
      .values({
        personId: person.id,
        mediaId: show.id,
        isDirector: false,
        isCreator: false,
      })
      .onConflictDoNothing(),
  )
  const networkQueries = networkData.map((network) =>
    db
      .insert(networks)
      .values({
        id: network.id,
        name: network.name,
        logo_path: network.logo_path,
      })
      .onConflictDoNothing(),
  )
  const networkToMediaQueries = networkData.map((network) =>
    db
      .insert(networksToMedia)
      .values({
        networkId: network.id,
        mediaId: show.id,
      })
      .onConflictDoNothing(),
  )
  const creatorsToMediaQueries = creators.map((person) =>
    db
      .insert(peopleToMedia)
      .values({
        personId: person.id,
        mediaId: show.id,
        isDirector: false,
        isCreator: true,
      })
      .onConflictDoNothing(),
  )
  const genreToMediaQueries = genres.map((genre) =>
    db
      .insert(genresToMedia)
      .values({
        genreId: genre.id,
        mediaId: show.id,
      })
      .onConflictDoNothing(),
  )
  const result = await db.batch([
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
    ...peopleQueries,
    ...castToMediaQueries,
    ...creatorsToMediaQueries,
    ...genreToMediaQueries,
    ...networkQueries,
    ...networkToMediaQueries,
    watchlistQuery(db, session.user.id, show.id),
    db.insert(diary).values({
      date: date,
      userId: session.user.id,
      mediaId: show.id,
    }),
  ])
  if (result[0].success) {
    return c.newResponse("", 201)
  } else {
    console.log(result)
    throw new HTTPException(500)
  }
})

app.get("/user/:mediaId", async (c) => {
  const session = c.get("session")
  const mediaId = c.req.param("mediaId")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
    .select({
      id: diary.id,
      date: diary.date,
    })
    .from(diary)
    .where(and(eq(diary.userId, session.user.id), eq(diary.mediaId, mediaId)))
  try {
    return c.json(result)
  } catch {
    throw new HTTPException(404)
  }
})

app.patch("/:id", async (c) => {
  const session = c.get("session")
  const { date } = newLogSchema.omit({ movie: true }).parse(await c.req.json())
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
    .update(diary)
    .set({
      date: date,
    })
    .where(and(eq(diary.id, id), eq(diary.userId, session.user.id)))
    .returning()
  if (result.length > 0) {
    return c.json(result)
  } else {
    throw new HTTPException(404)
  }
})

app.delete("/:id", async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
    .delete(diary)
    .where(and(eq(diary.id, id), eq(diary.userId, session.user.id)))
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

export default app
