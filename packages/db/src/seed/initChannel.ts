import { v5 } from "uuid";
import { drizzleDB, tableChannel } from "..";
import config from "../config";
import shortUUID from "short-uuid";

function main() {
  return drizzleDB
    .insert(tableChannel)
    .values([
      {
        id: v5("firstChannel", config.admin.namespace),
        userId: v5("socool3cshop", config.admin.namespace),
        name: "好酷3c商城",
        clientId: shortUUID().fromUUID(
          v5("firstChannel", config.admin.namespace)
        ),
        clientSecret: shortUUID().fromUUID(
          v5("firstChannelSecret", config.admin.namespace)
        ),
      },
    ])
    .onConflictDoNothing();
}

export default main;
