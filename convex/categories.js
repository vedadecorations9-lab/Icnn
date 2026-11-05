import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// 1. Fetch all categories
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('categories').collect();
  }
});

// 2. Add category
export const add = mutation({
  args: {
    id: v.string(),
    label: v.string(),
    shortLabel: v.optional(v.string()),
    tag: v.optional(v.string()),
    startingPrice: v.number(),
    itemCount: v.optional(v.number()),
    pills: v.optional(v.array(v.string())),
    image: v.string(),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('categories', args);
  }
});

// 3. Update category
export const update = mutation({
  args: {
    id: v.string(),
    label: v.string(),
    shortLabel: v.optional(v.string()),
    tag: v.optional(v.string()),
    startingPrice: v.number(),
    itemCount: v.optional(v.number()),
    pills: v.optional(v.array(v.string())),
    image: v.string(),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('categories')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (!existing) {
      throw new Error(`Category ${args.id} not found`);
    }

    await ctx.db.patch(existing._id, {
      label: args.label,
      shortLabel: args.shortLabel || args.label,
      tag: args.tag,
      startingPrice: args.startingPrice,
      itemCount: args.itemCount,
      pills: args.pills,
      image: args.image,
      description: args.description
    });
  }
});

// 4. Remove category
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('categories')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  }
});

// 5. Seed defaults if empty
export const seedDefault = mutation({
  args: { initialCategories: v.any() },
  handler: async (ctx, args) => {
    const count = (await ctx.db.query('categories').collect()).length;
    if (count === 0 && Array.isArray(args.initialCategories)) {
      for (const item of args.initialCategories) {
        await ctx.db.insert('categories', item);
      }
      return { seeded: args.initialCategories.length };
    }
    return { seeded: 0, existing: count };
  }
});

