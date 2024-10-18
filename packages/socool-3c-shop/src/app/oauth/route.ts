import { cookies } from "next/headers";

export async function GET(request: Request) {
  console.log("GET /oauth");

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return Response.redirect("http://localhost:3000", 302);
  }

  console.log("code", code);

  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("code", code);
  body.append("client_id", "mqystbe2NDLVae9haqqU3K");
  body.append("client_secret", "wQZ8fQauTYcN7HSaWZG9FA");
  body.append("redirect_uri", "http://localhost:3000/oauth");

  try {
    const res = await fetch(`http://localhost:3001/oauth/v2/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    console.log("res", res);

    const token = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
      expriedAt: string;
    };

    const cookie = cookies();
    cookie.set({
      name: "access_token",
      value: token.accessToken,
      httpOnly: true,
      secure: true,
    });
    cookie.set({
      name: "refresh_token",
      value: token.refreshToken,
      httpOnly: true,
      secure: true,
    });
    cookie.set({
      name: "expried_at",
      value: token.expriedAt,
      httpOnly: true,
      secure: true,
    });

    console.log("token", token);

    return Response.redirect("http://localhost:3000/home", 302);
  } catch (error) {
    alert("Invalid code");
    return Response.redirect("http://localhost:3000", 302);
  }
}
