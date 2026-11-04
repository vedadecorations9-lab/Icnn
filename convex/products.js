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
    return await ctx.db.insert('products', args);
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
    const existing = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

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

// 4. Delete product
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  }
});

// 5. Update stock
export const updateStock = mutation({
  args: { id: v.string(), stock: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('id'), args.id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { stock: Math.max(0, args.stock) });
    }
  }
});

// 6. Seed defaults if empty
export const seedDefault = mutation({
  args: { initialProducts: v.any() },
  handler: async (ctx, args) => {
    const count = (await ctx.db.query('products').collect()).length;
    if (count === 0 && Array.isArray(args.initialProducts)) {
      for (const item of args.initialProducts) {
        await ctx.db.insert('products', item);
      }
      return { seeded: args.initialProducts.length };
    }
    return { seeded: 0, existing: count };
  }
});

