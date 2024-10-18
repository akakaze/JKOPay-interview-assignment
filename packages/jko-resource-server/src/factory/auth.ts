import { drizzleDB, UserSelect } from "@jkopay-interview-assignment/db";
import config from "@/config";
import crypto from "crypto";
import { cookies } from "next/headers";

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
    return {
      failure: "Incorrect credentials",
    };
  }

  const { password: userPassword } = userFind;
  const hashedPassword = crypto
    .createHmac("sha256", config.admin.secret)
    .update(password)
    .digest("base64");
  if (hashedPassword !== userPassword) {
    return {
      failure: "Incorrect credentials",
    };
  }

  return {
    success: "Successfully logged in",
  };
}

export async function setLoginCookie({ id }: Pick<UserSelect, "id">) {
  const nextCooies = cookies();
  nextCooies.set({
    name: "user_id",
    value: id,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}
