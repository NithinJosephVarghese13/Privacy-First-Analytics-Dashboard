import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateChatResponse, generateEmbedding } from "@/lib/openai";
import { searchSimilarEvents } from "@/lib/embeddings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const chatSchema = z.object({
  question: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = chatSchema.parse(body);

    const questionEmbedding = await generateEmbedding(data.question);

    const similarEvents = await searchSimilarEvents(questionEmbedding, 20);

    let context: string[];

    if (similarEvents.length > 0) {
      context = similarEvents.map((result) => result.summary_text);
    } else {
      const recentEvents = await prisma.event.findMany({
        where: { consentGiven: true },
        include: { page: true },
        orderBy: { timestamp: "desc" },
        take: 20,
      });

      context = recentEvents.map((event) => {
        return `Event: ${event.eventType} on ${event.page.url} (${event.page.title}) at ${event.timestamp.toISOString()}`;
      });
    }

    const answer = await generateChatResponse(data.question, context);

    return NextResponse.json({
      answer,
      contextUsed: context.length,
      usedVectorSearch: similarEvents.length > 0,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
