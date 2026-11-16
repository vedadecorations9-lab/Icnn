import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// 1. Fetch all products
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('products').collect();
  }
});

// 2. Add product
export const add = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    category: v.string(),
    categoryLabel: v.string(),
    priceAUD: v.number(),
    priceINR: v.optional(v.number()),
    originalAUD: v.optional(v.number()),
    discount: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewsCount: v.optional(v.number()),
    badge: v.optional(v.string()),
    badgeType: v.optional(v.string()),
    image: v.string(),
    description: v.string(),
    origin: v.optional(v.string()),
    material: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    hirePeriod: v.optional(v.string()),
    bondAUD: v.optional(v.number()),
    stock: v.number(),
    sku: v.optional(v.string()),
    pills: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    const { _id, _creationTime, ...cleanArgs } = args;
    return await ctx.db.insert('products', cleanArgs);
  }
});

// 3. Update product
export const update = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    category: v.string(),
    categoryLabel: v.string(),
    priceAUD: v.number(),
    bondAUD: v.optional(v.number()),
    stock: v.number(),
    sku: v.optional(v.string()),
    badge: v.optional(v.string()),
    image: v.string(),
    description: v.string(),
    material: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    hirePeriod: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let existing = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (!existing) {
      try {
        existing = await ctx.db.get(args.id);
      } catch {}
    }

    if (!existing) {
      throw new Error(`Product ${args.id} not found`);
    }

    await ctx.db.patch(existing._id, {
      name: args.name,
      category: args.category,
      categoryLabel: args.categoryLabel,
      priceAUD: args.priceAUD,
      bondAUD: args.bondAUD,
      stock: args.stock,
      sku: args.sku,
      badge: args.badge,
      image: args.image,
      description: args.description,
      material: args.material,
      dimensions: args.dimensions,
      hirePeriod: args.hirePeriod
    });
  }
});

// 4. Delete product (supports matching by custom 'id' or Convex '_id')
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // 1. Try matching by custom 'id' (e.g. 'icon-01')
    let existing = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    // 2. If not found, try matching by Convex document _id
    if (!existing) {
      try {
        existing = await ctx.db.get(args.id);
      } catch {}
    }

    // 3. If still not found, try matching by SKU
    if (!existing) {
      existing = await ctx.db
        .query('products')
        .filter((q) => q.eq(q.field('sku'), args.id))
        .first();
    }

    if (existing) {
      await ctx.db.delete(existing._id);
      return { success: true, deletedId: existing._id };
    }
    return { success: false, notFound: true };
  }
});

// 5. Update stock
export const updateStock = mutation({
  args: { id: v.string(), stock: v.number() },
  handler: async (ctx, args) => {
    let existing = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (!existing) {
      try {
        existing = await ctx.db.get(args.id);
      } catch {}
    }

    if (existing) {
      await ctx.db.patch(existing._id, { stock: Math.max(0, args.stock) });
    }
  }
});

// 6. Seed defaults on very first setup if database is completely empty
export const seedDefault = mutation({
  args: { initialProducts: v.any() },
  handler: async (ctx, args) => {
    const existingItems = await ctx.db.query('products').collect();
    if (existingItems.length === 0 && Array.isArray(args.initialProducts)) {
      for (const item of args.initialProducts) {
        const { _id, _creationTime, ...cleanItem } = item;
        await ctx.db.insert('products', cleanItem);
      }
      return { seeded: args.initialProducts.length };
    }
    return { seeded: 0, existing: existingItems.length };
  }
});

// 7. Explicit Admin Reset back to official Brisbane defaults
export const resetToDefaults = mutation({
  args: { defaultProducts: v.any() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query('products').collect();
    for (const p of all) {
      await ctx.db.delete(p._id);
    }
    if (Array.isArray(args.defaultProducts)) {
      for (const item of args.defaultProducts) {
        const { _id, _creationTime, ...cleanItem } = item;
        await ctx.db.insert('products', cleanItem);
      }
    }
    return { reset: true, count: args.defaultProducts?.length || 0 };
  }
});
