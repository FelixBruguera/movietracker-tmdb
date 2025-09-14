import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text, integer, unique, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
    username: text("username").notNull(),
      displayUsername: text("displayUsername").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  searches: many(searches),
  reviews: many(reviews)
}))


export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const searches = sqliteTable("user_search", {
  id: int().primaryKey({ autoIncrement: true }),
  search: text({ mode: "json" }).notNull(),
  name: text().notNull(),
  path: text().notNull(),
  createdAt: integer("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (t) => [unique().on(t.userId, t.name), index("searches_user_id").on(t.userId)])

export const searchesRelations = relations(searches, ({ one }) => ({
  user: one(user, {
    fields: [searches.userId], 
    references: [user.id]
  })
}))

export const media = sqliteTable("media", {
  id: int().primaryKey(),
  title: text().notNull(),
  poster: text().notNull(),
  releaseDate: integer({ mode: "timestamp" }),
  isTv: integer("isTv", { mode: "boolean"}),
  createdAt: integer("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`)
})
export const mediaRelations = relations(media, ({ many }) => ({
  peopleToMedia: many(peopleToMedia),
  genresToMedia: many(genresToMedia),
  reviews: many(reviews)
}))

export const people = sqliteTable("people", {
  id: int().primaryKey(),
  name: text().notNull(),
  profile_path: text(),
  createdAt: integer("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`)
})

export const peopleRelations = relations(people, ({ many }) => ({
  peopleToMedia: many(peopleToMedia)
}))

export const genres = sqliteTable("genres", {
  id: int().primaryKey(),
  name: text().notNull(),
})

export const genresRelations = relations(genres, ({ many }) => ({
  genresToMedia: many(genresToMedia)
}))

export const genresToMedia = sqliteTable("genresToMedia", {
  genreId: integer('genre_id').notNull().references(() => genres.id),
  mediaId: integer('media_id').notNull().references(() => media.id),
}, (t) => [unique().on(t.genreId, t.mediaId), index("genresToMedia_media_id").on(t.mediaId), index("genresToMedia_genre_id").on(t.genreId)])

export const genresToMediaRelations = relations(genresToMedia, ({ one }) => ({
  genre: one(genres, {
    fields: [genresToMedia.genreId],
    references: [genres.id],
  }),
  media: one(media, {
    fields: [genresToMedia.mediaId],
    references: [media.id],
  }),
}))

export const peopleToMedia = sqliteTable("peopleToMedia", {
  personId: integer('person_id').notNull().references(() => people.id),
  mediaId: integer('media_id').notNull().references(() => media.id),
  isDirector: integer( {mode: "boolean"} ).notNull(),
  isCreator: integer( {mode: "boolean"} ).notNull()
}, (t) => [unique().on(t.mediaId, t.personId, t.isDirector, t.isCreator), index("peopleToMedia_media_id").on(t.mediaId), index("peopleToMedia_person_id").on(t.personId)])

export const peopleToMediaRelations = relations(peopleToMedia, ({ one }) => ({
  person: one(people, {
    fields: [peopleToMedia.personId],
    references: [people.id],
  }),
  media: one(media, {
    fields: [peopleToMedia.mediaId],
    references: [media.id],
  }),
}))

export const reviews = sqliteTable("reviews", {
  id: integer().primaryKey({ autoIncrement: true }),
  text: text(),
  rating: integer('rating').notNull(),
  createdAt: integer("created_at").notNull().default(sql`(current_timestamp)`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id, { onDelete: "cascade" }),
}, (t) => [unique().on(t.userId, t.mediaId), index("reviews_media_id").on(t.mediaId), index("reviews_user_id").on(t.userId)])

export const reviewsRelations = relations(reviews, ({ one }) => ({
  media: one(media, {
    fields: [reviews.mediaId], 
    references: [media.id]
  }),
  user: one(user, {
    fields: [reviews.userId], 
    references: [user.id]
  })
}))

export const likesToReviews = sqliteTable("likesToReviews", {
  userId: text('user_id').notNull().references(() => user.id,  { onDelete: "cascade" }),
  reviewId: integer('review_id').notNull().references(() => reviews.id,  { onDelete: "cascade" }),
}, (t) => [unique().on(t.userId, t.reviewId), index("likesToReviews_review_id").on(t.reviewId), index("likeToReviews_user_id").on(t.userId)])

export const likesToReviewsRelations = relations(likesToReviews, ({ one }) => ({
  user: one(user, {
    fields: [likesToReviews.userId],
    references: [user.id],
  }),
  review: one(reviews, {
    fields: [likesToReviews.reviewId],
    references: [reviews.id],
  }),
}))

export const networks = sqliteTable("networks", {
  id: int().primaryKey(),
  name: text().notNull(),
  logo_path: text()
})

export const networksRelations = relations(networks, ({ many }) => ({
  networksToMedia: many(networksToMedia)
}))

export const networksToMedia = sqliteTable("networksToMedia", {
  networkId: integer('network_id').notNull().references(() => networks.id),
  mediaId: integer('media_id').notNull().references(() => media.id),
}, (t) => [unique().on(t.networkId, t.mediaId), index("networksToMedia_media_id").on(t.mediaId), index("networksToMedia_network_id").on(t.networkId)])

export const networksToMediaRelations = relations(networksToMedia, ({ one }) => ({
  network: one(networks, {
    fields: [networksToMedia.networkId],
    references: [networks.id],
  }),
  media: one(media, {
    fields: [networksToMedia.mediaId],
    references: [media.id],
  }),
}))


