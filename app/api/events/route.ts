import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createEventEmbedding } from "@/lib/embeddings";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

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
        } catch (error) {
          console.error(`Failed to create embedding for event ${event.id}:`, error);
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

  return NextResponse.json({
    totalViews,
    uniqueVisitors,
    totalEvents: events.length,
    pageStats: Object.values(pageStats),
    recentEvents: events.slice(0, 50),
  });
}
