import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  companies: defineTable({
    name: v.string(),
    location: v.string(),
    longitude: v.string(),
    latitude: v.string(),
    ownerId: v.string(),
    logo: v.optional(v.id("_storage")),
  }).index("by_owner", ["ownerId"]),
  memberships: defineTable({
    companyId: v.id("companies"),
    userId: v.string(),
    role: v.union(v.literal("manager"), v.literal("employee")),
    status: v.union(
      v.literal("invited"),
      v.literal("active"),
      v.literal("inactive"),
      v.literal("terminated")
    ),
  }).index("by_user", ["userId"]),
});
