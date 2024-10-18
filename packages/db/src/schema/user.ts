import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { fieldCUDTimestamps } from "./core/schemaFields";
import { tableChannel } from "./channel";
import { phoneCountryCodePgEnum } from "./enum";

// Define the table
export const tableUser = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  account: varchar("account", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  phoneCountryCode: phoneCountryCodePgEnum("phoneCountryCode").default("TW"),
  ...fieldCUDTimestamps,
});

// Define the relations
export const relationsUser = relations(tableUser, ({ many }) => ({
  chanel: many(tableChannel),
}));

// Define the insert and select schema
export const schemaUserInsert = createInsertSchema(tableUser);
export const schemaUserSelect = createSelectSchema(tableUser);
export type UserSelect = InferSelectModel<typeof tableUser>;
export type UserInsert = InferInsertModel<typeof tableUser>;
