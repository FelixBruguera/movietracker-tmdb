import axios from "axios";
import { getAuth } from "../../lib/auth.server"
import { Hono } from "hono"
import { cors } from "hono/cors";
import moviesSchema from "../utils/moviesSchema";
 
const app = new Hono()

app.get('/', (c) => {
  return c.json({message: "Hello, Cloudflare Pages!"})
})
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
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	const auth = getAuth(c.env)
	return auth.handler(c.req.raw);
})

app.get('/api/movies', async (c) => {
	const query = c.req.query()
	console.log(query)
	query.include_adult = false
	query.language = "en-US"
  	const parsedQuery = moviesSchema.parse(query)
	console.log(query)
	console.log(parsedQuery)
	const response = 
	await axios.get(`https://api.themoviedb.org/3/discover/movie`,{params: {...parsedQuery}, headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`})
	console.log(response.request)
	return c.json(response.data)
})

export default app