import { z } from "zod";

export const eventCategorySchema = z.enum([
  "music",
  "sports",
  "drift",
  "food",
  "art",
  "gaming",
  "outdoor",
  "party",
]);

export const eventAtmosphereSchema = z.enum([
  "pulse",
  "waves",
  "streaks",
  "warm",
  "particles",
  "grid",
  "calm",
]);

export const eventTimeFilterSchema = z.enum([
  "today",
  "tomorrow",
  "week",
  "month",
]);

export const agentEventSchema = z.object({
  id: z.string().trim().min(1).max(120).optional(),
  title: z.string().trim().min(1).max(180),
  subtitle: z.string().trim().min(1).max(180),
  curiosityLine: z.string().trim().min(1).max(240),
  category: eventCategorySchema,
  categoryLabel: z.string().trim().min(1).max(80).optional(),
  icon: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().min(1).max(2000),
  dateLabel: z.string().trim().min(1).max(80),
  time: z.string().trim().min(1).max(40),
  location: z.string().trim().min(1).max(120),
  venue: z.string().trim().min(1).max(180),
  address: z.string().trim().min(1).max(240),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  interested: z.number().int().nonnegative().max(100000000).optional(),
  imageUrl: z.string().url().max(2000),
  galleryUrls: z.array(z.string().url().max(2000)).max(8).optional(),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  tint: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  ticketUrl: z.string().url().max(2000).optional(),
  websiteUrl: z.string().url().max(2000).optional(),
  audioUrl: z.string().url().max(2000).optional(),
  audioEnabled: z.boolean().optional(),
  audioDuration: z.number().positive().max(600).optional(),
  organizerName: z.string().trim().max(180).optional(),
  ageRequirement: z.string().trim().max(80).optional(),
  additionalInfo: z.string().trim().max(2000).optional(),
  atmosphere: eventAtmosphereSchema.optional(),
  timeFilter: eventTimeFilterSchema,
});

export const apiEventSchema = agentEventSchema.extend({
  id: z.string(),
  categoryLabel: z.string(),
  icon: z.string(),
  interested: z.number().int().nonnegative(),
  galleryUrls: z.array(z.string().url()),
  accent: z.string(),
  tint: z.string(),
  audioEnabled: z.boolean(),
});

export type AgentEvent = z.infer<typeof agentEventSchema>;
export type ApiEvent = z.infer<typeof apiEventSchema>;