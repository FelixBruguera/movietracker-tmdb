import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text, integer, unique, index } from "drizzle-orm/sqlite-core";
import { id } from "zod/v4/locales";

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
  reviews: many(reviews),
  logs: many(diary)
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
  releaseDate: integer("release_date", { mode: "timestamp" }),
  isTv: integer("is_tv", { mode: "boolean"}),
  createdAt: integer("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`)
})
export const mediaRelations = relations(media, ({ many }) => ({
  peopleToMedia: many(peopleToMedia),
  genresToMedia: many(genresToMedia),
  reviews: many(reviews),
  logs: many(diary)
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

export const genresToMedia = sqliteTable("genres_media", {
  genreId: integer('genre_id').notNull().references(() => genres.id),
  mediaId: integer('media_id').notNull().references(() => media.id),
}, (t) => [unique().on(t.genreId, t.mediaId), index("genres_media_media_id").on(t.mediaId), index("genres_media_genre_id").on(t.genreId)])

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

export const peopleToMedia = sqliteTable("people_media", {
  personId: integer('person_id').notNull().references(() => people.id),
  mediaId: integer('media_id').notNull().references(() => media.id),
  isDirector: integer("is_director", {mode: "boolean"} ).notNull(),
  isCreator: integer("is_creator", {mode: "boolean"} ).notNull()
}, (t) => [unique().on(t.mediaId, t.personId, t.isDirector, t.isCreator), index("people_media_media_id").on(t.mediaId), index("people_media_person_id").on(t.personId)])

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

export const likesToReviews = sqliteTable("likes_reviews", {
  userId: text('user_id').notNull().references(() => user.id,  { onDelete: "cascade" }),
  reviewId: integer('review_id').notNull().references(() => reviews.id,  { onDelete: "cascade" }),
}, (t) => [unique().on(t.userId, t.reviewId), index("likes_reviews_review_id").on(t.reviewId), index("likes_reviews_user_id").on(t.userId)])

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

export const networksToMedia = sqliteTable("networks_media", {
  networkId: integer('network_id').notNull().references(() => networks.id),
  mediaId: integer('media_id').notNull().references(() => media.id),
}, (t) => [unique().on(t.networkId, t.mediaId), index("networks_media_media_id").on(t.mediaId), index("networks_media_network_id").on(t.networkId)])

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

export const lists = sqliteTable("lists", {
  id: text().primaryKey(),
  name: text(),
  description: text(),
  isPrivate: int("is_private", { mode: "boolean" }).default(false),
  isWatchlist: int("is_watchlist", { mode: "boolean" }).default(false),
  createdAt: integer("created_at").notNull().default(sql`(current_timestamp)`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (t) => [unique().on(t.userId, t.name), index("lists_user_id").on(t.userId)])

export const listsRelations = relations(lists, ({ one, many }) => ({
  media: many(media),
  followers: many(listFollowers),
  user: one(user, {
    fields: [lists.userId], 
    references: [user.id]
  })
}))

export const mediaToLists = sqliteTable("media_lists", {
  listId: text('list_id').notNull().references(() => lists.id,  { onDelete: "cascade" }),
  mediaId: integer('media_id').notNull().references(() => media.id,  { onDelete: "cascade" }),
  createdAt: integer("created_at").notNull().default(sql`(current_timestamp)`)
}, (t) => [unique().on(t.listId, t.mediaId), index("media_lists_list_id").on(t.listId), index("media_lists_media_id").on(t.mediaId)])

export const mediaToListsRelations = relations(mediaToLists, ({ one }) => ({
  list: one(lists, {
    fields: [mediaToLists.listId],
    references: [lists.id],
  }),
  media: one(media, {
    fields: [mediaToLists.mediaId],
    references: [media.id],
  }),
}))

export const listFollowers = sqliteTable("list_followers", {
  listId: text('list_id').notNull().references(() => lists.id,  { onDelete: "cascade" }),
  userId: integer('user_id').notNull().references(() => user.id,  { onDelete: "cascade" }),
}, (t) => [unique().on(t.listId, t.userId), index("list_followers_list_id").on(t.listId), index("list_followers_user_id").on(t.userId)])

export const listFollowersRelations = relations(listFollowers, ({ one }) => ({
  list: one(lists, {
    fields: [listFollowers.listId],
    references: [lists.id],
  }),
  user: one(user, {
    fields: [listFollowers.userId],
    references: [user.id],
  }),
}))

export const diary = sqliteTable("diary", {
  id: integer().primaryKey({ autoIncrement: true }),
  date: integer({ mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id, { onDelete: "cascade" }),
}, (t) => [
  index("diary_media_id").on(t.mediaId), 
  index("diary_user_id").on(t.userId),
  index("diary_yearly_idx").on(sql`strftime('%Y', date)`),
  index("diary_monthly_idx").on(sql`strftime('%Y-%m', date)`)
])

export const diaryRelations = relations(diary, ({ one }) => ({
  user: one(user, {
    fields: [diary.userId],
    references: [user.id],
  }),
  media: one(media, {
    fields: [diary.mediaId],
    references: [media.id],
  }),
}))



