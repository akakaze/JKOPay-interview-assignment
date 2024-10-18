import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, uuid, char, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "./core/schemaFields";

// Define the table
export const tableChannel = pgTable("channel", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull(),
  clientId: char("clientId", { length: 22 }).notNull(),
  clientSecret: char("clientSecret", { length: 22 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  ...fieldCUDTimestamps,
});

// Define the relations
export const relationsChannel = relations(tableChannel, ({ one }) => ({
  user: one(tableChannel, {
    fields: [tableChannel.userId],
    references: [tableChannel.id],
  }),
}));

// Define the insert and select schema
export const schemaChannelInsert = createInsertSchema(tableChannel);
export const schemaChannelSelect = createSelectSchema(tableChannel);
export type ChannelSelect = InferSelectModel<typeof tableChannel>;
export type ChannelInsert = InferInsertModel<typeof tableChannel>;
