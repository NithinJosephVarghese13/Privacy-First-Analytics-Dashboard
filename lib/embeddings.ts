import { prisma } from "./prisma";
import { generateEmbedding } from "./openai";

export async function createEventEmbedding(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { page: true },
    });

    if (!event) {
      return null;
    }

    const summaryText = `Event type: ${event.eventType}, Page: ${event.page.title || event.page.url}, Timestamp: ${event.timestamp.toISOString()}, Metadata: ${JSON.stringify(event.metadata)}`;

    const embedding = await generateEmbedding(summaryText);

    const result = await prisma.$executeRaw`
      INSERT INTO event_embeddings (id, event_id, embedding, summary_text, created_at)
      VALUES (gen_random_uuid(), ${eventId}::uuid, ${JSON.stringify(embedding)}::vector, ${summaryText}, NOW())
      ON CONFLICT DO NOTHING
    `;

    return result;
  } catch (error) {
    console.error("Error creating event embedding:", error);
    return null;
  }
}

export async function searchSimilarEvents(queryEmbedding: number[], limit: number = 10) {
  try {
    const results = await prisma.$queryRaw<Array<{
      event_id: string;
      summary_text: string;
      similarity: number;
    }>>`
      SELECT 
        ee.event_id,
        ee.summary_text,
        1 - (ee.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM event_embeddings ee
      ORDER BY ee.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `;

    return results;
  } catch (error) {
    console.error("Error searching similar events:", error);
    return [];
  }
}
