import axios from "axios"
import { getAuth } from "../../lib/auth.server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import movies from "./movies"
import people from "./people"
import tv from "./tv"
import users from "./users"
import search from "./search"
import reviews from "./reviews"
import lists from "./lists"
import diary from "./diary"

const app = new Hono()
const hourToSeconds = 3600
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
  const auth = getAuth(c.env.DB)
  return auth.handler(c.req.raw)
})

app.route("/", movies)
app.route("/", tv)
app.route("/", people)
app.route("/", users)
app.route("/", search)
app.route("/", reviews)
app.route("/", lists)
app.route("/", diary)

app.get("/api/company/:company", async (c) => {
  const company = c.req.param("company")
  const key = `company_${company}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/company/${company}`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 168, // 7 days,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/api/network/:network", async (c) => {
  const network = c.req.param("network")
  const key = `network_${network}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/network/${network}`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 168, // 7 days,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/api/keyword/search/:query", async (c) => {
  const query = c.req.param("query")
  const response = await axios.get(
    `https://api.themoviedb.org/3/search/keyword`,
    {
      params: { query: query },
      headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`,
    },
  )
  console.log(response.request)
  return c.json(response.data)
})

app.get("/api/services/:region", async (c) => {
  const region = c.req.param("region")
  const key = `services_${region}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/watch/providers/movie`,
      {
        params: { watch_region: region },
        headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`,
      },
    )
    response.data.results.forEach((result) => delete result.display_priorities)
    console.log(response.request)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 168, // 7 days,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

export default app
