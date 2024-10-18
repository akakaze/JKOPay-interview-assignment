import {
  // AccessSelect,
  // ChannelSelect,
  // UserSelect,
  drizzleDB,
  GrantInsert,
  GrantSelect,
  tableGrant,
} from "@jkopay-interview-assignment/db";
// import { sign, verify } from "jsonwebtoken";
// import config from "@/config";
import shortUUID from "short-uuid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// export async function getAuthorizationCode({
//   userId,
//   clientId,
//   scope,
// }: authorizationCode) {
//   const grant = sign(
//     {
//       userId,
//       clientId,
//       scope,
//     },
//     config.admin.secret,
//     {
//       expiresIn: "10m",
//     }
//   );

//   return grant;
// }

export async function geneAuthorizationCode({
  userId,
  clientId,
  redirectUri,
  scope,
}: Pick<GrantInsert, "userId" | "clientId" | "redirectUri" | "scope">) {
  const [codeReturn] = await drizzleDB
    .insert(tableGrant)
    .values({
      userId,
      clientId,
      redirectUri,
      scope,
      code: shortUUID.generate(),
      expriedAt: dayjs()
        .tz("Asia/Taipei")
        .add(10, "minute")
        .format("YYYY-MM-DD HH:mm:ssZ"),
    })
    .returning({
      code: tableGrant.code,
      expriedAt: tableGrant.expriedAt,
    });

  return codeReturn;
}

// 驗證 authorization code
export async function verifyAuthorizationCode({
  code,
  redirectUri,
}: Pick<GrantSelect, "code" | "redirectUri">) {
  console.log("code", code);
  console.log("redirectUri", redirectUri);

  const accessFind = await drizzleDB.query.tableGrant.findFirst({
    where: (table, { eq, and, gte }) => {
      return and(
        eq(table.code, code),
        eq(table.redirectUri, redirectUri),
        eq(table.used, false),
        gte(table.expriedAt, dayjs().tz("Asia/Taipei").format())
      );
    },
  });

  if (!accessFind) {
    throw new Error("Invalid code");
  }

  return accessFind;
}
