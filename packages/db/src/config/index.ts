import "dotenv/config";
import { NIL } from "uuid";

const config = {
  db: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
  },
  admin: {
    secret: process.env.ADMIN_SECRET || "",
    namespace: process.env.ADMIN_NAMESPACE || NIL,
  },
};

export default config;
