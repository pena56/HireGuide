import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { ConvexError, v } from "convex/values";
import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

export const resend: Resend = new Resend(components.resend, {
  testMode: true,
});

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    return { ctx: { user }, args };
  },
});

export const managerMutation = customMutation(mutation, {
  args: {
    companyId: v.id("companies"),
  },
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userEmail", user.email))
      .filter((q) => q.eq(q.field("companyId"), args.companyId))
      .first();

    if (!membership || membership.role !== "manager") {
      throw new ConvexError(
        "Unauthorized: User is not a manager of this company."
      );
    }

    return { ctx: { user }, args };
  },
});

export const userQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    return { ctx: { user }, args };
  },
});

export const managerQuery = customQuery(query, {
  args: {
    companyId: v.id("companies"),
  },
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userEmail", user.email))
      .filter((q) => q.eq(q.field("companyId"), args.companyId))
      .first();

    if (!membership || membership.role !== "manager") {
      throw new ConvexError(
        "Unauthorized: User is not a manager of this company."
      );
    }

    return { ctx: { user }, args };
  },
});

export const generateUploadImageUrl = userMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
