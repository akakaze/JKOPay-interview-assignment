"use server"; // don't forget to add this!

import { actionClient } from "@/lib/safeAction";
import { schemaUserSelect } from "@jkopay-interview-assignment/db";

// This schema is used to validate input from client.
const schema = schemaUserSelect.pick({
  account: true,
  password: true,
});

export const loginUser = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { account, password } }) => {
    if (account === "johndoe" && password === "123456") {
      return {
        success: "Successfully logged in",
      };
    }

    return { failure: "Incorrect credentials" };
  });
