import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { userMutation, userQuery } from "./utils";

export const createProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("profile", {
      name: args.name,
      email: args.email,
      image: args.image,
    });
  },
});

export const getProfile = userQuery({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", ctx.user.email))
      .unique();

    const profileImageUrl = profile?.image
      ? await ctx.storage.getUrl(profile.image)
      : null;

    return {
      name: profile?.name,
      email: profile?.email,
      image: profile?.image,
      profileImageUrl,
    };
  },
});

export const editProfile = userMutation({
  args: {
    name: v.string(),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", ctx.user.email))
      .unique();

    if (!profile) throw new Error("No profile found");

    await ctx.db.patch(profile._id, {
      name: args.name,
      image: args.image,
    });
  },
});
