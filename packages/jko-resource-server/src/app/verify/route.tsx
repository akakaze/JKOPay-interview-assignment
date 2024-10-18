import { getUserByScope, verifyAccessToken } from "@/factory/accessFactory";
import { getChannelInfo } from "@/factory/channelFactory";
import { z } from "zod";

const reqSchema = z.object({
  token: z.string(),
  clientId: z.string(),
});

export async function POST(request: Request) {
  const body = await request.formData();
  const { clientId, token } = reqSchema.parse({
    token: body.get("token"),
    clientId: body.get("client_id"),
  });

  try {
    // Verify the client_id and client_secret
    const channel = await getChannelInfo({ clientId });
    // Create an access token
    const access = await verifyAccessToken({
      accessToken: token,
      channelId: channel.id,
    });

    // Get user info
    const { userId, scope } = access;
    const userInfo = await getUserByScope({ userId, scope });
    return new Response(JSON.stringify(userInfo), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response("Unauthorized", { status: 401 });
  }
}
