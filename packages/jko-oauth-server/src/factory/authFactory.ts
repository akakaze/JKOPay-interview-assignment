import { drizzleDB, UserSelect } from "@jkopay-interview-assignment/db";
import config from "@/config";
import crypto from "crypto";

export async function authValidate({
  account,
  password,
}: Pick<UserSelect, "account" | "password">) {
  const userFind = await drizzleDB.query.tableUser.findFirst({
    columns: {
      id: true,
      account: true,
      password: true,
    },
    where: (table, { eq }) => {
      return eq(table.account, account);
    },
  });
  if (!userFind) {
    throw new Error("Incorrect credentials");
  }

  const { password: userPassword } = userFind;
  const hashedPassword = crypto
    .createHmac("sha256", config.admin.secret)
    .update(password)
    .digest("base64");
  if (hashedPassword !== userPassword) {
    throw new Error("Incorrect credentials");
  }

  return {
    id: userFind.id,
    account: userFind.account,
  };
}
