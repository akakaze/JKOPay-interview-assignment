import {
  AccessInsert,
  drizzleDB,
  tableAccess,
} from "@jkopay-interview-assignment/db";
import dayjs from "dayjs";
import shortUUID from "short-uuid";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function createAccessToken({
  userId,
  channelId,
  scope,
}: Pick<AccessInsert, "userId" | "channelId" | "scope">) {
  console.log("createAccessToken");

  const expriedAt = dayjs().add(1, "week").tz("Asia/Taipei").format();
  const [accessToken] = await drizzleDB
    .insert(tableAccess)
    .values({
      userId,
      channelId,
      scope,
      accessToken: shortUUID.generate(),
      refreshToken: shortUUID.generate(),
      expriedAt: expriedAt,
    })
    .returning({
      accessToken: tableAccess.accessToken,
      refreshToken: tableAccess.refreshToken,
      expriedAt: tableAccess.expriedAt,
    });

  console.log("accessToken", accessToken);

  return accessToken;
}
