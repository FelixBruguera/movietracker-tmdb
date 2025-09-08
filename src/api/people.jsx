import { Hono } from "hono"
import axios from "axios"
import { peopleSchema } from "../utils/peopleSchema"

const app = new Hono().basePath("/api/people")
const hourToSeconds = 3600

app.get("/:person", async (c) => {
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
      expirationTtl: hourToSeconds * 168, // 7 days,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/:person/credits", async (c) => {
  const query = c.req.query()
  const parsedQuery = peopleSchema.parse(query)
  const person = c.req.param("person")
  const { page, scope, department, sort_by } = parsedQuery
  console.log(c.req)
  const key = `people_credits_${person}_${scope}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  let response = null
  if (cacheHit) {
    console.log(`cache response`)
    response = cacheHit
  } else {
    const request = await axios.get(
      `https://api.themoviedb.org/3/person/${person}/${scope}`,
      {
        headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`,
      },
    )
    response = request.data
    console.log(response.request)
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response), {
      expirationTtl: hourToSeconds * 24,
    })
    console.log(cacheresult)
  }
  if (department === "All") {
    response = { results: [...response.cast, ...response.crew] }
  } else if (department === "Acting") {
    response = { results: response.cast }
  } else {
    response = {
      results: response.crew.filter((movie) => movie.department === department),
    }
  }
  if (sort_by === "Best rated") {
    response.results = response.results.sort(
      (a, b) => b.vote_average - a.vote_average,
    )
  } else if (sort_by === "Most votes") {
    response.results = response.results.sort(
      (a, b) => b.vote_count - a.vote_count,
    )
  } else {
    response.results = response.results.sort((a, b) =>
      scope === "tv_credits"
        ? new Date(b.first_credit_air_date) - new Date(a.first_credit_air_date)
        : new Date(b.release_date) - new Date(a.release_date),
    )
  }
  const totalPages = Math.ceil(response.results.length / 20)
  response = {
    results: response.results.slice(page * 20 - 20, page * 20),
    page: page,
    total_pages: totalPages,
  }
  return c.json(response)
})

export default app
