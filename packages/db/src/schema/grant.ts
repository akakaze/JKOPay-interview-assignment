import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  char,
  varchar,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps, fieldScope } from "./core/schemaFields";
import { tableChannel } from "./channel";
import { tableUser } from "./user";

// Define the table
export const tableGrant = pgTable("grant", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: char("code", { length: 22 }).notNull(),
  userId: uuid("userId").notNull(),
  clientId: char("clientId", { length: 22 }).notNull(),
  redirectUri: text("redirectUri").notNull(),
  ...fieldScope,
  used: boolean("used").notNull().default(false),
  expriedAt: timestamp("expriedAt", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  ...fieldCUDTimestamps,
});

// Define the relations
export const relationsGrant = relations(tableGrant, ({ one }) => ({
  user: one(tableUser, {
    fields: [tableGrant.userId],
    references: [tableUser.id],
  }),
  channel: one(tableChannel, {
    fields: [tableGrant.clientId],
    references: [tableChannel.clientId],
  }),
}));

// Define the insert and select schema
export const schemaGrantInsert = createInsertSchema(tableGrant);
export const schemaGrantSelect = createSelectSchema(tableGrant);
export type GrantSelect = InferSelectModel<typeof tableGrant>;
export type GrantInsert = InferInsertModel<typeof tableGrant>;
