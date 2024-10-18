"use client"; // this is a Client Component

import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { loginForGrant } from "./loginAction";
import { z } from "zod";
import { grantAccess } from "./grantAction ";

const oauthSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.string().url(),
  response_type: z.string().regex(/^(code)$/),
  scope: z.array(z.enum(["profile", "email", "phone"])),
  state: z.string(),
});

const useOAuthParams = () => {
  /** get OAuth params */
  const searchParams = useSearchParams();
  const client_id = searchParams.get("client_id");
  const redirect_uri = searchParams.get("redirect_uri");
  const response_type = searchParams.get("response_type");
  const scope = searchParams.get("scope")?.split(" ");
  const state = searchParams.get("state");

  try {
    return oauthSchema.parse({
      client_id,
      redirect_uri,
      response_type,
      scope,
      state,
    });
  } catch (error) {
    return null;
  }
};

export default function Page() {
  const loginForGrantAction = useAction(loginForGrant);

  const oauthParams = useOAuthParams();

  // Invalid OAuth params
  if (!oauthParams) {
    return <div>Invalid OAuth params</div>;
  }

  if (loginForGrantAction.result.data?.success) {
    const { channel, user } = loginForGrantAction.result.data;
    const { client_id, redirect_uri, scope, state } = oauthParams;
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // Call grantAccess action
          const res = await grantAccess({
            userId: user.id,
            clientId: client_id,
            scope: scope,
            redirectUri: redirect_uri,
          });

          if (res?.data?.success) {
            const { code, expriedAt } = res.data.data;

            // Send authorization code to parent window
            if (window.opener) {
              window.opener.postMessage(
                {
                  type: "authorization_code",
                  code: code,
                  expriedAt: expriedAt,
                  state: state,
                  redirect_uri: redirect_uri,
                },
                "*"
              );
            }
          }
        }}
      >
        <div className="p-4 flex flex-col gap-8">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-xl">允許存取</h1>
            <h2 className="text-2xl">{channel.name}</h2>
            <h3>此服務要求存取以下項目：</h3>
          </div>
          <div>
            <ul className="list-disc">
              {scope.includes("profile") && <li>個人資料</li>}
              {scope.includes("email") && <li>電子郵件</li>}
              {scope.includes("phone") && <li>電話號碼</li>}
            </ul>
          </div>
          <div className="flex justify-center">
            <button className="px-2 py-1 bg-red-300 text-red-600" type="submit">
              允許
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form action={loginForGrantAction.execute}>
      <div className="flex flex-col gap-2">
        <div>
          <h1>街口登入</h1>
        </div>
        <div className="flex gap-1">
          <label htmlFor="account">帳號</label>
          <input
            type="text"
            id="account"
            name="account"
            placeholder="請輸入帳號"
            required
          />
        </div>
        <div className="flex gap-1">
          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="請輸入密碼"
            required
          />
        </div>
        <input
          type="hidden"
          id="clientId"
          name="clientId"
          value={oauthParams.client_id}
        />
        {loginForGrantAction.result.data?.success === false && (
          <div className="text-red-600">
            {loginForGrantAction.result.data.error.message}
          </div>
        )}
        <div>
          <button type="submit">登入</button>
        </div>
      </div>
    </form>
  );
}
