import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Unauthenticated");
    }

    return { ctx: { user }, args };
  },
});

export const userQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new Error("Unauthenticated");
    }

    return { ctx: { user }, args };
  },
});

export const generateUploadImageUrl = userMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
