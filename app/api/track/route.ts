import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anonymizeVisitor, getClientIp } from "@/lib/anonymize";
import { z } from "zod";

const trackSchema = z.object({
  page: z.string().url(),
  type: z.enum(["pageview", "click", "form_submit"]),
  metadata: z.record(z.any()).optional(),
  consentGiven: z.boolean().default(false),
  title: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = trackSchema.parse(body);

    const userAgent = request.headers.get("user-agent") || "";
    const ip = getClientIp(request.headers);
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
        metadata: data.metadata || {},
        consentGiven: data.consentGiven,
      },
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
