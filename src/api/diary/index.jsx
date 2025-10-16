import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "../../db/schema"
import { HTTPException } from "hono/http-exception"
import auth from "../middleware/auth"
import { newLogSchema } from "../../utils/diarySchema"
import { watchlistQuery } from "../lists/queries"
import { insertGenreMedia, insertMedia, insertNetwork, insertNetworkMedia, insertPerson, insertPersonMedia } from "../reviews/queries"
import { deleteLog, getUserMediaLogs, insertLog, updateLog } from "./queries"

const app = new Hono().basePath("/api/diary")
app.use(auth)

app.post("/", async (c) => {
    const session = c.get("session")
  const { movie, date } = newLogSchema.parse(await c.req.json())
  const moviePeople = movie.cast.concat(movie.directors)
  const genres = movie.genres
  const db = drizzle(c.env.DB, { schema: schema })
  const userId = session.user.id
  const result = await db.batch([
    insertMedia(db, movie, false),
    ...moviePeople.map(person => insertPerson(db, person)),
    ...moviePeople.map(person => insertPersonMedia({
        db: db,
        mediaId: movie.id,
        personId: person.id,
        isDirector: person.job === "Director"
    })),
    ...genres.map(genre => insertGenreMedia(db, genre.id, movie.id)),
    watchlistQuery(db, session.user.id, movie.id),
    insertLog(db, userId, movie.id, date)
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
  const userId = session.user.id
  const result = await db.batch([
    insertMedia(db, show, true),
    ...showPeople.map(person => insertPerson(db, person)),
    ...cast.map(person => insertPersonMedia({
        db: db,
        mediaId: show.id,
        personId: person.id
    })),
    ...creators.map(person => insertPersonMedia({
        db: db,
        mediaId: show.id,
        personId: person.id,
        isCreator: true
    })),
    ...genres.map(genre => insertGenreMedia(db, genre.id, show.id)),
    ...networkData.map(network => insertNetwork(db, network)),
    ...networkData.map(network => insertNetworkMedia(db, network.id, show.id)),
    watchlistQuery(db, session.user.id, show.id),
    insertLog(db, userId, show.id, date)
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
  const { date } = newLogSchema.omit({ movie: true }).parse(await c.req.json())
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
