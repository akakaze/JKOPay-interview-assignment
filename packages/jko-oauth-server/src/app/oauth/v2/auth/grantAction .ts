"use server"; // don't forget to add this!

import { getChannelInfo } from "@/factory/channelFactory";
import { geneAuthorizationCode } from "@/factory/grantFactory";
import { actionClient } from "@/lib/safeAction";
import {
  schemaChannelSelect,
  schemaGrantInsert,
  schemaUserSelect,
} from "@jkopay-interview-assignment/db";
import { z } from "zod";

// This schema is used to validate input from client.
const schema = z.object({
  userId: schemaUserSelect.shape.id,
  clientId: schemaChannelSelect.shape.clientId,
  redirectUri: schemaGrantInsert.shape.redirectUri,
  scope: z.array(z.enum(["profile", "email", "phone"])),
});

export const grantAccess = actionClient.schema(schema).action<
  | {
      success: true;
      data: {
        code: string;
        expriedAt: string;
      };
    }
  | {
      success: false;
      error: {
        message: string;
        stack: string | undefined;
      };
    }
>(async ({ parsedInput: { userId, clientId, redirectUri, scope } }) => {
  try {
    // 驗證 client_id
    await getChannelInfo({ clientId });
    const data = await geneAuthorizationCode({
      userId,
      clientId,
      redirectUri,
      scope,
    });

    return { success: true, data };
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
