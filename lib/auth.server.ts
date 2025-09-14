import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { drizzle } from "drizzle-orm/d1"
import { username } from "better-auth/plugins"
import { user, account, session, verification } from "../src/db/schema"

export function getAuth(binding) {
  const db = drizzle(binding)
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: user,
        account: account,
        session: session,
        verification: verification,
      },
    }),
    plugins: [username()],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
  })
}
