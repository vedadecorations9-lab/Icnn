import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// 1. List all bookings
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('bookings').collect();
  }
});

// 2. Add booking
export const add = mutation({
  args: {
    id: v.string(),
    customerName: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    city: v.string(),
    eventDate: v.string(),
    eventType: v.string(),
    items: v.array(v.string()),
    totalAUD: v.number(),
    status: v.string(),
    carrier: v.optional(v.string()),
    tracking: v.optional(v.string()),
    date: v.optional(v.string()),
    paymentStatus: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('bookings', args);
  }
});

// 3. Update status
export const updateStatus = mutation({
  args: { id: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('bookings')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status });
    }
  }
});

// 4. Seed initial bookings
export const seedInitial = mutation({
  args: { initialBookings: v.any() },
  handler: async (ctx, args) => {
    const count = (await ctx.db.query('bookings').collect()).length;
    if (count === 0 && Array.isArray(args.initialBookings)) {
      for (const b of args.initialBookings) {
        await ctx.db.insert('bookings', b);
      }
      return { seeded: args.initialBookings.length };
    }
    return { seeded: 0, existing: count };
  }
});

