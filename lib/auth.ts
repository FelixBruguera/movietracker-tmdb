import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { reactStartCookies } from "better-auth/react-start";
import { username } from "better-auth/plugins"
import { user, account, session, verification } from "../src/db/schema"
import { getBindings } from "src/utils/bindings";

const env = getBindings()
const db = drizzle(env.DB)
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
        user: user,
        account: account,
        session: session,
        verification: verification
    }
  }),
  plugins: [username(), reactStartCookies()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
    emailAndPassword: {
    	enabled: true,
    	autoSignIn: false
  },
})