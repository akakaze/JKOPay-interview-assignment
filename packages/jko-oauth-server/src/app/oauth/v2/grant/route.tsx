import { createAccessToken } from "@/factory/accessFactory";
import { verifyChannel } from "@/factory/channelFactory";
import { verifyAuthorizationCode } from "@/factory/grantFactory";
import { z } from "zod";

const reqSchema = z.object({
  grantType: z.literal("authorization_code"),
  code: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string(),
});

export async function POST(request: Request) {
  const body = await request.formData();
  const { clientId, clientSecret, code, redirectUri } = reqSchema.parse({
    grantType: body.get("grant_type"),
    code: body.get("code"),
    clientId: body.get("client_id"),
    clientSecret: body.get("client_secret"),
    redirectUri: body.get("redirect_uri"),
  });
  const grant = await verifyAuthorizationCode({
    code,
    redirectUri,
  });

  // The authorization code MUST have the same client_id as the client_id in the request
  if (grant.clientId !== clientId) {
    return new Response("Invalid authorization code", { status: 400 });
  }

  console.log("grant", grant);

  try {
    // Verify the client_id and client_secret
    const channel = await verifyChannel({ clientId, clientSecret });
    // Create an access token
    const token = await createAccessToken({
      userId: grant.userId,
      channelId: channel.id,
      scope: grant.scope,
    });
    return new Response(JSON.stringify(token), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);

    return new Response("Unauthorized", { status: 401 });
  }
}
