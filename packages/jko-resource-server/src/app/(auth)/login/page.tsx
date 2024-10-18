"use client"; // this is a Client Component

import { loginUser } from "./loginAction";

export default function Login() {
  return (
    <button
      onClick={async () => {
        // Typesafe action called from client.
        const res = await loginUser({
          account: "johndoe",
          password: "123456",
        });

        console.log({ res });

        // Result keys.
        // res?.data;
        // res?.validationErrors;
        // res?.bindArgsValidationErrors;
        // res?.serverError;
      }}
    >
      Log in
    </button>
  );
}
