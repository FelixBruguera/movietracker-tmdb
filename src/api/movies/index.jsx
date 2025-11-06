import { Hono } from "hono"
import axios from "axios"
import moviesSchema from "../../utils/moviesSchema"
import { createCacheKey } from "../../utils/createCacheKey"
import stableStringify from "json-stable-stringify"
import { filterCredits, formatSort } from "./functions"
import { formatValidationError } from "../functions"

const app = new Hono().basePath("/api/movies")
const hourToSeconds = 3600

app.get("/", async (c) => {
  const query = c.req.query()
  query.include_adult = false
  query.language = "en-US"
  const validation = moviesSchema.safeParse(query)
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const parsedQuery = validation.data
  parsedQuery.sort_by = formatSort(parsedQuery.sort_by, parsedQuery.sort_order)
  const key = await createCacheKey(stableStringify(parsedQuery))
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
    await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 12,
    })
    return c.json(response.data)
  }
})

app.get("/:id", async (c) => {
  console.log(c.req)
  const id = c.req.param("id")
  const { region } = c.req.query()
  const key = `movies_${id}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    if (cacheHit["watch/providers"]) {
      cacheHit["watch/providers"].results =
        cacheHit["watch/providers"].results[region]
    }
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,keywords,recommendations,watch/providers`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    console.log(response)
    response.data.credits = filterCredits(response.data.credits)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 24,
    })
    console.log(cacheresult)
    if (response.data["watch/providers"]) {
      response.data["watch/providers"].results =
        response.data["watch/providers"].results[region]
    }
    return c.json(response.data)
  }
})

app.get("/:id/credits", async (c) => {
  console.log(c.req)
  const id = c.req.param("id")
  const key = `credits_${id}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`,
      { headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}` },
    )
    console.log(response)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 24,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/company/:company", async (c) => {
  const query = c.req.query()
  const validation = moviesSchema.safeParse(query)
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const parsedQuery = validation.data
  parsedQuery.sort_by = formatSort(parsedQuery.sort_by, parsedQuery.sort_order)
  parsedQuery.with_companies = c.req.param("company")
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

export default app
