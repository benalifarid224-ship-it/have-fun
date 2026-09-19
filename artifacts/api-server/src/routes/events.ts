import { agentEventSchema, type AgentEvent } from "@workspace/api-zod";
import { db, eventsTable, type InsertEvent } from "@workspace/db";
import { desc } from "drizzle-orm";
import { Router, type IRouter, type RequestHandler } from "express";
import { randomUUID, timingSafeEqual } from "node:crypto";

const router: IRouter = Router();

const categoryMeta: Record<
  AgentEvent["category"],
  { label: string; icon: string; accent: string; tint: string; atmosphere: NonNullable<AgentEvent["atmosphere"]> }
> = {
  music: { label: "Music", icon: "music-note", accent: "#ff4fa4", tint: "#a977ff", atmosphere: "waves" },
  sports: { label: "Sports", icon: "soccer", accent: "#91ed77", tint: "#3dc8ff", atmosphere: "pulse" },
  drift: { label: "Cars & Drift", icon: "car-sports", accent: "#ff667c", tint: "#ff8d4d", atmosphere: "streaks" },
  food: { label: "Food", icon: "silverware-fork-knife", accent: "#ffbd63", tint: "#ff8d4d", atmosphere: "warm" },
  art: { label: "Art & Culture", icon: "palette-outline", accent: "#64f6d5", tint: "#a977ff", atmosphere: "particles" },
  gaming: { label: "Gaming", icon: "controller-classic-outline", accent: "#3dc8ff", tint: "#a977ff", atmosphere: "grid" },
  outdoor: { label: "Outdoor", icon: "weather-sunny", accent: "#50d9c2", tint: "#3dc8ff", atmosphere: "calm" },
  party: { label: "Party", icon: "party-popper", accent: "#ff8d4d", tint: "#ff4fa4", atmosphere: "pulse" },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 110);
}

function hasValidAgentToken(req: Parameters<RequestHandler>[0]) {
  const expected = process.env.AGENT_INGEST_TOKEN;
  const provided = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !provided) return false;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

const requireAgentToken: RequestHandler = (req, res, next) => {
  if (!process.env.AGENT_INGEST_TOKEN) {
    res.status(503).json({ error: "AGENT_INGEST_TOKEN is not configured" });
    return;
  }
  if (!hasValidAgentToken(req)) {
    res.status(401).json({ error: "Missing or invalid agent token" });
    return;
  }
  next();
};

function toApiEvent(row: typeof eventsTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    curiosityLine: row.curiosityLine,
    category: row.category,
    categoryLabel: row.categoryLabel,
    icon: row.icon,
    description: row.description,
    dateLabel: row.dateLabel,
    time: row.time,
    location: row.location,
    venue: row.venue,
    address: row.address,
    city: row.city,
    country: row.country,
    interested: row.interested,
    imageUrl: row.imageUrl,
    galleryUrls: row.galleryUrls,
    accent: row.accent,
    tint: row.tint,
    ticketUrl: row.ticketUrl ?? undefined,
    websiteUrl: row.websiteUrl ?? undefined,
    audioUrl: row.audioUrl ?? undefined,
    audioEnabled: row.audioEnabled,
    audioDuration: row.audioDuration ?? undefined,
    organizerName: row.organizerName ?? undefined,
    ageRequirement: row.ageRequirement ?? undefined,
    additionalInfo: row.additionalInfo ?? undefined,
    atmosphere: row.atmosphere,
    timeFilter: row.timeFilter,
  };
}

router.get("/events", async (_req, res) => {
  try {
    const rows = await db.select().from(eventsTable).orderBy(desc(eventsTable.updatedAt));
    res.json({ events: rows.map(toApiEvent) });
  } catch (error) {
    res.status(500).json({ error: "Unable to load events" });
  }
});

router.post("/events", requireAgentToken, async (req, res) => {
  const parsed = agentEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid event payload",
      issues: parsed.error.flatten(),
    });
    return;
  }

  const payload = parsed.data;
  const meta = categoryMeta[payload.category];
  const id = payload.id ?? (slugify(`${payload.title}-${payload.city}-${payload.dateLabel}`) || randomUUID());
  const values: InsertEvent = {
    id,
    title: payload.title,
    subtitle: payload.subtitle,
    curiosityLine: payload.curiosityLine,
    category: payload.category,
    categoryLabel: payload.categoryLabel ?? meta.label,
    icon: payload.icon ?? meta.icon,
    description: payload.description,
    dateLabel: payload.dateLabel,
    time: payload.time,
    location: payload.location,
    venue: payload.venue,
    address: payload.address,
    city: payload.city,
    country: payload.country,
    interested: payload.interested ?? 0,
    imageUrl: payload.imageUrl,
    galleryUrls: payload.galleryUrls ?? [],
    accent: payload.accent ?? meta.accent,
    tint: payload.tint ?? meta.tint,
    ticketUrl: payload.ticketUrl,
    websiteUrl: payload.websiteUrl,
    audioUrl: payload.audioUrl,
    audioEnabled: payload.audioEnabled ?? Boolean(payload.audioUrl),
    audioDuration: payload.audioDuration ? Math.round(payload.audioDuration) : undefined,
    organizerName: payload.organizerName,
    ageRequirement: payload.ageRequirement,
    additionalInfo: payload.additionalInfo,
    atmosphere: payload.atmosphere ?? meta.atmosphere,
    timeFilter: payload.timeFilter,
  };

  try {
    const [event] = await db
      .insert(eventsTable)
      .values(values)
      .onConflictDoUpdate({
        target: eventsTable.id,
        set: { ...values, updatedAt: new Date() },
      })
      .returning();

    res.status(201).json({ event: toApiEvent(event) });
  } catch (error) {
    res.status(500).json({ error: "Unable to save event" });
  }
});

export default router;