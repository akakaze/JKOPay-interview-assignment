import {
  AccessSelect,
  drizzleDB,
  UserSelect,
} from "@jkopay-interview-assignment/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function verifyAccessToken({
  accessToken,
  channelId,
}: Pick<AccessSelect, "channelId" | "accessToken">) {
  const accessFind = await drizzleDB.query.tableAccess.findFirst({
    columns: {
      id: true,
      userId: true,
      channelId: true,
      scope: true,
      expriedAt: true,
    },
    where: (table, { eq, and, gte }) => {
      return and(
        eq(table.accessToken, accessToken),
        eq(table.channelId, channelId),
        gte(table.expriedAt, dayjs().tz("Asia/Taipei").format())
      );
    },
  });

  if (!accessFind) {
    throw new Error("Invalid access token");
  }

  return accessFind;
}

export async function getUserByScope({
  userId,
  scope,
}: {
  userId: UserSelect["id"];
  scope: AccessSelect["scope"];
}) {
  const userFind = await drizzleDB.query.tableUser.findFirst({
    columns: {
      id: true,
      name: scope.includes("profile"),
      email: scope.includes("email"),
      phone: scope.includes("phone"),
      phoneCountryCode: scope.includes("phone"),
    },
    where: (table, { eq }) => {
      return eq(table.id, userId);
    },
  });
  if (!userFind) {
    throw new Error("User not found");
  }

  return userFind;
}
