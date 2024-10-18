import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migration",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});
