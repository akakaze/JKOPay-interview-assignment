import { ChannelSelect, drizzleDB } from "@jkopay-interview-assignment/db";

export async function getChannelInfo({
  clientId,
}: Pick<ChannelSelect, "clientId">) {
  const channelFind = await drizzleDB.query.tableChannel.findFirst({
    columns: {
      id: true,
      name: true,
      clientId: true,
    },
    where: (table, { eq }) => {
      return eq(table.clientId, clientId);
    },
  });
  if (!channelFind) {
    throw new Error("Channel not found");
  }

  return channelFind;
}

// 驗證 channel
export async function verifyChannel({
  clientId,
  clientSecret,
}: Pick<ChannelSelect, "clientId" | "clientSecret">) {
  const channelFind = await drizzleDB.query.tableChannel.findFirst({
    columns: {
      id: true,
      clientId: true,
      clientSecret: true,
    },
    where: (table, { eq }) => {
      return eq(table.clientId, clientId);
    },
  });
  if (!channelFind) {
    throw new Error("Channel not found");
  }

  if (channelFind.clientSecret !== clientSecret) {
    throw new Error("Incorrect client secret");
  }

  return channelFind;
}
