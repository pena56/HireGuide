import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserMemberships = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError("No User found");
    }

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const companies = await Promise.all(
      memberships.map(async (m) => {
        const company = await ctx.db.get(m.companyId);

        const companyLogoUrl = company?.logo
          ? await ctx.storage.getUrl(company.logo)
          : null;

        return {
          ...m,
          companyName: company?.name ?? null,
          companyLogo: companyLogoUrl,
        };
      })
    );

    return companies;
  },
});
