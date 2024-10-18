"use client";
function openOAuthWindow({
  client_id,
  redirect_uri,
  response_type,
  scope,
  state,
}: {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: ("profile" | "email" | "phone")[];
  state: string;
}) {
  const url = new URL("http://localhost:3001/oauth/v2/auth");
  url.searchParams.append("response_type", response_type);
  url.searchParams.append("client_id", client_id);
  url.searchParams.append("redirect_uri", redirect_uri);
  url.searchParams.append("scope", scope.join(" "));
  url.searchParams.append("state", state);

  const windowFeatures = "left=100,top=100,width=640,height=640";
  const win = window.open(url.toString(), "jko-oauth", windowFeatures);
  if (!win) {
    alert("Please allow popups for this site");
  }
  window.addEventListener("message", (event) => {
    console.log(event.data);
    win?.close();
    location.href = `http://localhost:3000/oauth?code=${event.data.code}`;
  });
}

export default function Home() {
  return (
    <div className="p-4">
      <h1>好酷3C商城</h1>
      <div className="w-dvw flex flex-col">
        <div className="self-center flex flex-col gap-2">
          <div>
            <h1>歡迎您！請先登入</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="p-1 w-40 text-red-600 border border-red-600 bg-red-300"
              onClick={() => {
                openOAuthWindow({
                  client_id: "mqystbe2NDLVae9haqqU3K",
                  redirect_uri: "http://localhost:3000/oauth",
                  response_type: "code",
                  scope: ["profile", "email", "phone"],
                  state: "123",
                });
              }}
            >
              街口登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
