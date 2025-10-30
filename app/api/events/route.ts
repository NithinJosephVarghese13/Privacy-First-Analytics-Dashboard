import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createEventEmbedding } from "@/lib/embeddings";
import { log } from "@/lib/logger";
import { ratelimit, getCachedAnalytics, setCachedAnalytics, invalidateAnalyticsCache } from "@/lib/cache";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    log.warn("Unauthorized access attempt to events API");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    log.warn("Rate limit exceeded", { ip });
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Create cache key based on query parameters
  const cacheKey = `${startDate || 'none'}-${endDate || 'none'}`;

  // Try to get cached data first
  const cachedData = await getCachedAnalytics(cacheKey);
  if (cachedData) {
    log.info("Serving cached analytics data", { cacheKey });
    return NextResponse.json(cachedData);
  }

  log.info("Fetching analytics events", { startDate, endDate });

  const where: any = {
    consentGiven: true,
  };

  const timestampFilter: any = {};

  if (startDate) {
    timestampFilter.gte = new Date(startDate);
  }

  if (endDate) {
    timestampFilter.lte = new Date(endDate);
  }

  if (Object.keys(timestampFilter).length > 0) {
    where.timestamp = timestampFilter;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      page: true,
      embeddings: true,
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 1000,
  });

  // Generate embeddings for events that don't have them yet
  const eventsWithoutEmbeddings = events.filter(event =>
    !event.embeddings || event.embeddings.length === 0
  );

  // Process embeddings asynchronously (don't block the response)
  if (eventsWithoutEmbeddings.length > 0) {
    setImmediate(async () => {
      for (const event of eventsWithoutEmbeddings.slice(0, 10)) { // Limit to 10 per request
        try {
          await createEventEmbedding(event.id);
          log.debug("Created embedding for event", { eventId: event.id });
        } catch (error) {
          log.error("Failed to create embedding for event", { eventId: event.id, error: String(error) });
        }
      }
    });
  }

  const totalViews = events.filter((e) => e.eventType === "pageview").length;

  const pageStats = events.reduce((acc: any, event) => {
    const url = event.page.url;
    if (!acc[url]) {
      acc[url] = { url, title: event.page.title, views: 0, clicks: 0 };
    }
    if (event.eventType === "pageview") acc[url].views++;
    if (event.eventType === "click") acc[url].clicks++;
    return acc;
  }, {});

  const uniqueVisitors = new Set(events.map((e) => e.visitorHash)).size;

  const result = {
    totalViews,
    uniqueVisitors,
    totalEvents: events.length,
    pageStats: Object.values(pageStats),
    recentEvents: events.slice(0, 50),
  };

  // Cache the result
  await setCachedAnalytics(cacheKey, result);

  log.info("Analytics data computed and cached", { cacheKey, totalEvents: events.length });

  return NextResponse.json(result);
}
