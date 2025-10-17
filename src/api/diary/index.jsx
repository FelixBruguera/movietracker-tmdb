import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "../../db/schema"
import { HTTPException } from "hono/http-exception"
import auth from "../middleware/auth"
import { newLogSchema } from "../../utils/diarySchema"
import { watchlistQuery } from "../lists/queries"
import { insertGenreMedia, insertMedia, insertNetwork, insertNetworkMedia, insertPerson, insertPersonMedia } from "../reviews/queries"
import { deleteLog, getUserMediaLogs, insertLog, updateLog } from "./queries"
import { formatValidationError } from "../functions"
import axios from "axios"

const app = new Hono().basePath("/api/diary")
app.use(auth)

app.post("/", async (c) => {
  const validation = newLogSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const { mediaId, date } = validation.data
  const tmdbId = mediaId.split("_")[1]
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits`,
    { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
  )
  const movie = response.data
  const directors = movie.credits.crew.filter(person => person.job === "Director")
  const moviePeople = movie.credits.cast.concat(directors)
  const movieData = {      
    id: mediaId,
    title: movie.title,
    releaseDate: new Date(movie.release_date).getFullYear(),
    poster: movie.poster_path
  }
  const genres = movie.genres
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const result = await db.batch([
    insertMedia(db, movieData),
    ...moviePeople.map(person => insertPerson(db, person)),
    ...moviePeople.map(person => insertPersonMedia({
        db: db,
        mediaId: mediaId,
        personId: person.id,
        isDirector: person.job === "Director"
    })),
    ...genres.map(genre => insertGenreMedia(db, genre.id, mediaId)),
    watchlistQuery(db, session.user.id, mediaId),
    insertLog(db, userId, mediaId, date)
  ])
  if (result[0].success) {
    return c.newResponse("", 201)
  } else {
    console.log(result)
    throw new HTTPException(500)
  }
})

app.post("/tv", async (c) => {
  const validation = newLogSchema.safeParse(await c.req.json())
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const session = c.get("session")
  const { mediaId, date } = validation.data
  const tmdbId = mediaId.split("_")[1]
  const response = await axios.get(
    `https://api.themoviedb.org/3/tv/${tmdbId}?append_to_response=credits`,
    { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
  )
  const show = response.data
  const cast = show.credits.cast
  const creators = show.created_by
  const showPeople = cast.concat(creators)
  const genres = show.genres
  const networkData = show.networks
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const showData = {      
    id: mediaId,
    title: show.name,
    releaseDate: new Date(show.first_air_date).getFullYear(),
    poster: show.poster_path
  }
  const result = await db.batch([
    insertMedia(db, showData),
    ...showPeople.map(person => insertPerson(db, person)),
    ...cast.map(person => insertPersonMedia({
        db: db,
        mediaId: mediaId,
        personId: person.id
    })),
    ...creators.map(person => insertPersonMedia({
        db: db,
        mediaId: mediaId,
        personId: person.id,
        isCreator: true
    })),
    ...genres.map(genre => insertGenreMedia(db, genre.id, mediaId)),
    ...networkData.map(network => insertNetwork(db, network)),
    ...networkData.map(network => insertNetworkMedia(db, network.id, mediaId)),
    watchlistQuery(db, session.user.id, mediaId),
    insertLog(db, userId, mediaId, date)
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
  const userId = session.user.id
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await getUserMediaLogs(db, userId, mediaId)
  try {
    return c.json(result)
  } catch {
    throw new HTTPException(404)
  }
})

app.patch("/:id", async (c) => {
  const session = c.get("session")
  const { date } = newLogSchema.omit({ mediaId: true }).parse(await c.req.json())
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const result = await updateLog(db, date, id, userId)
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
  const userId = session.user.id
  const result = await deleteLog(db, id, userId)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

export default app
