import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, uuid, char, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps, fieldScope } from "./core/schemaFields";
import { tableUser } from "./user";
import { tableChannel } from "./channel";

// Define the table
export const tableAccess = pgTable("access", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull(),
  channelId: uuid("channelId").notNull(),
  ...fieldScope,
  accessToken: char("accessToken", { length: 22 }).notNull(),
  refreshToken: char("refreshToken", { length: 22 }).notNull(),
  expriedAt: timestamp("expriedAt", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  ...fieldCUDTimestamps,
});

// Define the relations
export const relationsAccess = relations(tableAccess, ({ one }) => ({
  user: one(tableUser, {
    fields: [tableAccess.userId],
    references: [tableUser.id],
  }),
  channel: one(tableChannel, {
    fields: [tableAccess.channelId],
    references: [tableChannel.id],
  }),
}));

// Define the insert and select schema
export const schemaAccessInsert = createInsertSchema(tableAccess);
export const schemaAccessSelect = createSelectSchema(tableAccess);
export type AccessSelect = InferSelectModel<typeof tableAccess>;
export type AccessInsert = InferInsertModel<typeof tableAccess>;
