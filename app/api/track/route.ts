import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anonymizeVisitor, getClientIp } from "@/lib/anonymize";
import { createEventEmbedding } from "@/lib/embeddings";
import { z } from "zod";
import { log } from "@/lib/logger";
import { ratelimit, invalidateAnalyticsCache } from "@/lib/cache";

const trackSchema = z.object({
  page: z.string().url(),
  type: z.enum(["pageview", "click", "form_submit"]),
  metadata: z.record(z.string(), z.unknown()).optional(),
  consentGiven: z.boolean().default(false),
  title: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);

    const { success, reset } = await ratelimit.limit(ip);

    if (!success) {
      const resetTime = new Date(reset * 1000);
      const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);

      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const data = trackSchema.parse(body);

    const userAgent = request.headers.get("user-agent") || "";
    const visitorHash = anonymizeVisitor(ip, userAgent);

    let page = await prisma.page.findUnique({
      where: { url: data.page },
    });

    if (!page) {
      page = await prisma.page.create({
        data: {
          url: data.page,
          title: data.title || data.page,
        },
      });
    }

    const event = await prisma.event.create({
      data: {
        pageId: page.id,
        eventType: data.type,
        visitorHash,
        userAgent,
        metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : {},
        consentGiven: data.consentGiven,
      },
    });

    if (data.consentGiven) {
      createEventEmbedding(event.id).catch((error) =>
        log.error("Failed to create embedding for event", { eventId: event.id, error: String(error) })
      );
    }

    // Invalidate analytics cache when new events are added
    invalidateAnalyticsCache().catch((error) =>
      log.error("Failed to invalidate analytics cache", { error: String(error) })
    );

    log.info("Event tracked successfully", { eventId: event.id, eventType: data.type });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    log.error("Track error", { error: String(error) });
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
