import { jsonb, timestamp } from "drizzle-orm/pg-core";

export const fieldCUDTimestamps = {
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
};

type GrantScopeOption = "profile" | "email" | "phone";
export type GrantScope = GrantScopeOption[];

export const fieldScope = {
  scope: jsonb("scope").notNull().$type<GrantScope>(),
};
