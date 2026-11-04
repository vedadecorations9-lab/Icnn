import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  products: defineTable({
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
  })
    .index('by_category', ['category'])
    .index('by_sku', ['sku']),

  bookings: defineTable({
    id: v.string(),
    customerName: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    city: v.string(),
    eventDate: v.string(),
    eventType: v.string(),
    items: v.array(v.string()),
    totalAUD: v.number(),
    status: v.string(), // 'Confirmed' | 'Dispatched' | 'Delivered' | 'Returned'
    carrier: v.optional(v.string()),
    tracking: v.optional(v.string()),
    date: v.optional(v.string()),
    paymentStatus: v.optional(v.string())
  }).index('by_status', ['status'])
});

