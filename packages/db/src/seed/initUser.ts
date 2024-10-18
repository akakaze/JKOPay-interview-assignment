import { v5 } from "uuid";
import { drizzleDB, tableUser } from "..";
import config from "../config";
import crypto from "crypto";

function main() {
  return drizzleDB
    .insert(tableUser)
    .values([
      {
        id: v5("customer", config.admin.namespace),
        account: "customer",
        password: crypto
          .createHmac("sha256", config.admin.secret)
          .update("customer@jko")
          .digest("base64"),
        name: "一位喜歡街口的客人",
        email: "customer@e.mail",
        phone: "987654321",
        phoneCountryCode: "TW",
      },
      {
        id: v5("socool3cshop", config.admin.namespace),
        account: "socool3cshop",
        password: crypto
          .createHmac("sha256", config.admin.secret)
          .update("socool3cshop@jko")
          .digest("base64"),
        name: "好酷3C",
      },
    ])
    .onConflictDoNothing();
}

export default main;
