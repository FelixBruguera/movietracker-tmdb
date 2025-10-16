import { Hono } from "hono"
import axios from "axios"
import { peopleSchema } from "../../utils/peopleSchema"
import { formatValidationError } from "../functions"
import { filterByDepartment, paginate, sortBy } from "./functions"

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
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 168, // 7 days,
    })
    console.log(cacheresult)
    return c.json(response.data)
  }
})

app.get("/:person/credits", async (c) => {
  const query = c.req.query()
  const validation = peopleSchema.safeParse(query)
  if (!validation.success) {
    return c.json(formatValidationError(validation), 400)
  }
  const parsedQuery = validation.data
  const person = c.req.param("person")
  const { page, scope, department, sort_by } = parsedQuery
  const itemsPerPage = 20
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
    const cacheresult = await c.env.KV.put(key, JSON.stringify(response), {
      expirationTtl: hourToSeconds * 24,
    })
    console.log(cacheresult)
  }
  response.results = filterByDepartment(department, response)
  response.results = sortBy(sort_by, scope, response.results)
  const totalPages = Math.ceil(response.results.length / 20)
  response = {
    results: paginate(page, itemsPerPage, response.results),
    page: page,
    total_pages: totalPages,
  }
  return c.json(response)
})

export default app
