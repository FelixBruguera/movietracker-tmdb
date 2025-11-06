import { Hono } from "hono"
import {
  getBestRatedCreators,
  getBestRatedDirectors,
  getDayOfWeekHeatmap,
  getLogsByYear,
  getMonthlyHeatmap,
  getMostWatchedActors,
  getMostWatchedCreators,
  getMostWatchedDirectors,
  getMostWatchedGenres,
  getMostWatchedMedia,
  getMostWatchedNetworks,
  getRatingDistribution,
  getRatingsByDecade,
  getRatingsByGenre,
  getRatingsByNetwork,
  getRatingsByYear,
} from "./queries"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "../../../db/schema"
import { formatHeatmap, formatMonthlyHeatmap } from "./functions"

const app = new Hono().basePath("/stats")

app.get("/movies", async (c) => {
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  console.log(id)
  const results = await db.batch([
    getRatingsByYear(db, id, "movies"),
    getRatingsByDecade(db, id, "movies"),
    getRatingsByGenre(db, id, "movies"),
    getBestRatedDirectors(db, id),
    getMostWatchedDirectors(db, id),
    getMostWatchedGenres(db, id, "movies"),
    getLogsByYear(db, id, "movies"),
    getMostWatchedActors(db, id, "movies"),
    getMostWatchedMedia(db, id, "movies"),
    getRatingDistribution(db, id, "movies"),
    getDayOfWeekHeatmap(db, id, "movies"),
    getMonthlyHeatmap(db, id, "movies"),
  ])
  return c.json({
    byYear: results[0],
    byDecade: results[1],
    byGenre: results[2],
    byDirector: results[3],
    mostWatchedDirectors: results[4],
    mostWatchedGenres: results[5],
    logsByYear: results[6],
    mostWatchedActors: results[7],
    mostWatchedMovies: results[8],
    ratingDistribution: results[9],
    dayOfWeekHeatmap: formatHeatmap(results[10]),
    monthlyHeatmap: formatMonthlyHeatmap(results[11]),
  })
})

app.get("/tv", async (c) => {
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  console.log(id)
  const results = await db.batch([
    getRatingsByYear(db, id, "tv"),
    getRatingsByDecade(db, id, "tv"),
    getRatingsByGenre(db, id, "tv"),
    getMostWatchedGenres(db, id, "tv"),
    getLogsByYear(db, id, "tv"),
    getMostWatchedActors(db, id, "tv"),
    getMostWatchedMedia(db, id, "tv"),
    getBestRatedCreators(db, id),
    getMostWatchedCreators(db, id),
    getMostWatchedNetworks(db, id),
    getRatingsByNetwork(db, id),
    getRatingDistribution(db, id, "tv"),
    getMonthlyHeatmap(db, id, "tv"),
  ])
  return c.json({
    byYear: results[0],
    byDecade: results[1],
    byGenre: results[2],
    mostWatchedGenres: results[3],
    logsByYear: results[4],
    mostWatchedActors: results[5],
    mostWatchedShows: results[6],
    bestRatedCreators: results[7],
    mostWatchedCreators: results[8],
    mostWatchedNetworks: results[9],
    bestRatedNetworks: results[10],
    ratingDistribution: results[11],
    monthlyHeatmap: formatMonthlyHeatmap(results[12]),
  })
})

export default app
