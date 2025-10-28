import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 1000,
  });

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
