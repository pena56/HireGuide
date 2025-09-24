import { ConvexError, v } from "convex/values";
import { managerMutation, resend, userMutation, userQuery } from "./utils";

export const getUserMemberships = userQuery({
  args: {},
  handler: async (ctx) => {
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userEmail", ctx.user.email))
      .filter((q) => q.eq(q.field("status"), "active"))
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

export const getMembershipInvites = userQuery({
  args: {},
  handler: async (ctx) => {
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userEmail", ctx.user.email))
      .filter((q) => q.eq(q.field("status"), "invited"))
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

export const sendInvite = managerMutation({
  args: {
    userEmail: v.string(),
    name: v.string(),
    companyId: v.id("companies"), // Inherited from managerMutation
    role: v.union(v.literal("manager"), v.literal("employee")),
  },
  handler: async (ctx, args) => {
    // 1. Check if a membership already exists for this email and company
    const existingMembership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userEmail", args.userEmail))
      .filter((q) => q.eq(q.field("companyId"), args.companyId))
      .first();

    if (existingMembership && existingMembership?.status !== "rejected") {
      throw new ConvexError("User is already a member of this company");
    }

    // 2. Insert the new membership with a 'invited' status
    const newMembershipId = await ctx.db.insert("memberships", {
      companyId: args.companyId,
      userEmail: args.userEmail,
      role: args.role,
      status: "invited",
      invitedBy: ctx.user.name,
      invitedByEmail: ctx.user.email,
    });

    // 3. Get the company details for the email content
    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new ConvexError("Company not found");
    }

    // 4. Send the invitation email using the Resend component
    await resend.sendEmail(ctx, {
      from: "delivered@resend.dev", // Your verified Resend email address
      to: "delivered@resend.dev",
      subject: `You've been invited to join ${company.name}`,
      html: `
        <h1>Invitation to Join ${company.name}</h1>
        <p>You have been invited to join ${company.name} as a ${args.role}.</p>
        <p>Please click the link below to accept the invitation and sign up:</p>
        <a href="${process.env.SITE_URL}/company/join/${args.companyId}">Join Company</a>
      `,
    });

    return { success: true, membershipId: newMembershipId };
  },
});

export const acceptInvite = userMutation({
  args: {
    membershipId: v.id("memberships"),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the membership invitation document.
    const membership = await ctx.db.get(args.membershipId);

    // 2. Validate the invitation.
    if (!membership) {
      throw new ConvexError("Invitation not found.");
    }

    if (membership.status !== "invited") {
      throw new ConvexError(
        "This invitation has already been used or is invalid."
      );
    }

    // 3. Verify that the invitation's email matches the authenticated user's email.
    if (membership.userEmail !== ctx?.user.email) {
      throw new ConvexError("This invitation is not for the current user.");
    }

    // 4. Update the membership status to 'active'.
    await ctx.db.patch(args.membershipId, {
      status: "active",
    });

    return { success: true, companyId: membership?.companyId };
  },
});

export const declineInvite = userMutation({
  args: {
    membershipId: v.id("memberships"),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the membership invitation document.
    const membership = await ctx.db.get(args.membershipId);

    // 2. Validate the invitation.
    if (!membership) {
      throw new ConvexError("Invitation not found.");
    }

    if (membership.status !== "invited") {
      throw new ConvexError(
        "This invitation has already been used or is invalid."
      );
    }

    // 3. Verify that the invitation's email matches the authenticated user's email.
    if (membership.userEmail !== ctx?.user.email) {
      throw new ConvexError("This invitation is not for the current user.");
    }

    // 4. Update the membership status to 'active'.
    await ctx.db.patch(args.membershipId, {
      status: "rejected",
    });

    return { success: true };
  },
});
