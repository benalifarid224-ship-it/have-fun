import { Event } from "./events";

type ApiEvent = {
  id: string;
  title: string;
  subtitle: string;
  curiosityLine: string;
  category: Event["category"];
  categoryLabel: string;
  icon: string;
  description: string;
  dateLabel: string;
  time: string;
  location: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  interested: number;
  imageUrl: string;
  galleryUrls: string[];
  accent: string;
  tint: string;
  ticketUrl?: string;
  websiteUrl?: string;
  audioUrl?: string;
  audioEnabled: boolean;
  audioDuration?: number;
  organizerName?: string;
  ageRequirement?: string;
  additionalInfo?: string;
  atmosphere: Event["atmosphere"];
  timeFilter: Event["timeFilter"];
};

function getEventsUrl() {
  const configuredBase = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
  if (configuredBase) return `${configuredBase}/api/events`;

  const domain = process.env.EXPO_PUBLIC_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return domain ? `https://${domain}/api/events` : "/api/events";
}

function mapApiEvent(item: ApiEvent): Event {
  return {
    ...item,
    image: { uri: item.imageUrl },
    galleryImages: item.galleryUrls.map((uri) => ({ uri })),
    audioSource: item.audioUrl,
  };
}

export async function fetchRemoteEvents(): Promise<Event[]> {
  const response = await fetch(getEventsUrl());
  if (!response.ok) {
    throw new Error(`Event feed returned ${response.status}`);
  }
  const payload = (await response.json()) as { events?: ApiEvent[] };
  return (payload.events ?? []).map(mapApiEvent);
}