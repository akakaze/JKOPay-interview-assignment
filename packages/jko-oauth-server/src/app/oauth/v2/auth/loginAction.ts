"use server"; // don't forget to add this!

import { authValidate } from "@/factory/authFactory";
import { getChannelInfo } from "@/factory/channelFactory";
import { actionClient } from "@/lib/safeAction";
import {
  ChannelSelect,
  schemaChannelSelect,
  schemaUserSelect,
  UserSelect,
} from "@jkopay-interview-assignment/db";
import { zfd } from "zod-form-data";

// This schema is used to validate input from client.
const schema = zfd.formData({
  account: zfd.text(schemaUserSelect.shape.account),
  password: zfd.text(schemaUserSelect.shape.password),
  clientId: zfd.text(schemaChannelSelect.shape.clientId),
});

export const loginForGrant = actionClient.schema(schema).action<
  | {
      success: true;
      channel: Pick<ChannelSelect, "id" | "name" | "clientId">;
      user: Pick<UserSelect, "id" | "account">;
    }
  | {
      success: false;
      error: {
        message: string;
        stack: string | undefined;
      };
    }
>(async ({ parsedInput: { account, password, clientId } }) => {
  try {
    const user = await authValidate({ account, password });
    const channel = await getChannelInfo({ clientId });

    return { success: true, channel, user };
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return {
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
        },
      };
    }
    const unknownError = new Error("Unknown error");
    return {
      success: false,
      error: {
        message: unknownError.message,
        stack: unknownError.stack,
      },
    };
  }
});
