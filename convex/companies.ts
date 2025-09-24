import { v } from "convex/values";
import { Resend } from "@convex-dev/resend";

import { internalMutation } from "./_generated/server";
import { components } from "./_generated/api";
import { userMutation } from "./utils";

export const resend: Resend = new Resend(components.resend, {});

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

    const memebership = await ctx.db.insert("memberships", {
      companyId: company,
      role: "manager",
      status: "active",
      userEmail: ctx.user.email,
      invitedBy: ctx.user.name,
      invitedByEmail: ctx.user.email,
    });

    return company;
  },
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: "Me <test@mydomain.com>",
      to: "delivered@resend.dev",
      subject: "Hi there",
      html: "This is a test email",
    });
  },
});
