import { v } from "convex/values";
import { userMutation } from "./user";

export const generateUploadImageUrl = userMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createCompany = userMutation({
  args: {
    name: v.string(),
    location: v.string(),
    latitude: v.string(),
    longitude: v.string(),
    logo: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db.insert("companies", {
      latitude: args.latitude,
      longitude: args.longitude,
      location: args.location,
      name: args.name,
      logo: args.logo,
      ownerEmail: ctx.user.email,
    });

    await ctx.db.insert("memberships", {
      companyId: company,
      role: "manager",
      status: "active",
      userEmail: ctx.user.email,
    });
  },
});
