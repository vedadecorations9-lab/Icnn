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
    const { _id, _creationTime, ...cleanArgs } = args;
    return await ctx.db.insert('categories', cleanArgs);
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
    let existing = await ctx.db
      .query('categories')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (!existing) {
      try {
        existing = await ctx.db.get(args.id);
      } catch {}
    }

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

// 4. Remove category (supports matching by custom 'id' or Convex '_id')
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    let existing = await ctx.db
      .query('categories')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (!existing) {
      try {
        existing = await ctx.db.get(args.id);
      } catch {}
    }

    if (existing) {
      await ctx.db.delete(existing._id);
      return { success: true, deletedId: existing._id };
    }
    return { success: false, notFound: true };
  }
});

// 5. Seed defaults if empty
export const seedDefault = mutation({
  args: { initialCategories: v.any() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('categories').collect();
    if (existing.length === 0 && Array.isArray(args.initialCategories)) {
      for (const item of args.initialCategories) {
        const { _id, _creationTime, ...cleanItem } = item;
        await ctx.db.insert('categories', cleanItem);
      }
      return { seeded: args.initialCategories.length };
    }
    return { seeded: 0, existing: existing.length };
  }
});

// 6. Explicit Admin Reset back to official Brisbane category defaults
export const resetToDefaults = mutation({
  args: { defaultCategories: v.any() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query('categories').collect();
    for (const c of all) {
      await ctx.db.delete(c._id);
    }
    if (Array.isArray(args.defaultCategories)) {
      for (const item of args.defaultCategories) {
        const { _id, _creationTime, ...cleanItem } = item;
        await ctx.db.insert('categories', cleanItem);
      }
    }
    return { reset: true, count: args.defaultCategories?.length || 0 };
  }
});

