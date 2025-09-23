import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const generateUploadImageUrl = mutation({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError("No User found");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const createCompany = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    logo: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError("No User found");
    }

    const company = await ctx.db.insert("companies", {
      latitude: args.latitude,
      longitude: args.longitude,
      location: args.location,
      name: args.name,
      logo: args.logo,
      ownerId: user._id,
    });

    await ctx.db.insert("memberships", {
      companyId: company,
      role: "manager",
      status: "active",
      userId: user._id,
    });
  },
});
