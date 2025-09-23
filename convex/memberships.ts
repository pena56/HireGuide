import { userQuery } from "./user";

export const getUserMemberships = userQuery({
  args: {},
  handler: async (ctx) => {
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userEmail", ctx.user.email))
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
