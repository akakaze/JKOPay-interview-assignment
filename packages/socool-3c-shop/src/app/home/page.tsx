"use server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookie = cookies();
  const accessToken = cookie.get("access_token")?.value;
  const refreshToken = cookie.get("refresh_token")?.value;
  const expriedAt = cookie.get("expried_at")?.value;

  if (!accessToken || !refreshToken || !expriedAt) {
    return Response.redirect("http://localhost:3000", 302);
  }

  const body = new URLSearchParams();
  body.append("token", accessToken);
  body.append("client_id", "mqystbe2NDLVae9haqqU3K");
  const a = await fetch("http://localhost:3002/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  }).then((res) => res.json());

  return (
    <div className="flex content-center justify-center">
      <div className="mt-10 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl">歡迎來到好酷 3c 商城！</h1>
          <h1 className="text-2xl">快來買買買</h1>
        </div>
        <pre>{JSON.stringify(a, null, 2)}</pre>
      </div>
    </div>
  );
}
