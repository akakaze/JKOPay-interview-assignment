import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import config from "../config";
import * as schema from "../schema";

const pool = new Pool({
  host: config.db.host,
  port: 5432,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export const drizzleDB = drizzle(pool, { schema });
