import axios from "axios"
import { getAuth } from "../../lib/auth.server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import moviesSchema from "../utils/moviesSchema"
import stringify from "json-stable-stringify"

const app = new Hono()

app.use(
  "/api/auth/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
)

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})

app.get("/api/movies", async (c) => {
  const query = c.req.query()
  query.include_adult = false
  query.language = "en-US"
  const parsedQuery = moviesSchema.parse(query)
  const key = stringify(parsedQuery)
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: { ...parsedQuery },
        headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`,
      },
    )
    console.log(response.request)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: 43200,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/api/movies/:id", async (c) => {
  console.log(c.req)
  const id = c.req.param("id")
  console.log(id)
  const key = `movies_${id}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,keywords`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    console.log(response.request)
    response.data.credits.cast = response.data.credits.cast.slice(0, 20)
    response.data.credits.crew = response.data.credits.crew.slice(0, 10)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: 86400,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/api/movies/keyword/:keyword", async (c) => {
  const query = c.req.query()
  const parsedQuery = moviesSchema.parse(query)
  console.log(c.req)
  parsedQuery.with_keywords = c.req.param("keyword")
  const response = await axios.get(
    `https://api.themoviedb.org/3/discover/movie`,
    {
      params: { ...parsedQuery },
      headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`,
    },
  )
  console.log(response.request)
  return c.json(response.data)
})

app.get("/api/keyword/:keyword", async (c) => {
  const keyword = c.req.param("keyword")
  const response = await axios.get(
    `https://api.themoviedb.org/3/keyword/${keyword}`,
    { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
  )
  console.log(response.request)
  return c.json(response.data)
})

app.get("/api/movies/people/:person", async (c) => {
  const query = c.req.query()
  const parsedQuery = moviesSchema.parse(query)
  console.log(c.req)
  parsedQuery.with_people = c.req.param("person")
  const key = stringify(parsedQuery)
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: { ...parsedQuery },
        headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`,
      },
    )
    console.log(response.request)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: 86400,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/api/people/:person", async (c) => {
  const person = c.req.param("person")
  const key = `people_${person}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${person}`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    console.log(response.request)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: 604800,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

export default app
