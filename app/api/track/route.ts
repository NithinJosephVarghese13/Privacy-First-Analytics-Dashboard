import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anonymizeVisitor, getClientIp } from "@/lib/anonymize";
import { createEventEmbedding } from "@/lib/embeddings";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
});

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
      createEventEmbedding(event.id).catch(console.error);
    }

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
